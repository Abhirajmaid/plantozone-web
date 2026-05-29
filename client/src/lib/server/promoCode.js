import { STRAPI_BASE_URL } from "@/src/lib/strapiBaseUrl";

const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || "";

async function strapiFetch(path) {
  const res = await fetch(`${STRAPI_BASE_URL}/api${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(API_TOKEN && { Authorization: `Bearer ${API_TOKEN}` }),
    },
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

export async function findPromoByCode(code) {
  const normalized = String(code || "")
    .trim()
    .toUpperCase();
  if (!normalized) return null;

  const params = new URLSearchParams({
    "filters[code][$eq]": normalized,
    "pagination[pageSize]": "1",
  });

  const { ok, data } = await strapiFetch(`/promo-codes?${params}`);
  if (!ok) return null;
  const list = data.data || [];
  return list[0] || null;
}

export async function countPaidOrdersForEmail(email) {
  if (!email) return 0;
  const params = new URLSearchParams({
    "filters[userEmail][$eq]": email.trim().toLowerCase(),
    "filters[status][$eq]": "paid",
    "pagination[pageSize]": "1",
    publicationState: "preview",
  });

  const { ok, data } = await strapiFetch(`/order-details?${params}`);
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
  if (attrs.validUntil && now > new Date(attrs.validUntil).getTime()) {
    return { valid: false, error: "This promo code has expired." };
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
  const promo = await findPromoByCode(code);
  if (!promo) {
    return { valid: false, error: "Invalid promo code. Please try again." };
  }

  const result = validatePromoRecord(promo, { subtotal, email });
  if (!result.valid) return result;

  if (result.firstOrderOnly && email) {
    const orderCount = await countPaidOrdersForEmail(email);
    if (orderCount > 0) {
      return {
        valid: false,
        error: "This code is valid for first orders only.",
      };
    }
  }

  return result;
}

export async function incrementPromoUsage(code) {
  const promo = await findPromoByCode(code);
  if (!promo?.id) return;

  const used = Number(promo.attributes?.usedCount || 0);
  await fetch(`${STRAPI_BASE_URL}/api/promo-codes/${promo.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(API_TOKEN && { Authorization: `Bearer ${API_TOKEN}` }),
    },
    body: JSON.stringify({
      data: { usedCount: used + 1 },
    }),
  });
}

export async function getBannerPromo() {
  const params = new URLSearchParams({
    "filters[isActive][$eq]": "true",
    "filters[showInBanner][$eq]": "true",
    sort: "updatedAt:desc",
    "pagination[pageSize]": "1",
  });

  const { ok, data } = await strapiFetch(`/promo-codes?${params}`);
  if (!ok) return null;
  const promo = (data.data || [])[0];
  if (!promo) return null;
  const attrs = promo.attributes;
  return {
    code: attrs.code,
    discountPercent: Number(attrs.discountPercent),
    description: attrs.description,
  };
}
