import { STRAPI_BASE_URL } from "./strapiBaseUrl";

/**
 * Resolve Strapi media (v4 populate shapes) to an absolute URL for next/image or <img>.
 */
export function getStrapiMediaUrl(media, fallback = "/images/plant.png") {
  if (!media) return fallback;

  const url =
    media?.data?.attributes?.url ??
    media?.attributes?.url ??
    media?.url ??
    null;

  if (!url || String(url).trim() === "") return fallback;
  if (url.startsWith("http")) return url;
  return `${STRAPI_BASE_URL}${url.startsWith("/") ? url : `/${url}`}`;
}

export function isExternalMediaUrl(url) {
  return typeof url === "string" && url.startsWith("http");
}
