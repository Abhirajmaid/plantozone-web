import { NextResponse } from "next/server";
import { validatePromoCode } from "@/src/lib/server/promoCode";

const QUICK_FALLBACK = {
  FIRST125: {
    valid: true,
    code: "FIRST125",
    discountPercent: 25,
    description: "25% off your first order",
  },
  OXY30: {
    valid: true,
    code: "OXY30",
    discountPercent: 30,
    description: "30% off",
  },
};

export async function POST(request) {
  let body = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { valid: false, error: "Invalid request." },
      { status: 400 }
    );
  }

  const code = String(body.code || "")
    .trim()
    .toUpperCase();
  const subtotal = Number(body.subtotal || 0);
  const email = body.email || "";

  if (!code) {
    return NextResponse.json(
      { valid: false, error: "Please enter a promo code." },
      { status: 400 }
    );
  }

  try {
    const result = await validatePromoCode(code, { subtotal, email });

    if (!result.valid) {
      return NextResponse.json(
        { valid: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      code: result.code,
      discountPercent: result.discountPercent,
      description: result.description,
    });
  } catch (err) {
    console.error("Validate promo error:", err);

    const fallback = QUICK_FALLBACK[code];
    if (fallback) {
      return NextResponse.json(fallback);
    }

    return NextResponse.json(
      { valid: false, error: "Could not validate promo code." },
      { status: 500 }
    );
  }
}
