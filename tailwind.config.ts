import type { Config } from "tailwindcss";

/**
 * Tailwind CSS v4 is configured in CSS — the custom palette (laterite,
 * marigold, midnight, ivory) and typography tokens live in the @theme
 * block of src/app/globals.css. This file pins content paths for tools
 * that still read a JS config.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
};

export default config;
