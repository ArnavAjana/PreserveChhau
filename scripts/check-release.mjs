import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { readdir, readFile, stat } from "node:fs/promises";
import { extname, relative, resolve } from "node:path";

const root = process.cwd();
const publicRoot = resolve(root, "public");
const failures = [];

const rightsManifestPath = "ASSET_RIGHTS_PROVENANCE.json";
const thirdPartyNoticesPath = "THIRD_PARTY_NOTICES.md";
const apacheLicensePath = "THIRD_PARTY_LICENSES/Apache-2.0.txt";
const basisNoticePath = "THIRD_PARTY_LICENSES/Basis-Universal-NOTICE.txt";
const expectedApacheLicenseSha256 =
  "cfc7749b96f63bd31c3c42b5c471bf756814053e847c10f3eb003417bc523d30";
const expectedBasisNoticeSha256 =
  "a710c77f53231533f19fbc00e04a7109077f2dec74232b62a96f2ac1a1c04c85";

const forbiddenUnclearedMedia = [
  "public/audio/dholki-1.mp3",
  "public/audio/main-theme-ebook.mp3",
  "map-of-chhau/public/images/night-sky.png",
];
const approvedUserSuppliedMedia = ["public/images/arnav-ajana-about.jpg"];

async function listFiles(directory) {
  if (!existsSync(directory)) return [];
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const path = resolve(directory, entry.name);
      return entry.isDirectory() ? listFiles(path) : [path];
    }),
  );
  return nested.flat();
}

function requirePath(path) {
  if (!existsSync(resolve(root, path))) failures.push(`Missing required file: ${path}`);
}

async function sha256(path) {
  return createHash("sha256").update(await readFile(path)).digest("hex");
}

[
  "Chhau_eBook_Content.md",
  "src/content/book-pages.ts",
  "map-of-chhau/src/ChhauGlobe.jsx",
  "map-of-chhau/public/data/countries.geojson",
  "public/map-of-chhau/index.html",
  "public/map-of-chhau/data/countries.geojson",
  "public/draco/gltf/draco_decoder.js",
  "public/draco/gltf/draco_decoder.wasm",
  "public/draco/gltf/draco_wasm_wrapper.js",
  "public/basis/basis_transcoder.js",
  "public/basis/basis_transcoder.wasm",
  "public/images/arnav-ajana-about.jpg",
  rightsManifestPath,
  thirdPartyNoticesPath,
  apacheLicensePath,
  basisNoticePath,
  "THIRD_PARTY_LICENSES/Motion-MIT.txt",
  "THIRD_PARTY_LICENSES/Framer-Motion-MIT.txt",
].forEach(requirePath);

for (const path of forbiddenUnclearedMedia) {
  if (existsSync(resolve(root, path))) {
    failures.push(`Uncleared media must not be shipped: ${path}`);
  }
}

const publicAudioFiles = await listFiles(resolve(root, "public/audio"));
if (publicAudioFiles.length > 0) {
  failures.push(
    "No audio may be added to public/audio/ without a complete manifest record and an explicit release-policy update.",
  );
}

const approvedUserSuppliedMediaSet = new Set(approvedUserSuppliedMedia);
const publicImageFiles = await listFiles(resolve(root, "public/images"));
for (const path of publicImageFiles) {
  const relativePath = relative(root, path);
  if (!approvedUserSuppliedMediaSet.has(relativePath)) {
    failures.push(
      `Unapproved image in public/images/: ${relativePath}. Add a complete manifest record and an explicit release-policy update before shipping it.`,
    );
  }
}

const mapSourceImages = await listFiles(resolve(root, "map-of-chhau/public/images"));
if (mapSourceImages.length > 0) {
  failures.push(
    "Atlas source images must not be shipped without per-file creator, source, permission, licence, and notice records.",
  );
}

const atlasRemoteMediaPatterns = [
  "wikipedia.org",
  "wikimedia.org",
  "upload.wikimedia.org",
  "special:filepath",
  "night-sky.png",
];
const atlasSourceFiles = await listFiles(resolve(root, "map-of-chhau/src"));
for (const path of [resolve(root, "map-of-chhau/index.html"), ...atlasSourceFiles]) {
  if (!existsSync(path) || ![".css", ".html", ".js", ".jsx"].includes(extname(path))) {
    continue;
  }
  const source = (await readFile(path, "utf8")).toLowerCase();
  for (const pattern of atlasRemoteMediaPatterns) {
    if (source.includes(pattern)) {
      failures.push(`Atlas media lookup or uncleared image reference remains in ${relative(root, path)}: ${pattern}`);
    }
  }
}

for (const retiredComponent of [
  "src/components/AboutAuthorPhoto.tsx",
  "src/components/PageAudioPlayer.tsx",
]) {
  if (existsSync(resolve(root, retiredComponent))) {
    failures.push(`Retired uncleared-media component must not be restored: ${retiredComponent}`);
  }
}

const readerSourcePath = resolve(root, "src/components/InteractiveEbookInterface.tsx");
if (existsSync(readerSourcePath)) {
  const readerSource = await readFile(readerSourcePath, "utf8");
  if (readerSource.includes("<audio") || readerSource.includes("THEME_AUDIO_URL")) {
    failures.push("The reader must not load audio until a cleared asset is approved.");
  }
}

const mapIndexPath = resolve(publicRoot, "map-of-chhau/index.html");
if (existsSync(mapIndexPath)) {
  const mapIndex = await readFile(mapIndexPath, "utf8");
  if (!mapIndex.includes('src="./assets/')) {
    failures.push("Generated globe must use a relative JavaScript asset URL.");
  }
  if (!mapIndex.includes('href="./assets/')) {
    failures.push("Generated globe must use a relative stylesheet asset URL.");
  }
}

const mapBundleFiles = await listFiles(resolve(publicRoot, "map-of-chhau/assets"));
const mapScripts = mapBundleFiles.filter((path) => extname(path) === ".js");
const mapStyles = mapBundleFiles.filter((path) => extname(path) === ".css");
if (mapScripts.length !== 1 || mapStyles.length !== 1) {
  failures.push(
    `Expected one generated globe script and stylesheet; found ${mapScripts.length} JS and ${mapStyles.length} CSS files.`,
  );
}

for (const path of [mapIndexPath, ...mapBundleFiles]) {
  if (!existsSync(path) || ![".css", ".html", ".js"].includes(extname(path))) continue;
  const output = (await readFile(path, "utf8")).toLowerCase();
  for (const pattern of atlasRemoteMediaPatterns) {
    if (output.includes(pattern)) {
      failures.push(`Generated atlas contains a remote or uncleared media reference: ${pattern}`);
    }
  }
}

const legacyPublicPath = resolve(publicRoot, "models/chhau-web-assets");
if (existsSync(legacyPublicPath)) {
  const legacyPublicFiles = await listFiles(legacyPublicPath);
  if (legacyPublicFiles.length > 0) {
    failures.push("Unreviewed legacy models must not be shipped from public/.");
  }
}

const legacyArchivePath = resolve(root, "archive/legacy-models");
if (existsSync(legacyArchivePath)) {
  const legacyArchiveFiles = await listFiles(legacyArchivePath);
  if (legacyArchiveFiles.length > 0) {
    failures.push("Unreviewed legacy models must not be restored to this repository.");
  }
}

let rightsManifest = null;
if (existsSync(resolve(root, rightsManifestPath))) {
  try {
    rightsManifest = JSON.parse(await readFile(resolve(root, rightsManifestPath), "utf8"));
  } catch (error) {
    failures.push(
      `Invalid ${rightsManifestPath}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

const manifestedPaths = new Set();
if (rightsManifest) {
  if (rightsManifest.schemaVersion !== 1) {
    failures.push(`${rightsManifestPath} must use schemaVersion 1.`);
  }
  if (rightsManifest.projectLicenseStatus?.status !== "no-broad-project-license") {
    failures.push(`${rightsManifestPath} must state that no broad project licence is granted.`);
  }
  if (!Array.isArray(rightsManifest.assets) || rightsManifest.assets.length === 0) {
    failures.push(`${rightsManifestPath} must contain at least one retained asset record.`);
  } else {
    for (const asset of rightsManifest.assets) {
      const requiredFields = [
        "path",
        "status",
        "component",
        "creator",
        "upstreamProject",
        "distributionSource",
        "distributionPackage",
        "distributionVersion",
        "distributionRevision",
        "upstreamComponentVersion",
        "distributionUrl",
        "distributionIntegrity",
        "sha256",
        "license",
        "licenseFile",
        "noticeFile",
      ];
      for (const field of requiredFields) {
        if (typeof asset[field] !== "string" || asset[field].trim() === "") {
          failures.push(`Asset record ${asset.path ?? "<unknown>"} is missing ${field}.`);
        }
      }
      if (asset.status !== "cleared-third-party") {
        failures.push(`Retained asset ${asset.path ?? "<unknown>"} is not cleared-third-party.`);
      }
      if (
        asset.distributionPackage !== "three" ||
        asset.distributionVersion !== "0.184.0" ||
        !asset.distributionRevision?.endsWith("/r184")
      ) {
        failures.push(`Retained decoder ${asset.path ?? "<unknown>"} lacks its exact three r184 distribution record.`);
      }
      if (asset.modified !== false) {
        failures.push(`Retained decoder ${asset.path ?? "<unknown>"} must remain unmodified.`);
      }
      if (asset.license !== "Apache-2.0" || asset.licenseFile !== apacheLicensePath) {
        failures.push(`Retained decoder ${asset.path ?? "<unknown>"} lacks its Apache-2.0 record.`);
      }
      if (asset.component === "Basis Universal transcoder") {
        if (asset.copyrightNotice !== "Copyright © 2016–2026 Binomial LLC") {
          failures.push(`Basis asset ${asset.path ?? "<unknown>"} has an incorrect copyright notice.`);
        }
        if (asset.upstreamNoticeFile !== basisNoticePath) {
          failures.push(`Basis asset ${asset.path ?? "<unknown>"} lacks its upstream NOTICE record.`);
        }
      }
      if (manifestedPaths.has(asset.path)) {
        failures.push(`Duplicate asset-manifest path: ${asset.path}`);
      }
      manifestedPaths.add(asset.path);

      const absolutePath = resolve(root, asset.path ?? "");
      if (!existsSync(absolutePath)) {
        failures.push(`Manifested asset is missing: ${asset.path}`);
      } else if (typeof asset.sha256 === "string") {
        const actualHash = await sha256(absolutePath);
        if (actualHash !== asset.sha256) {
          failures.push(
            `Manifest hash mismatch for ${asset.path}: expected ${asset.sha256}, found ${actualHash}`,
          );
        }
      }
    }
  }

  if (!Array.isArray(rightsManifest.authoredMedia) || rightsManifest.authoredMedia.length !== 1) {
    failures.push(`${rightsManifestPath} must contain exactly one user-supplied media record.`);
  } else {
    const authoredMediaPaths = new Set();
    for (const media of rightsManifest.authoredMedia) {
      const requiredFields = [
        "path",
        "status",
        "mediaType",
        "title",
        "subject",
        "creator",
        "suppliedBy",
        "permissionEvidence",
        "permissionScope",
        "credit",
        "reuseTerms",
        "sha256",
      ];
      for (const field of requiredFields) {
        if (typeof media[field] !== "string" || media[field].trim() === "") {
          failures.push(`User-supplied media record ${media.path ?? "<unknown>"} is missing ${field}.`);
        }
      }
      if (media.status !== "user-supplied-with-explicit-publication-request") {
        failures.push(`User-supplied media ${media.path ?? "<unknown>"} lacks the required status.`);
      }
      if (media.path !== "public/images/arnav-ajana-about.jpg") {
        failures.push(`Unexpected user-supplied media path: ${media.path ?? "<unknown>"}`);
      }
      if (media.subject !== "Arnav Ajana" || !media.suppliedBy?.startsWith("Arnav Ajana")) {
        failures.push(`Author photograph ${media.path ?? "<unknown>"} lacks its subject and supplier record.`);
      }
      if (media.creator !== "Photographer not identified in the supplied record") {
        failures.push(`Author photograph ${media.path ?? "<unknown>"} must not claim an unidentified photographer.`);
      }
      if (!media.permissionEvidence?.includes("2026-07-14")) {
        failures.push(`Author photograph ${media.path ?? "<unknown>"} lacks dated permission evidence.`);
      }
      if (!media.reuseTerms?.includes("No standalone or general reuse licence is granted")) {
        failures.push(`Author photograph ${media.path ?? "<unknown>"} lacks its reuse restriction.`);
      }
      if (authoredMediaPaths.has(media.path) || manifestedPaths.has(media.path)) {
        failures.push(`Duplicate asset-manifest path: ${media.path}`);
      }
      authoredMediaPaths.add(media.path);
      manifestedPaths.add(media.path);

      const absolutePath = resolve(root, media.path ?? "");
      if (!existsSync(absolutePath)) {
        failures.push(`Manifested user-supplied media is missing: ${media.path}`);
      } else if (typeof media.sha256 === "string") {
        const actualHash = await sha256(absolutePath);
        if (actualHash !== media.sha256) {
          failures.push(
            `Manifest hash mismatch for ${media.path}: expected ${media.sha256}, found ${actualHash}`,
          );
        }
      }
    }
    for (const path of approvedUserSuppliedMedia) {
      if (!authoredMediaPaths.has(path)) {
        failures.push(`${rightsManifestPath} must record approved user-supplied media: ${path}.`);
      }
    }
  }

  const withheldPaths = new Set(
    Array.isArray(rightsManifest.withheldAssets)
      ? rightsManifest.withheldAssets.map((asset) => asset.formerPath)
      : [],
  );
  for (const path of forbiddenUnclearedMedia) {
    if (!withheldPaths.has(path)) {
      failures.push(`${rightsManifestPath} must record the removal of ${path}.`);
    }
  }
  for (const path of approvedUserSuppliedMedia) {
    if (withheldPaths.has(path)) {
      failures.push(`${rightsManifestPath} must not mark approved user-supplied media as withheld: ${path}.`);
    }
  }

  if (!Array.isArray(rightsManifest.mapAssets) || rightsManifest.mapAssets.length !== 1) {
    failures.push(`${rightsManifestPath} must contain exactly one map-geometry record.`);
  } else {
    const mapAsset = rightsManifest.mapAssets[0];
    const requiredMapFields = [
      "path",
      "generatedPath",
      "status",
      "dataset",
      "creator",
      "upstreamSource",
      "termsUrl",
      "distributionSource",
      "distributionFile",
      "distributionUrl",
      "distributionIntegrity",
      "sourceSha256",
      "sha256",
      "modifications",
      "license",
    ];
    for (const field of requiredMapFields) {
      if (typeof mapAsset[field] !== "string" || mapAsset[field].trim() === "") {
        failures.push(`Map-geometry record is missing ${field}.`);
      }
    }
    if (
      mapAsset.status !== "public-domain-data" ||
      mapAsset.license !== "Public domain" ||
      !mapAsset.termsUrl?.includes("naturalearthdata.com/about/terms-of-use")
    ) {
      failures.push("Map geometry lacks its Natural Earth public-domain record.");
    }
    for (const path of [mapAsset.path, mapAsset.generatedPath]) {
      const absolutePath = resolve(root, path ?? "");
      if (!existsSync(absolutePath)) {
        failures.push(`Map-geometry file is missing: ${path}`);
      } else if (typeof mapAsset.sha256 === "string") {
        const actualHash = await sha256(absolutePath);
        if (actualHash !== mapAsset.sha256) {
          failures.push(
            `Map-geometry hash mismatch for ${path}: expected ${mapAsset.sha256}, found ${actualHash}`,
          );
        }
      }
    }
    const distributedSourcePath = resolve(
      root,
      "node_modules/three-globe",
      mapAsset.distributionFile ?? "",
    );
    if (!existsSync(distributedSourcePath)) {
      failures.push(`Natural Earth distribution source is missing: ${mapAsset.distributionFile}`);
    } else if (typeof mapAsset.sourceSha256 === "string") {
      const sourceHash = await sha256(distributedSourcePath);
      if (sourceHash !== mapAsset.sourceSha256) {
        failures.push(
          `Natural Earth distribution-source hash mismatch: expected ${mapAsset.sourceSha256}, found ${sourceHash}`,
        );
      }
    }
  }

  if (
    !Array.isArray(rightsManifest.removedRemoteMedia) ||
    rightsManifest.removedRemoteMedia.length !== 8
  ) {
    failures.push(
      `${rightsManifestPath} must record all eight attribution-required Commons files as not distributed.`,
    );
  } else {
    const remoteTitles = new Set();
    for (const media of rightsManifest.removedRemoteMedia) {
      for (const field of ["fileTitle", "creator", "license", "licenseUrl", "sourcePage"]) {
        if (typeof media[field] !== "string" || media[field].trim() === "") {
          failures.push(`Removed Commons record ${media.fileTitle ?? "<unknown>"} is missing ${field}.`);
        }
      }
      if (media.status !== "not-distributed") {
        failures.push(`Removed Commons record ${media.fileTitle ?? "<unknown>"} is not marked not-distributed.`);
      }
      if (remoteTitles.has(media.fileTitle)) {
        failures.push(`Duplicate removed Commons record: ${media.fileTitle}`);
      }
      remoteTitles.add(media.fileTitle);
    }
  }
}

if (existsSync(resolve(root, apacheLicensePath))) {
  const licenseHash = await sha256(resolve(root, apacheLicensePath));
  if (licenseHash !== expectedApacheLicenseSha256) {
    failures.push(`${apacheLicensePath} is not the verified complete Apache-2.0 text.`);
  }
}

if (existsSync(resolve(root, basisNoticePath))) {
  const noticeHash = await sha256(resolve(root, basisNoticePath));
  if (noticeHash !== expectedBasisNoticeSha256) {
    failures.push(`${basisNoticePath} does not match the recorded upstream NOTICE.`);
  }
}

if (existsSync(resolve(root, thirdPartyNoticesPath))) {
  const notices = await readFile(resolve(root, thirdPartyNoticesPath), "utf8");
  for (const requiredNotice of [
    "docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository",
    "github.com/google/draco",
    "github.com/BinomialLLC/basis_universal",
    apacheLicensePath,
    basisNoticePath,
    "naturalearthdata.com/about/terms-of-use",
    "commons.wikimedia.org/wiki/File:",
    "public/images/arnav-ajana-about.jpg",
    "Photograph supplied by Arnav Ajana.",
  ]) {
    if (!notices.includes(requiredNotice)) {
      failures.push(`${thirdPartyNoticesPath} is missing required notice: ${requiredNotice}`);
    }
  }
}

const publicFiles = await listFiles(publicRoot);
const hashes = new Map();
for (const path of publicFiles) {
  const relativePath = relative(root, path);
  const fileStat = await stat(path);
  if (fileStat.size > 25 * 1024 * 1024) {
    failures.push(
      `Public asset exceeds 25 MiB: ${relativePath} (${Math.ceil(fileStat.size / 1024 / 1024)} MiB)`,
    );
  }

  const digest = await sha256(path);
  const previous = hashes.get(digest);
  if (previous) {
    failures.push(
      `Exact duplicate public assets: ${relative(root, previous)} and ${relativePath}`,
    );
  } else {
    hashes.set(digest, path);
  }

  const isGeneratedMapFile = relativePath.startsWith("public/map-of-chhau/");
  const isApprovedModelPlaceholder =
    relativePath === "public/models/chhau-approved/.gitkeep";
  if (
    !isGeneratedMapFile &&
    !isApprovedModelPlaceholder &&
    !manifestedPaths.has(relativePath)
  ) {
    failures.push(`Non-map public asset lacks a rights manifest record: ${relativePath}`);
  }
}

if (failures.length > 0) {
  console.error("Release verification failed:\n");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log(
    `Release verification passed: ${publicFiles.length} public files, one local globe bundle, ${rightsManifest?.assets?.length ?? 0} rights-manifested decoder files, ${rightsManifest?.authoredMedia?.length ?? 0} approved user-supplied media file, one provenance-checked public-domain geometry file, eight removed Commons records, no uncleared media, no exact public duplicates, and no oversized public assets.`,
  );
}
