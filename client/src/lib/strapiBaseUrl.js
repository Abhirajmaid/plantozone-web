/**
 * Strapi base URL (no trailing slash).
 * Prefer NEXT_PUBLIC_STRAPI_URL or NEXT_PUBLIC_API_URL in .env / .env.production.
 */
const RAILWAY_STRAPI_URL = "https://plantozone-web-production.up.railway.app";

export const STRAPI_BASE_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:1337"
    : RAILWAY_STRAPI_URL);
