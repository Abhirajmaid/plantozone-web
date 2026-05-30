const LAST_ORDER_KEY = "lastOrder";

export function saveLastOrder(order) {
  if (typeof window === "undefined" || !order?.orderId) return;
  sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
}

export function getLastOrder() {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(LAST_ORDER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.orderId ? parsed : null;
  } catch {
    return null;
  }
}

export function getEstimatedDelivery(fromDate) {
  const d = fromDate ? new Date(fromDate) : new Date();
  d.setDate(d.getDate() + 7);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Map Strapi order-detail record → checkout success UI shape */
export function mapStrapiOrderToLastOrder(record) {
  if (!record) return null;
  const attrs = record.attributes || record;
  const items = Array.isArray(attrs.items) ? attrs.items : [];
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price || 0) * (item.quantity || 1),
    0
  );
  const total = Number(attrs.total) || subtotal;

  return {
    orderId: attrs.orderId || "",
    paymentId: attrs.paymentId || "",
    email: (attrs.userEmail || "").trim().toLowerCase(),
    userName: attrs.userName || "",
    userPhone: attrs.userPhone || "",
    paymentMethod: "Razorpay (Online)",
    address: attrs.address || "",
    city: attrs.city || "",
    state: attrs.state || "",
    pincode: attrs.pincode || "",
    items,
    subtotal,
    total,
    discountAmount: Math.max(0, subtotal - total),
    discountCode: "",
    placedAt: attrs.createdAt || new Date().toISOString(),
  };
}
