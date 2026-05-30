import { NextResponse } from "next/server";
import { strapiServerFetch } from "@/src/lib/server/strapiServer";

export async function POST(request) {
  try {
    const body = await request.json();
    const email = String(body.email || "")
      .trim()
      .toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "A valid email is required." },
        { status: 400 }
      );
    }

    const params = new URLSearchParams({
      "filters[userEmail][$eq]": email,
      sort: "createdAt:desc",
      "pagination[pageSize]": "50",
      publicationState: "preview",
    });

    const { ok, status, data } = await strapiServerFetch(
      `/order-details?${params}`
    );

    if (!ok) {
      return NextResponse.json(
        { error: "Could not load orders.", data: [] },
        { status: status || 500 }
      );
    }

    return NextResponse.json({
      data: data.data || [],
      meta: data.meta,
      email,
    });
  } catch (err) {
    console.error("my-orders error:", err);
    return NextResponse.json(
      { error: "Could not load orders.", data: [] },
      { status: 500 }
    );
  }
}
