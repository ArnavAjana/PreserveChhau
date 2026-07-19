import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { readdir, readFile, stat } from "node:fs/promises";
import { extname, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";

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
const approvedUserSuppliedMedia = [
  "public/images/arnav-ajana-about.jpg",
  "public/images/arnav-ajana-dance.png",
];
const approvedUserSuppliedMediaExpectations = new Map([
  [
    "public/images/arnav-ajana-about.jpg",
    {
      creator: "Wahyu M.",
      credit: "Photograph by Wahyu M.",
      displayCredit: true,
      permissionDate: "2026-07-14",
    },
  ],
  [
    "public/images/arnav-ajana-dance.png",
    {
      creator: "Photographer not identified in the supplied record",
      credit:
        "No visible credit requested by Arnav Ajana; photographer not identified in the supplied record.",
      displayCredit: false,
      permissionDate: "2026-07-19",
    },
  ],
]);
const approvedPrototypeModels = [
  ["chhau-figure-5a81ddf6.glb", 28751596, "66f98d28c4b84dad5db8eb9ca33d91feec79bb337ee4674da243f4d5c0e79bbb", "9b67be3b6d2a32737866b3e57a3554a273079b1a"],
  ["chhau-group-1.glb", 31412360, "393d833784a5f75750bf906391252a057f08a8df5de421f2360e8229a151f9d7", "8f9f4fe62b9a10decd3d18365df1502df82a889f"],
  ["dance-troupe.glb", 58838248, "0845164c71c98589340d0777f917c1f3c02cbaf47b734afcca4503151ee26453", "d24512ddfac2379c7f7501a355ddd43ebcc2b9b4"],
  ["dancer-character.glb", 31065172, "ef9ac662d61679c2f28f75047e0ecca74437ab8e03ed3a2054267bce40f5889f", "a69ba9f1d47816a584ee89b2c2440c9a7d7ce79e"],
  ["human-figure-copy.glb", 29068768, "e683c39403f518a4cae6cfb62aef9a98e8f28dff48acad2cf58f156e5932e52c", "2c8ec7d5bb6b1dc0387e5854defaf97ac2036520"],
  ["human-figure.glb", 29740348, "64e8a9b8fe4c0f1b0d521fb6e411a93e27ea65617143257b3e01c37782d9ca76", "ba0939fcdcf968693a47bf3a0b7ff64b0cb1f80a"],
  ["longsword.glb", 24083824, "1baa9fde12c3bcdeb1d642e0c4bc62fa439725f7af1eb2486c1ac0aef194321b", "336b65c0c0102e7b42c9e6676986c80d03030d36"],
  ["martial-artist-2.glb", 29692544, "cbd6de6cf5884c1fa8169fcd682cf016f40194536dbd7e1355981f226cfd29f9", "233610e6c2be33b0e46f201f23dd7f70aa3ecbe5"],
  ["martial-artist-copy-2.glb", 29553164, "bd2631c699cb07d738c7a56e6b196a3c8152f7345ce9b303119f5f20e04fa01f", "810cb21a954219839a799082058fd3b96c1c059a"],
  ["martial-artist-copy.glb", 28999220, "5c5c9625e9e65e8ffef4f4eecffe6f3d35de36d3ba6c836b0374b9af1aec0be3", "011ea00123e206bb596f538502b72a7d81e57b64"],
  ["martial-artist-duo.glb", 30208160, "58e93d3361b5c8d9fa151d62d84628b7d8dae7985aac61d2d4a829764cc86893", "76b0a556a1c81c026ba241e74d040fa9f85477ab"],
  ["martial-artist-with-sword.glb", 28559496, "bd77c18768a0e70501308072b964d3b42a8c9a3812787c9b0a3ed56f8d1abbe5", "e8415f3c00266e7628c3af513f18a8dc137aadd0"],
  ["martial-artist.glb", 31324908, "01118522a9488db44b7c9696d9b0da06d2619159ac73b73e2a6d990b4f3042e3", "cf26ea14d32bd97f684a7e02572a76917043d51c"],
  ["performing-dancers.glb", 30013920, "4964a5d622af4779474cc9e630a7989fe19fa048de676ab08ff9e18a39a950f2", "4304ca0637d9a4dce5a773d843f340b6587da8b5"],
  ["round-shield.glb", 30687460, "9979c58a00de0eedbfef887a2d2ecb7e82e166fed4fd5c2505fcb131c43db3f4", "79f8f04274e0ccd9e882f513f12b5e3f0629edc3"],
  ["traditional-dancer-copy.glb", 31255260, "fa10cb799daceb1ea1aa2c6d9bd59725bbe9eb9bd9dcb5ed174937606e306ec5", "c9671ae980d790806cbb582e40d45a23fff76316"],
  ["traditional-dancer.glb", 30503892, "f04c48b0ea85a1b34f44af4a451733b928297972e46e6d325eb6a696a891ed5b", "268c121a90f18c801d9d08025c6e099027303842"],
].map(([filename, byteLength, sha256, gitBlobSha1]) => ({
  byteLength,
  gitBlobSha1,
  path: `public/models/chhau-web-assets/${filename}`,
  sha256,
}));
const approvedPrototypeModelByPath = new Map(
  approvedPrototypeModels.map((model) => [model.path, model]),
);
const sha256Cache = new Map();

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

async function requireUncreditedDanceImage(path, containerTag, className) {
  const absolutePath = resolve(root, path);
  if (!existsSync(absolutePath)) {
    failures.push(`Missing source file for dance-image credit check: ${path}`);
    return;
  }

  const source = await readFile(absolutePath, "utf8");
  const classMarker = `className="${className}"`;
  const markerIndex = source.indexOf(classMarker);
  const containerStart = source.lastIndexOf(`<${containerTag}`, markerIndex);
  const containerEnd = source.indexOf(`</${containerTag}>`, markerIndex);

  if (markerIndex < 0 || containerStart < 0 || containerEnd < 0) {
    failures.push(`Dance-image container ${className} is missing from ${path}.`);
    return;
  }

  const container = source.slice(
    containerStart,
    containerEnd + containerTag.length + 3,
  );
  if (!container.includes('src="/images/arnav-ajana-dance.png"')) {
    failures.push(`Dance-image container ${className} does not load the approved photograph.`);
  }
  if (container.includes("<figcaption") || /credit/i.test(container)) {
    failures.push(`Dance-image container ${className} must not display a credit or caption.`);
  }
}

async function sha256(path) {
  if (sha256Cache.has(path)) return sha256Cache.get(path);
  const digest = createHash("sha256").update(await readFile(path)).digest("hex");
  sha256Cache.set(path, digest);
  return digest;
}

[
  "Chhau_eBook_Content.md",
  "src/content/book-pages.ts",
  "map-of-chhau/src/ChhauGlobe.jsx",
  "map-of-chhau/VENUE_RESEARCH_REGISTER.md",
  "map-of-chhau/public/data/countries.geojson",
  "public/map-of-chhau/index.html",
  "public/map-of-chhau/data/countries.geojson",
  "public/draco/gltf/draco_decoder.js",
  "public/draco/gltf/draco_decoder.wasm",
  "public/draco/gltf/draco_wasm_wrapper.js",
  "public/basis/basis_transcoder.js",
  "public/basis/basis_transcoder.wasm",
  "public/images/arnav-ajana-about.jpg",
  "public/images/arnav-ajana-dance.png",
  rightsManifestPath,
  thirdPartyNoticesPath,
  apacheLicensePath,
  basisNoticePath,
  "THIRD_PARTY_LICENSES/Motion-MIT.txt",
  "THIRD_PARTY_LICENSES/Framer-Motion-MIT.txt",
].forEach(requirePath);

await requireUncreditedDanceImage(
  "src/components/AboutAuthorProfile.tsx",
  "figure",
  "about-author-dance",
);
await requireUncreditedDanceImage(
  "src/app/(site)/about/page.tsx",
  "section",
  "about-dance-moment",
);

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

const atlasDataPath = resolve(root, "map-of-chhau/src/data.js");
if (existsSync(atlasDataPath)) {
  try {
    const { CATEGORIES, chhauGeodata } = await import(
      `${pathToFileURL(atlasDataPath).href}?release-check=${Date.now()}`
    );
    const venueRecords = chhauGeodata.filter(
      (record) => record.recordType === "performance-venue",
    );
    const ids = new Set();

    if (!CATEGORIES.some((category) => category.key === "venue")) {
      failures.push("Atlas categories must expose the documented performance venue layer.");
    }
    if (venueRecords.length === 0) {
      failures.push("Atlas must contain at least one documented performance venue record.");
    }

    for (const record of chhauGeodata) {
      if (ids.has(record.id)) failures.push(`Duplicate atlas record id: ${record.id}`);
      ids.add(record.id);
      if (record.categorization === "venue" && record.recordType !== "performance-venue") {
        failures.push(`Atlas venue category has the wrong record type: ${record.id}`);
      }
    }

    for (const record of venueRecords) {
      for (const field of [
        "venue",
        "city",
        "country",
        "coordinateBasis",
        "detail",
        "sourceLabel",
        "sourceTitle",
        "sourceUrl",
        "evidenceType",
        "date",
        "verifiedAt",
      ]) {
        if (typeof record[field] !== "string" || record[field].trim() === "") {
          failures.push(`Atlas venue ${record.id} is missing ${field}.`);
        }
      }
      if (record.categorization !== "venue") {
        failures.push(`Atlas performance venue is outside the venue category: ${record.id}`);
      }
      if (!Number.isFinite(record.lat) || !Number.isFinite(record.lng)) {
        failures.push(`Atlas venue has invalid coordinates: ${record.id}`);
      }
      if (!record.sourceUrl?.startsWith("https://")) {
        failures.push(`Atlas venue must use a direct HTTPS evidence link: ${record.id}`);
      }
      if (/wikipedia\.org/i.test(record.sourceUrl ?? "")) {
        failures.push(`Atlas venue cannot rely on Wikipedia as performance evidence: ${record.id}`);
      }
    }
  } catch (error) {
    failures.push(
      `Atlas venue data could not be validated: ${error instanceof Error ? error.message : String(error)}`,
    );
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
const legacyPublicFiles = await listFiles(legacyPublicPath);
for (const path of legacyPublicFiles) {
  const relativePath = relative(root, path);
  if (!approvedPrototypeModelByPath.has(relativePath)) {
    failures.push(`Unapproved recovered model in public/: ${relativePath}`);
  }
}
for (const model of approvedPrototypeModels) requirePath(model.path);

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

  if (
    !Array.isArray(rightsManifest.authoredMedia) ||
    rightsManifest.authoredMedia.length !== approvedUserSuppliedMedia.length
  ) {
    failures.push(
      `${rightsManifestPath} must contain exactly ${approvedUserSuppliedMedia.length} user-supplied media records.`,
    );
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
      const expectation = approvedUserSuppliedMediaExpectations.get(media.path);
      if (!expectation) {
        failures.push(`Unexpected user-supplied media path: ${media.path ?? "<unknown>"}`);
      }
      if (media.subject !== "Arnav Ajana" || !media.suppliedBy?.startsWith("Arnav Ajana")) {
        failures.push(`Author photograph ${media.path ?? "<unknown>"} lacks its subject and supplier record.`);
      }
      if (expectation && media.creator !== expectation.creator) {
        failures.push(
          `Author photograph ${media.path ?? "<unknown>"} has an unexpected creator record.`,
        );
      }
      if (expectation && media.credit !== expectation.credit) {
        failures.push(
          `Author photograph ${media.path ?? "<unknown>"} has an unexpected credit record.`,
        );
      }
      if (expectation && media.displayCredit !== expectation.displayCredit) {
        failures.push(
          `Author photograph ${media.path ?? "<unknown>"} has an unexpected visible-credit setting.`,
        );
      }
      if (
        expectation &&
        !media.permissionEvidence?.includes(expectation.permissionDate)
      ) {
        failures.push(
          `Author photograph ${media.path ?? "<unknown>"} lacks dated permission evidence.`,
        );
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

  const prototypePolicy = rightsManifest.prototypeModelPolicy;
  const requiredPrototypePolicyFields = [
    "status",
    "mediaType",
    "creatorWorkflow",
    "sourceCommit",
    "publicationInstruction",
    "permissionScope",
    "reuseTerms",
    "culturalStatus",
    "technicalStatus",
  ];
  if (!prototypePolicy || typeof prototypePolicy !== "object") {
    failures.push(`${rightsManifestPath} must contain a prototype-model policy.`);
  } else {
    for (const field of requiredPrototypePolicyFields) {
      if (
        typeof prototypePolicy[field] !== "string" ||
        prototypePolicy[field].trim() === ""
      ) {
        failures.push(`Prototype-model policy is missing ${field}.`);
      }
    }
    if (prototypePolicy.status !== "user-directed-generic-prototype") {
      failures.push("Prototype models must retain their user-directed generic status.");
    }
    if (
      prototypePolicy.sourceCommit !==
      "27c346b7d6612360c84df56b5ab69d8d260ecb96"
    ) {
      failures.push("Prototype models must retain their exact recovery commit.");
    }
    if (!prototypePolicy.publicationInstruction?.includes("2026-07-15")) {
      failures.push("Prototype-model policy lacks dated publication instruction.");
    }
    const culturalStatus = prototypePolicy.culturalStatus?.toLowerCase() ?? "";
    if (
      !culturalStatus.includes("not practitioner-reviewed") ||
      !culturalStatus.includes("not evidence")
    ) {
      failures.push(
        "Prototype-model policy must state that the meshes are not practitioner-reviewed and not evidence.",
      );
    }
    if (!prototypePolicy.reuseTerms?.includes("does not grant reuse")) {
      failures.push("Prototype-model policy must not imply a general reuse licence.");
    }
  }

  const prototypeRecords = rightsManifest.prototypeModels;
  const manifestedPrototypePaths = new Set();
  if (
    !Array.isArray(prototypeRecords) ||
    prototypeRecords.length !== approvedPrototypeModels.length
  ) {
    failures.push(
      `${rightsManifestPath} must contain exactly ${approvedPrototypeModels.length} prototype-model records.`,
    );
  } else {
    for (const model of prototypeRecords) {
      for (const field of ["path", "gitBlobSha1", "sha256"]) {
        if (typeof model[field] !== "string" || model[field].trim() === "") {
          failures.push(`Prototype-model record ${model.path ?? "<unknown>"} is missing ${field}.`);
        }
      }
      if (!Number.isInteger(model.byteLength) || model.byteLength <= 0) {
        failures.push(`Prototype-model record ${model.path ?? "<unknown>"} has an invalid byteLength.`);
      }

      const expected = approvedPrototypeModelByPath.get(model.path);
      if (!expected) {
        failures.push(`Unexpected prototype-model record: ${model.path ?? "<unknown>"}`);
        continue;
      }
      if (manifestedPrototypePaths.has(model.path) || manifestedPaths.has(model.path)) {
        failures.push(`Duplicate asset-manifest path: ${model.path}`);
        continue;
      }
      manifestedPrototypePaths.add(model.path);
      manifestedPaths.add(model.path);

      if (
        model.byteLength !== expected.byteLength ||
        model.sha256 !== expected.sha256 ||
        model.gitBlobSha1 !== expected.gitBlobSha1
      ) {
        failures.push(`Prototype-model record does not match the approved bytes: ${model.path}`);
      }

      const absolutePath = resolve(root, model.path);
      if (!existsSync(absolutePath)) {
        failures.push(`Manifested prototype model is missing: ${model.path}`);
        continue;
      }
      const fileStat = await stat(absolutePath);
      if (fileStat.size !== expected.byteLength) {
        failures.push(
          `Prototype-model size mismatch for ${model.path}: expected ${expected.byteLength}, found ${fileStat.size}`,
        );
      }
      const actualHash = await sha256(absolutePath);
      if (actualHash !== expected.sha256) {
        failures.push(
          `Prototype-model hash mismatch for ${model.path}: expected ${expected.sha256}, found ${actualHash}`,
        );
      }
    }
    for (const expected of approvedPrototypeModels) {
      if (!manifestedPrototypePaths.has(expected.path)) {
        failures.push(`${rightsManifestPath} must record prototype model: ${expected.path}.`);
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

const manuscriptPath = resolve(root, "Chhau_eBook_Content.md");
if (existsSync(manuscriptPath)) {
  const manuscript = await readFile(manuscriptPath, "utf8");
  const pageMarkers = Array.from(
    manuscript.matchAll(/<!-- BOOK_PAGE (\{.*\}) -->/g),
  );
  const allocatedPrototypeCounts = new Map();
  const forbiddenPrototypeLabel =
    /\b(?:Chhau|Mayurbhanj|Seraikella|Purulia|chauk|chali|chaali|bhangi|ufli|topka)\b/i;

  for (const [index, marker] of pageMarkers.entries()) {
    let page;
    try {
      page = JSON.parse(marker[1]);
    } catch (error) {
      failures.push(
        `Invalid BOOK_PAGE metadata near ${marker.index}: ${error instanceof Error ? error.message : String(error)}`,
      );
      continue;
    }

    const bodyStart = (marker.index ?? 0) + marker[0].length;
    const bodyEnd = pageMarkers[index + 1]?.index ?? manuscript.length;
    const body = manuscript.slice(bodyStart, bodyEnd);
    const options = [
      ...(typeof page.modelUrl === "string"
        ? [{ label: page.title ?? "3D study", modelUrl: page.modelUrl }]
        : []),
      ...(Array.isArray(page.modelOptions) ? page.modelOptions : []),
    ];

    for (const option of options) {
      if (
        typeof option.modelUrl !== "string" ||
        !option.modelUrl.startsWith("/models/chhau-web-assets/")
      ) {
        continue;
      }
      const publicPath = `public${option.modelUrl}`;
      if (!approvedPrototypeModelByPath.has(publicPath)) {
        failures.push(
          `Page ${page.id ?? "<unknown>"} references an unapproved recovered model: ${option.modelUrl}`,
        );
        continue;
      }
      if (
        typeof option.label !== "string" ||
        !option.label.toLowerCase().includes("prototype")
      ) {
        failures.push(
          `Recovered model on page ${page.id ?? "<unknown>"} must have a prototype label: ${option.modelUrl}`,
        );
      }
      if (forbiddenPrototypeLabel.test(option.label ?? "")) {
        failures.push(
          `Recovered model label on page ${page.id ?? "<unknown>"} assigns an unsupported Chhau or regional identity: ${option.label}`,
        );
      }
      if (
        typeof option.description !== "string" ||
        option.description.trim().length < 80
      ) {
        failures.push(
          `Recovered model on page ${page.id ?? "<unknown>"} needs a model-specific description of at least 80 characters: ${option.modelUrl}`,
        );
      } else if (!/not evidence/i.test(option.description)) {
        failures.push(
          `Recovered model description on page ${page.id ?? "<unknown>"} must state what the prototype is not evidence of: ${option.modelUrl}`,
        );
      }
      if (!/not evidence of/i.test(body) || !/>\s+3D prototype:/i.test(body)) {
        failures.push(
          `Page ${page.id ?? "<unknown>"} must identify recovered models as 3D prototypes which are not evidence of Chhau practice.`,
        );
      }
      allocatedPrototypeCounts.set(
        publicPath,
        (allocatedPrototypeCounts.get(publicPath) ?? 0) + 1,
      );
    }
  }

  for (const expected of approvedPrototypeModels) {
    const allocationCount = allocatedPrototypeCounts.get(expected.path) ?? 0;
    if (allocationCount !== 1) {
      failures.push(
        `Recovered model must appear exactly once in the eBook; found ${allocationCount} allocations for ${expected.path}.`,
      );
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
    "public/images/arnav-ajana-dance.png",
    "Photograph by Wahyu M.",
    "No visible byline",
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
  const approvedPrototypeModel = approvedPrototypeModelByPath.get(relativePath);
  if (extname(path).toLowerCase() === ".glb" && !approvedPrototypeModel) {
    failures.push(`Unapproved GLB in public/: ${relativePath}`);
  }
  if (fileStat.size > 25 * 1024 * 1024 && !approvedPrototypeModel) {
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
    `Release verification passed: ${publicFiles.length} public files, one local globe bundle, ${rightsManifest?.assets?.length ?? 0} rights-manifested decoder files, ${rightsManifest?.authoredMedia?.length ?? 0} approved user-supplied media files, ${rightsManifest?.prototypeModels?.length ?? 0} user-directed generic 3D prototypes, one provenance-checked public-domain geometry file, eight removed Commons records, no uncleared media, no exact public duplicates, and no unapproved oversized public assets.`,
  );
}
