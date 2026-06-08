import { NextResponse } from "next/server";
import { strapiServerFetch } from "@/src/lib/server/strapiServer";
import { getStrapiMediaUrl } from "@/src/lib/strapiMedia";
import { getLocalCategoryImageUrl } from "@/src/lib/categoryImages";

function categoryImageUrl(attrs) {
  const local = getLocalCategoryImageUrl(attrs?.title);
  if (local) return local;

  const fromCategory = getStrapiMediaUrl(attrs?.image, "");
  if (fromCategory) return fromCategory;

  const plants = attrs?.plants?.data || [];
  for (const plant of plants) {
    const plantAttrs = plant?.attributes || {};
    const imgs = plantAttrs?.images?.data;
    if (Array.isArray(imgs) && imgs.length > 0) {
      const url = getStrapiMediaUrl(imgs[0], "");
      if (url) return url;
    }
  }
  return null;
}

export async function GET() {
  try {
    const params = new URLSearchParams({
      "populate[image]": "*",
      "populate[plants][populate][images]": "*",
      publicationState: "preview",
      "pagination[pageSize]": "100",
    });

    const { ok, data } = await strapiServerFetch(`/categories?${params}`);

    if (!ok) {
      return NextResponse.json({ data: [] }, { status: 200 });
    }

    const hiddenSlugs = new Set(["rare-n-exotic-plants"]);

    const list = (data.data || [])
      .filter((cat) => !hiddenSlugs.has(cat.attributes?.slug))
      .map((cat, index) => {
      const attrs = cat.attributes || {};
      const gradients = [
        "from-green-400 to-emerald-600",
        "from-blue-400 to-cyan-600",
        "from-purple-400 to-pink-600",
        "from-orange-400 to-red-600",
        "from-yellow-400 to-amber-600",
      ];
      return {
        id: cat.id,
        name: attrs.title || `Category ${index + 1}`,
        slug:
          attrs.slug ||
          attrs.title?.toLowerCase().replace(/\s+/g, "-") ||
          `category-${index + 1}`,
        image: categoryImageUrl(attrs),
        gradient: attrs.gradient || gradients[index % gradients.length],
        description: attrs.description || "",
      };
    });

    return NextResponse.json({ data: list });
  } catch (err) {
    console.error("categories API:", err);
    return NextResponse.json({ data: [] }, { status: 200 });
  }
}
