import { strapiServerFetch } from "./strapiServer";
import { DEFAULT_BANNER_CODE } from "@/src/lib/promoConstants";
import {
  expireStalePromoCodes,
  isBannerEligible,
  isPromoExpired,
} from "./promoExpiry";

/** Built-in promos when DB is empty or Strapi is unreachable */
const FALLBACK_PROMOS = {
  FIRST125: {
    code: "FIRST125",
    discountPercent: 25,
    description: "25% off your first order",
    isActive: true,
    firstOrderOnly: true,
    showInBanner: true,
    minOrderAmount: 0,
    maxUses: null,
    usedCount: 0,
  },
  OXY30: {
    code: "OXY30",
    discountPercent: 30,
    description: "30% off",
    isActive: true,
    firstOrderOnly: false,
    showInBanner: false,
    minOrderAmount: 0,
    maxUses: null,
    usedCount: 0,
  },
};

export async function findPromoByCode(code) {
  const normalized = String(code || "")
    .trim()
    .toUpperCase();
  if (!normalized) return null;

  try {
    const params = new URLSearchParams({
      "filters[code][$eq]": normalized,
      "pagination[pageSize]": "1",
    });

    const { ok, data } = await strapiServerFetch(`/promo-codes?${params}`);

    if (ok) {
      const list = data?.data || [];
      if (list[0]) return list[0];
    }
  } catch (err) {
    console.error("findPromoByCode:", err.message);
  }

  if (FALLBACK_PROMOS[normalized]) {
    return { id: null, attributes: FALLBACK_PROMOS[normalized] };
  }

  return null;
}

export async function countPaidOrdersForEmail(email) {
  if (!email) return 0;
  const params = new URLSearchParams({
    "filters[userEmail][$eq]": email.trim().toLowerCase(),
    "filters[status][$eq]": "paid",
    "pagination[pageSize]": "1",
    publicationState: "preview",
  });

  const { ok, data } = await strapiServerFetch(`/order-details?${params}`);
  if (!ok) return 0;
  return data.meta?.pagination?.total ?? 0;
}

export function validatePromoRecord(promo, { subtotal = 0, email } = {}) {
  const attrs = promo?.attributes || promo;
  if (!attrs) {
    return { valid: false, error: "Invalid promo code." };
  }

  if (attrs.isActive === false) {
    return { valid: false, error: "This promo code is no longer active." };
  }

  const now = Date.now();
  if (attrs.validFrom && now < new Date(attrs.validFrom).getTime()) {
    return { valid: false, error: "This promo code is not valid yet." };
  }
  if (isPromoExpired(attrs, now)) {
    return { valid: false, error: "This promo code has expired." };
  }

  const code = String(attrs.code || "").toUpperCase();
  if (code !== DEFAULT_BANNER_CODE && !attrs.validUntil) {
    return {
      valid: false,
      error: "This promo code is not valid (missing expiry).",
    };
  }

  const min = Number(attrs.minOrderAmount || 0);
  if (min > 0 && Number(subtotal) < min) {
    return {
      valid: false,
      error: `Minimum order amount is ₹${min.toLocaleString("en-IN")}.`,
    };
  }

  const maxUses = attrs.maxUses != null ? Number(attrs.maxUses) : null;
  const used = Number(attrs.usedCount || 0);
  if (maxUses != null && maxUses > 0 && used >= maxUses) {
    return { valid: false, error: "This promo code has reached its usage limit." };
  }

  return {
    valid: true,
    id: promo.id,
    code: attrs.code,
    discountPercent: Number(attrs.discountPercent),
    description: attrs.description || "",
    firstOrderOnly: !!attrs.firstOrderOnly,
  };
}

export async function validatePromoCode(code, { subtotal, email }) {
  await expireStalePromoCodes();

  const normalized = String(code || "")
    .trim()
    .toUpperCase();

  let promo = await findPromoByCode(normalized);

  if (!promo && FALLBACK_PROMOS[normalized]) {
    promo = { id: null, attributes: FALLBACK_PROMOS[normalized] };
  }

  if (!promo) {
    return { valid: false, error: "Invalid promo code. Please try again." };
  }

  const result = validatePromoRecord(promo, { subtotal, email });
  if (!result.valid) return result;

  if (result.firstOrderOnly && email) {
    try {
      const orderCount = await countPaidOrdersForEmail(email);
      if (orderCount > 0) {
        return {
          valid: false,
          error: "This code is valid for first orders only.",
        };
      }
    } catch {
      /* allow first-order code if order lookup fails */
    }
  }

  return result;
}

export async function incrementPromoUsage(code) {
  const promo = await findPromoByCode(code);
  if (!promo?.id) return;

  const used = Number(promo.attributes?.usedCount || 0);
  await strapiServerFetch(`/promo-codes/${promo.id}`, {
    method: "PUT",
    body: JSON.stringify({
      data: { usedCount: used + 1 },
    }),
  });
}

export async function getBannerPromo() {
  await expireStalePromoCodes();

  const fb = FALLBACK_PROMOS[DEFAULT_BANNER_CODE];

  const params = new URLSearchParams({
    "filters[isActive][$eq]": "true",
    "filters[showInBanner][$eq]": "true",
    "pagination[pageSize]": "50",
  });

  const { ok, data } = await strapiServerFetch(`/promo-codes?${params}`);

  if (!ok) {
    return {
      code: fb.code,
      discountPercent: fb.discountPercent,
      description: fb.description,
      isDefault: true,
    };
  }

  const eligible = (data.data || []).filter((p) =>
    isBannerEligible(p.attributes)
  );

  const defaultPromo = eligible.find(
    (p) =>
      String(p.attributes?.code || "").toUpperCase() === DEFAULT_BANNER_CODE
  );
  const promo = defaultPromo || eligible[0];

  if (!promo) {
    return {
      code: fb.code,
      discountPercent: fb.discountPercent,
      description: fb.description,
      isDefault: true,
    };
  }

  const attrs = promo.attributes;
  return {
    code: attrs.code,
    discountPercent: Number(attrs.discountPercent),
    description: attrs.description,
    isDefault:
      String(attrs.code || "").toUpperCase() === DEFAULT_BANNER_CODE,
  };
}
