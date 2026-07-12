import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Static assets, including the prebuilt Map of Chhau globe bundle
    "public/**",
    // Source material (raw assets, the standalone globe app's own tree)
    "Chau_Web_Assets/**",
  ]),
]);

export default eslintConfig;
