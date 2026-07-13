import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  if (!BASE_URL) return [];

  return [
    { url: BASE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE_URL}/ebook`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/experience`, changeFrequency: "monthly", priority: 0.8 },
  ];
}
