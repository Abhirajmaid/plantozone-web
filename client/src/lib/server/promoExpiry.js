import { strapiServerFetch } from "./strapiServer";
import { DEFAULT_BANNER_CODE } from "@/src/lib/promoConstants";

export function isPromoExpired(attrs, now = Date.now()) {
  if (!attrs?.validUntil) return false;
  return now > new Date(attrs.validUntil).getTime();
}

export function isPromoNotYetValid(attrs, now = Date.now()) {
  if (!attrs?.validFrom) return false;
  return now < new Date(attrs.validFrom).getTime();
}

/** Whether this code may appear in the top discount bar right now */
export function isBannerEligible(attrs, now = Date.now()) {
  if (attrs?.isActive === false) return false;
  if (!attrs?.showInBanner) return false;

  const code = String(attrs.code || "").toUpperCase();
  if (code === DEFAULT_BANNER_CODE) return true;

  if (isPromoNotYetValid(attrs, now)) return false;
  if (!attrs.validUntil) return false;
  if (isPromoExpired(attrs, now)) return false;

  return true;
}

/**
 * Deactivate expired promos (except FIRST125) and remove them from the top banner.
 */
export async function expireStalePromoCodes() {
  try {
    const { ok, data } = await strapiServerFetch(
      "/promo-codes?pagination[pageSize]=200"
    );
    if (!ok) return;

    const now = Date.now();

    for (const promo of data.data || []) {
      const attrs = promo.attributes || {};
      const code = String(attrs.code || "").toUpperCase();
      if (code === DEFAULT_BANNER_CODE) continue;
      if (!attrs.validUntil) continue;

      if (now > new Date(attrs.validUntil).getTime()) {
        if (attrs.isActive !== false || attrs.showInBanner) {
          await strapiServerFetch(`/promo-codes/${promo.id}`, {
            method: "PUT",
            body: JSON.stringify({
              data: { isActive: false, showInBanner: false },
            }),
          });
        }
      }
    }
  } catch (err) {
    console.warn("expireStalePromoCodes:", err.message);
  }
}

/**
 * @param {object} payload - fields being saved
 * @param {{ isCreate?: boolean, existing?: object }} options - existing Strapi attributes for partial updates
 */
export function validatePromoPayload(payload, { isCreate = false, existing = null } = {}) {
  const attrs = { ...(existing || {}), ...payload };
  const code = String(attrs.code || "").trim().toUpperCase();
  const isDefault = code === DEFAULT_BANNER_CODE;

  if (isCreate && !code) {
    return { ok: false, error: "Promo code is required." };
  }

  if (!isCreate && !code && !existing?.code) {
    return { ok: false, error: "Promo code is required." };
  }

  if (isCreate && !isDefault && !attrs.validUntil) {
    return {
      ok: false,
      error: "Valid until (expiry date & time) is required for new promo codes.",
    };
  }

  if (!isDefault && attrs.showInBanner && !attrs.validUntil) {
    return {
      ok: false,
      error: "Set an expiry date before showing a code in the top banner.",
    };
  }

  if (attrs.validUntil) {
    const until = new Date(attrs.validUntil).getTime();
    if (Number.isNaN(until)) {
      return { ok: false, error: "Invalid expiry date." };
    }
    if (isCreate && !isDefault && until <= Date.now()) {
      return { ok: false, error: "Expiry must be in the future." };
    }
  }

  return { ok: true };
}
