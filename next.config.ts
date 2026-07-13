import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  reactStrictMode: true,
  async headers() {
    const securityHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), geolocation=(), microphone=()",
      },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
    ];

    return [
      { headers: securityHeaders, source: "/:path*" },
      {
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; connect-src 'self' https://en.wikipedia.org; font-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'self'",
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
            value: "public, max-age=604800, stale-while-revalidate=86400",
          },
        ],
        source: "/(audio|basis|draco|map-of-chhau/data|map-of-chhau/images)/:path*",
      },
    ];
  },
};

export default nextConfig;
