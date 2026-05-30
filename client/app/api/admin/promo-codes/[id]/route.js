import { NextResponse } from "next/server";
import { strapiServerFetch, getStrapiServerToken } from "@/src/lib/server/strapiServer";
import { validatePromoPayload } from "@/src/lib/server/promoExpiry";

function getAuthHeader(request) {
  const userAuth = request.headers.get("authorization");
  const serverToken = getStrapiServerToken();
  if (serverToken) return `Bearer ${serverToken}`;
  if (userAuth) return userAuth;
  return null;
}

export async function PUT(request, { params }) {
  try {
    const auth = getAuthHeader(request);
    if (!auth) {
      return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 });
    }

    const body = await request.json();
    const payload = body.data || body;

    const { ok: fetchOk, data: existingRes } = await strapiServerFetch(
      `/promo-codes/${params.id}`,
      { headers: { Authorization: auth } }
    );

    const existing = fetchOk ? existingRes?.data?.attributes || {} : {};

    const validation = validatePromoPayload(payload, {
      isCreate: false,
      existing,
    });
    if (!validation.ok) {
      return NextResponse.json(
        { error: { message: validation.error } },
        { status: 400 }
      );
    }

    const { ok, status, data } = await strapiServerFetch(
      `/promo-codes/${params.id}`,
      {
        method: "PUT",
        headers: { Authorization: auth },
        body: JSON.stringify({ data: payload }),
      }
    );

    if (!ok) {
      return NextResponse.json(
        data?.error || { message: "Failed to update" },
        { status: status || 403 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Admin promo PUT:", err);
    return NextResponse.json(
      { error: { message: "Failed to update promo code" } },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const auth = getAuthHeader(request);
    if (!auth) {
      return NextResponse.json({ error: { message: "Unauthorized" } }, { status: 401 });
    }

    const { ok, status, data } = await strapiServerFetch(
      `/promo-codes/${params.id}`,
      {
        method: "DELETE",
        headers: { Authorization: auth },
      }
    );

    if (!ok) {
      return NextResponse.json(
        data?.error || { message: "Failed to delete" },
        { status: status || 403 }
      );
    }

    return NextResponse.json(data || { success: true });
  } catch (err) {
    console.error("Admin promo DELETE:", err);
    return NextResponse.json(
      { error: { message: "Failed to delete promo code" } },
      { status: 500 }
    );
  }
}
