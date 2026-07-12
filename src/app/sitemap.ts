import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://preservechhau.example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE_URL}/ebook`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/experience`, changeFrequency: "monthly", priority: 0.8 },
  ];
}
