/** Main site-wide default promo — always used when no other banner promo is valid */
export const DEFAULT_BANNER_CODE = "FIRST125";

export function isDefaultPromoCode(code) {
  return (
    String(code || "")
      .trim()
      .toUpperCase() === DEFAULT_BANNER_CODE
  );
}

/** Default expiry for new codes (datetime-local value) */
export function defaultValidUntilDateTime(daysAhead = 30) {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  d.setHours(23, 59, 0, 0);
  return d.toISOString().slice(0, 16);
}

export function formatPromoExpiry(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
