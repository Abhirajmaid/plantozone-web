import { NextResponse } from "next/server";
import { incrementPromoUsage } from "@/src/lib/server/promoCode";

export async function POST(request) {
  try {
    const body = await request.json();
    const code = body.code;
    if (!code?.trim()) {
      return NextResponse.json({ success: false }, { status: 400 });
    }
    await incrementPromoUsage(code);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Redeem promo error:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
