import { STRAPI_DIRECT_URL } from "@/src/lib/strapiBaseUrl";

/** Server-only Strapi token (never expose in client bundle if possible). */
export function getStrapiServerToken() {
  return (
    process.env.STRAPI_API_TOKEN ||
    process.env.NEXT_PUBLIC_STRAPI_API_TOKEN ||
    ""
  );
}

export async function strapiServerFetch(path, options = {}) {
  const token = getStrapiServerToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${STRAPI_DIRECT_URL}/api${path}`, {
      ...options,
      headers,
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    console.error("Strapi fetch failed:", path, err.message);
    return { ok: false, status: 0, data: {} };
  }
}
