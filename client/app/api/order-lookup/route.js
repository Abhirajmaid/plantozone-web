import { NextResponse } from "next/server";
import { strapiServerFetch } from "@/src/lib/server/strapiServer";

function normalizeOrderId(raw) {
  return String(raw || "")
    .trim()
    .replace(/^#/, "");
}

/** Fetch a single paid order for the order-completed page (guest-safe: requires email). */
export async function POST(request) {
  try {
    const body = await request.json();
    const orderId = normalizeOrderId(body.orderId);
    const email = String(body.email || "")
      .trim()
      .toLowerCase();

    if (!orderId || !email) {
      return NextResponse.json(
        { error: "orderId and email are required" },
        { status: 400 }
      );
    }

    const params = new URLSearchParams({
      "filters[orderId][$eq]": orderId,
      "filters[userEmail][$eq]": email,
      "pagination[pageSize]": "1",
      publicationState: "preview",
    });

    const { ok, status, data } = await strapiServerFetch(
      `/order-details?${params}`
    );

    if (!ok) {
      return NextResponse.json(
        { error: "Could not load order" },
        { status: status || 500 }
      );
    }

    const record = (data.data || [])[0];
    if (!record) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ data: record });
  } catch (err) {
    console.error("order-lookup error:", err);
    return NextResponse.json(
      { error: err.message || "Could not load order" },
      { status: 500 }
    );
  }
}
