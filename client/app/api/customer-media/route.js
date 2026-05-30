import { NextResponse } from "next/server";
import { strapiServerFetch } from "@/src/lib/server/strapiServer";
import { mapCustomerMediaRecords } from "@/src/lib/utils/mapCustomerMedia";

export async function GET() {
  try {
    const params = new URLSearchParams({
      populate: "*",
      publicationState: "preview",
      "pagination[pageSize]": "50",
      sort: "createdAt:desc",
    });

    const { ok, data } = await strapiServerFetch(`/customer-medias?${params}`);

    if (!ok) {
      return NextResponse.json({ data: [] });
    }

    const slides = mapCustomerMediaRecords(data.data || []);
    return NextResponse.json({ data: slides });
  } catch (err) {
    console.error("customer-media API:", err);
    return NextResponse.json({ data: [] });
  }
}
