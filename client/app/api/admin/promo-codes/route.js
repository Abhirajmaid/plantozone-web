import { NextResponse } from "next/server";
import { strapiServerFetch, getStrapiServerToken } from "@/src/lib/server/strapiServer";
import {
  expireStalePromoCodes,
  validatePromoPayload,
} from "@/src/lib/server/promoExpiry";

function getAuthHeader(request) {
  const userAuth = request.headers.get("authorization");
  const serverToken = getStrapiServerToken();
  if (serverToken) return `Bearer ${serverToken}`;
  if (userAuth) return userAuth;
  return null;
}

export async function GET(request) {
  try {
    const auth = getAuthHeader(request);
    if (!auth) {
      return NextResponse.json(
        { error: { message: "Unauthorized" } },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const params = new URLSearchParams({
      "pagination[pageSize]": searchParams.get("pageSize") || "100",
      sort: "code:asc",
    });
    const search = searchParams.get("search");
    if (search?.trim()) {
      params.set("filters[code][$containsi]", search.trim());
    }

    await expireStalePromoCodes();

    const { ok, status, data } = await strapiServerFetch(
      `/promo-codes?${params}`,
      { headers: { Authorization: auth } }
    );

    if (!ok) {
      return NextResponse.json(
        data?.error || { message: "Failed to load promo codes" },
        { status: status || 500 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Admin promo GET:", err);
    return NextResponse.json(
      { error: { message: "Failed to load promo codes" } },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const auth = getAuthHeader(request);
    if (!auth) {
      return NextResponse.json(
        { error: { message: "Unauthorized. Set STRAPI_API_TOKEN on the server." } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const payload = body.data || body;

    const validation = validatePromoPayload(payload, { isCreate: true });
    if (!validation.ok) {
      return NextResponse.json(
        { error: { message: validation.error } },
        { status: 400 }
      );
    }

    const { ok, status, data } = await strapiServerFetch("/promo-codes", {
      method: "POST",
      headers: { Authorization: auth },
      body: JSON.stringify({ data: payload }),
    });

    if (!ok) {
      return NextResponse.json(
        data?.error || { message: data?.error?.message || "Forbidden" },
        { status: status || 403 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Admin promo POST:", err);
    return NextResponse.json(
      { error: { message: "Failed to create promo code" } },
      { status: 500 }
    );
  }
}
