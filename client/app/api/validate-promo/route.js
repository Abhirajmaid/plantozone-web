import { NextResponse } from "next/server";
import { validatePromoCode } from "@/src/lib/server/promoCode";

export async function POST(request) {
  try {
    const body = await request.json();
    const code = body.code;
    const subtotal = Number(body.subtotal || 0);
    const email = body.email || "";

    if (!code?.trim()) {
      return NextResponse.json(
        { valid: false, error: "Please enter a promo code." },
        { status: 400 }
      );
    }

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
    return NextResponse.json(
      { valid: false, error: "Could not validate promo code." },
      { status: 500 }
    );
  }
}
