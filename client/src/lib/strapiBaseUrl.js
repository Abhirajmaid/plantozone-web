/**
 * Strapi base URL (no trailing slash).
 * In local dev, browser requests use /strapi-api (Next.js rewrite) to avoid CORS.
 */
const DEFAULT_STRAPI_URL = "https://dashboard.plantozone.com";

/** Direct Strapi URL (env). Used for Next.js rewrites and server-side fetch. */
export const STRAPI_DIRECT_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:1337"
    : DEFAULT_STRAPI_URL);

/**
 * Base URL for API calls and media paths from the current runtime.
 * Browser → same-origin proxy `/strapi-api` (avoids CORS in dev and production).
 * Server → direct Strapi URL for SSR and API routes.
 */
export function getStrapiBaseUrl() {
  if (typeof window !== "undefined") {
    return "/strapi-api";
  }
  return STRAPI_DIRECT_URL;
}

/** @deprecated Prefer getStrapiBaseUrl() in client code */
export const STRAPI_BASE_URL = STRAPI_DIRECT_URL;
