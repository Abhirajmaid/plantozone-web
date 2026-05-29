import { NextResponse } from "next/server";
import { getBannerPromo } from "@/src/lib/server/promoCode";

export async function GET() {
  try {
    const promo = await getBannerPromo();
    if (!promo) {
      return NextResponse.json({
        code: "FIRST125",
        discountPercent: 25,
        fallback: true,
      });
    }
    return NextResponse.json(promo);
  } catch {
    return NextResponse.json({
      code: "FIRST125",
      discountPercent: 25,
      fallback: true,
    });
  }
}
