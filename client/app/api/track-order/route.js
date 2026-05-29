import { NextResponse } from "next/server";
import { STRAPI_BASE_URL } from "@/src/lib/strapiBaseUrl";
import {
  findShiprocketOrder,
  getAwbFromOrder,
  getShipmentIdFromOrder,
  getShiprocketToken,
  trackByAwb,
  trackByShipmentId,
} from "@/src/lib/server/shiprocket";
import { buildTrackingPayload } from "@/src/lib/server/trackOrderMapper";

const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || "";

function normalizeOrderId(raw) {
  return String(raw || "")
    .trim()
    .replace(/^#/, "");
}

async function verifyOrderInStrapi(orderId, email) {
  const params = new URLSearchParams({
    "filters[orderId][$eq]": orderId,
    "filters[userEmail][$eq]": email.trim().toLowerCase(),
    "pagination[pageSize]": "1",
    publicationState: "preview",
  });

  const res = await fetch(`${STRAPI_BASE_URL}/api/order-details?${params}`, {
    headers: {
      "Content-Type": "application/json",
      ...(API_TOKEN && { Authorization: `Bearer ${API_TOKEN}` }),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || "Could not verify order");
  }

  const json = await res.json();
  const orders = json.data || [];

  if (orders.length === 0) {
    return null;
  }

  const storedEmail = (orders[0].attributes?.userEmail || "").toLowerCase();
  if (storedEmail !== email.trim().toLowerCase()) {
    return null;
  }

  return orders[0];
}

export async function POST(request) {
  try {
    const body = await request.json();
    const orderId = normalizeOrderId(body.orderId);
    const email = String(body.email || "").trim();

    if (!orderId || !email) {
      return NextResponse.json(
        { error: "Order ID and email are required." },
        { status: 400 }
      );
    }

    const strapiOrder = await verifyOrderInStrapi(orderId, email);
    if (!strapiOrder) {
      return NextResponse.json(
        {
          error:
            "No order found for this ID and email. Check your confirmation email and try again.",
        },
        { status: 404 }
      );
    }

    let shiprocketOrder = null;
    let awbTracking = null;

    try {
      const token = await getShiprocketToken();
      shiprocketOrder = await findShiprocketOrder(token, orderId);

      const awb = getAwbFromOrder(shiprocketOrder);
      const shipmentId = getShipmentIdFromOrder(shiprocketOrder);

      if (awb) {
        awbTracking = await trackByAwb(token, awb);
      } else if (shipmentId) {
        awbTracking = await trackByShipmentId(token, shipmentId);
      }
    } catch (shipErr) {
      console.warn("Shiprocket tracking unavailable:", shipErr.message);
    }

    const payload = buildTrackingPayload({
      orderId,
      strapiOrder,
      shiprocketOrder,
      awbTracking,
    });

    return NextResponse.json({ success: true, data: payload });
  } catch (err) {
    console.error("Track order error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to track order. Please try again." },
      { status: 500 }
    );
  }
}
