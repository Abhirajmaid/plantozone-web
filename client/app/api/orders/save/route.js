import { NextResponse } from "next/server";
import { strapiServerFetch } from "@/src/lib/server/strapiServer";

/** Save paid order to Strapi (guest checkout — no login required). */
export async function POST(request) {
  try {
    const body = await request.json();
    const data = body.data || body;

    if (!data.orderId || !data.userEmail) {
      return NextResponse.json(
        { error: "orderId and userEmail are required" },
        { status: 400 }
      );
    }

    const payload = {
      orderId: String(data.orderId),
      userName: data.userName || "",
      userEmail: String(data.userEmail).trim().toLowerCase(),
      userPhone: data.userPhone || "",
      address: data.address || "",
      pincode: data.pincode || "",
      city: data.city || "",
      state: data.state || "",
      items: data.items || [],
      total: Number(data.total) || 0,
      paymentId: data.paymentId || "",
      status: data.status || "paid",
      publishedAt: new Date().toISOString(),
    };

    const { ok, status, data: resData } = await strapiServerFetch(
      "/order-details",
      {
        method: "POST",
        body: JSON.stringify({ data: payload }),
      }
    );

    if (!ok) {
      console.error("Strapi order save failed:", resData);
      return NextResponse.json(
        { error: resData?.error?.message || "Failed to save order" },
        { status: status || 500 }
      );
    }

    return NextResponse.json({ success: true, data: resData.data });
  } catch (err) {
    console.error("orders/save error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to save order" },
      { status: 500 }
    );
  }
}
