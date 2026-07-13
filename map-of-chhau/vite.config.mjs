import { rmSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const mapRoot = fileURLToPath(new URL(".", import.meta.url));
const outputRoot = fileURLToPath(
  new URL("../public/map-of-chhau", import.meta.url),
);

export default defineConfig({
  base: "./",
  plugins: [
    react(),
    {
      name: "clear-generated-map-bundle",
      buildStart() {
        rmSync(resolve(outputRoot, "assets"), {
          force: true,
          recursive: true,
        });
        rmSync(resolve(outputRoot, "index.html"), {
          force: true,
        });
      },
    },
  ],
  publicDir: false,
  root: mapRoot,
  build: {
    chunkSizeWarningLimit: 2200,
    emptyOutDir: false,
    outDir: outputRoot,
    sourcemap: false,
  },
});
