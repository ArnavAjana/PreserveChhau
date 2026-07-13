import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const mapRoot = fileURLToPath(new URL(".", import.meta.url));
const outputRoot = fileURLToPath(
  new URL("../public/map-of-chhau", import.meta.url),
);

export default defineConfig({
  base: "./",
  plugins: [react()],
  publicDir: "public",
  root: mapRoot,
  build: {
    chunkSizeWarningLimit: 2200,
    emptyOutDir: true,
    outDir: outputRoot,
    sourcemap: false,
  },
});
