const STRAPI_BASE_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "https://dashboard.plantozone.com";
const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || "";

/**
 * Fetch published team members from Strapi, sorted by order.
 * Used on the About Us page. Uses API token when set so the request is allowed
 * even if Strapi Public role has no permission on team-members.
 */
async function getTeamMembers() {
  try {
    const url = `${STRAPI_BASE_URL}/api/team-members?populate=image&sort=order:asc&publicationState=live`;
    const headers = {
      "Content-Type": "application/json",
      ...(API_TOKEN && { Authorization: `Bearer ${API_TOKEN}` }),
    };
    const res = await fetch(url, {
      headers,
      next: { revalidate: 10 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json.data) ? json.data : [];
  } catch {
    return [];
  }
}

export default { getTeamMembers };
