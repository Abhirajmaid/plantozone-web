const SHIPROCKET_BASE = "https://apiv2.shiprocket.in/v1/external";

export async function getShiprocketToken() {
  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "Shiprocket credentials are not configured. Set SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD."
    );
  }

  const res = await fetch(`${SHIPROCKET_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok || !data.token) {
    throw new Error(data.message || "Shiprocket authentication failed");
  }

  return data.token;
}

async function shiprocketGet(path, token) {
  const res = await fetch(`${SHIPROCKET_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

/** Find order by channel order id (Razorpay order id stored at checkout) */
export async function findShiprocketOrder(token, channelOrderId) {
  const id = channelOrderId.trim();

  const show = await shiprocketGet(
    `/orders/show/${encodeURIComponent(id)}`,
    token
  );
  if (show.ok && show.data?.data) {
    return show.data.data;
  }

  const search = await shiprocketGet(
    `/orders?search=${encodeURIComponent(id)}&per_page=10`,
    token
  );
  const list = search.data?.data || [];
  if (!Array.isArray(list) || list.length === 0) return null;

  const exact = list.find(
    (o) =>
      String(o.channel_order_id || "") === id ||
      String(o.order_id || "") === id
  );
  return exact || list[0];
}

export async function trackByAwb(token, awb) {
  if (!awb) return null;
  const { ok, data } = await shiprocketGet(
    `/courier/track/awb/${encodeURIComponent(awb)}`,
    token
  );
  return ok ? data : null;
}

export async function trackByShipmentId(token, shipmentId) {
  if (!shipmentId) return null;
  const { ok, data } = await shiprocketGet(
    `/courier/track/shipment/${encodeURIComponent(shipmentId)}`,
    token
  );
  return ok ? data : null;
}

export function getAwbFromOrder(shiprocketOrder) {
  if (!shiprocketOrder) return null;
  if (shiprocketOrder.awb_code) return shiprocketOrder.awb_code;
  const shipments = shiprocketOrder.shipments;
  if (Array.isArray(shipments) && shipments[0]?.awb) {
    return shipments[0].awb;
  }
  return null;
}

export function getShipmentIdFromOrder(shiprocketOrder) {
  if (!shiprocketOrder) return null;
  if (shiprocketOrder.shipment_id) return shiprocketOrder.shipment_id;
  const shipments = shiprocketOrder.shipments;
  if (Array.isArray(shipments) && shipments[0]?.id) {
    return shipments[0].id;
  }
  return null;
}
