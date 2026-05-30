import { getStrapiBaseUrl } from "./strapiBaseUrl";

function pickMediaUrl(media) {
  if (!media) return null;

  const attrs =
    media?.data?.attributes ??
    media?.attributes ??
    (typeof media?.url === "string" ? media : null);

  if (!attrs) return null;

  return (
    attrs.url ??
    attrs.formats?.large?.url ??
    attrs.formats?.medium?.url ??
    attrs.formats?.small?.url ??
    attrs.formats?.thumbnail?.url ??
    null
  );
}

/**
 * Resolve Strapi media (v4 populate shapes) to an absolute URL for next/image or <img>.
 */
export function getStrapiMediaUrl(media, fallback = "") {
  const url = pickMediaUrl(media);
  if (!url || String(url).trim() === "") return fallback;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const path = url.startsWith("/") ? url : `/${url}`;
  return `${getStrapiBaseUrl()}${path}`;
}

/** Build absolute or proxied URL for a Strapi media path */
export function resolveMediaPath(url) {
  if (!url || String(url).trim() === "") return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const path = url.startsWith("/") ? url : `/${url}`;
  return `${getStrapiBaseUrl()}${path}`;
}

export function isExternalMediaUrl(url) {
  return (
    typeof url === "string" &&
    (url.startsWith("http://") || url.startsWith("https://"))
  );
}
