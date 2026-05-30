/**
 * Strapi base URL (no trailing slash).
 * In local dev, browser requests use /strapi-api (Next.js rewrite) to avoid CORS.
 */
const RAILWAY_STRAPI_URL = "https://plantozone-web-production.up.railway.app";

/** Direct Strapi URL (env). Used for Next.js rewrites and server-side fetch. */
export const STRAPI_DIRECT_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:1337"
    : RAILWAY_STRAPI_URL);

/**
 * Base URL for API calls and media paths from the current runtime.
 * Browser + development → same-origin proxy `/strapi-api`
 */
export function getStrapiBaseUrl() {
  if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    return "/strapi-api";
  }
  return STRAPI_DIRECT_URL;
}

/** @deprecated Prefer getStrapiBaseUrl() in client code */
export const STRAPI_BASE_URL = STRAPI_DIRECT_URL;
