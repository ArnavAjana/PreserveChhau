const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/+$/, "");

/**
 * Prefixes files served from public/ with the GitHub Pages project path.
 * Next.js handles basePath for Link, but public asset URLs need this explicitly.
 */
export function withBasePath(path: string): string {
  if (!basePath || !path.startsWith("/") || path.startsWith("//")) return path;
  if (path === basePath || path.startsWith(`${basePath}/`)) return path;
  return `${basePath}${path}`;
}
