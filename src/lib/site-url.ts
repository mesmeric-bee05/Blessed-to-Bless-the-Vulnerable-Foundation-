/** Canonical origin used for metadata, canonical tags, the sitemap and JSON-LD. */
export function siteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.bbvf.org";
  return raw.replace(/\/+$/, "");
}

export function absoluteUrl(path = "/"): string {
  return `${siteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}
