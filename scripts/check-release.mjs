import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { readdir, readFile, stat } from "node:fs/promises";
import { extname, relative, resolve } from "node:path";

const root = process.cwd();
const publicRoot = resolve(root, "public");
const failures = [];

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

[
  "Chhau_eBook_Content.md",
  "src/content/book-pages.ts",
  "map-of-chhau/src/ChhauGlobe.jsx",
  "map-of-chhau/public/data/countries.geojson",
  "map-of-chhau/public/images/night-sky.png",
  "public/map-of-chhau/index.html",
  "public/map-of-chhau/data/countries.geojson",
  "public/map-of-chhau/images/night-sky.png",
  "public/audio/dholki-1.mp3",
  "public/audio/main-theme-ebook.mp3",
  "public/images/arnav-ajana-about.jpg",
  "public/draco/gltf/draco_decoder.js",
  "public/draco/gltf/draco_decoder.wasm",
  "public/draco/gltf/draco_wasm_wrapper.js",
  "public/basis/basis_transcoder.js",
  "public/basis/basis_transcoder.wasm",
].forEach(requirePath);

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

const publicFiles = await listFiles(publicRoot);
const hashes = new Map();
for (const path of publicFiles) {
  const fileStat = await stat(path);
  if (fileStat.size > 25 * 1024 * 1024) {
    failures.push(
      `Public asset exceeds 25 MiB: ${relative(root, path)} (${Math.ceil(fileStat.size / 1024 / 1024)} MiB)`,
    );
  }

  const digest = createHash("sha256")
    .update(await readFile(path))
    .digest("hex");
  const previous = hashes.get(digest);
  if (previous) {
    failures.push(
      `Exact duplicate public assets: ${relative(root, previous)} and ${relative(root, path)}`,
    );
  } else {
    hashes.set(digest, path);
  }
}

if (failures.length > 0) {
  console.error("Release verification failed:\n");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log(
    `Release verification passed: ${publicFiles.length} public files, one local globe bundle, no exact public duplicates, and no oversized public assets.`,
  );
}
