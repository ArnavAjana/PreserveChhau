import type { NextConfig } from "next";

const isGitHubPagesExport = process.env.GITHUB_PAGES === "true";
const basePath = (
  process.env.PAGES_BASE_PATH ??
  process.env.NEXT_PUBLIC_BASE_PATH ??
  ""
).replace(/\/+$/, "");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), geolocation=(), microphone=()",
  },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
];

const nextConfig: NextConfig = {
  devIndicators: false,
  reactStrictMode: true,
  ...(isGitHubPagesExport
    ? {
        basePath,
        images: { unoptimized: true },
        output: "export" as const,
        trailingSlash: true,
      }
    : {
        async headers() {
          return [
            { headers: securityHeaders, source: "/:path*" },
            {
              headers: [
                {
                  key: "Content-Security-Policy",
                  value:
                    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self'; font-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'self'",
                },
              ],
              source: "/map-of-chhau/:path*",
            },
            {
              headers: [
                {
                  key: "Cache-Control",
                  value: "public, max-age=31536000, immutable",
                },
              ],
              source: "/map-of-chhau/assets/:path*",
            },
            {
              headers: [
                {
                  key: "Cache-Control",
                  value:
                    "public, max-age=604800, stale-while-revalidate=86400",
                },
              ],
              source: "/(basis|draco|map-of-chhau/data)/:path*",
            },
          ];
        },
      }),
};

export default nextConfig;
