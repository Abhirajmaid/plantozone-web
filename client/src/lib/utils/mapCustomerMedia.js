import { getStrapiMediaUrl } from "@/src/lib/strapiMedia";

/**
 * Flatten Strapi customer-media entries into carousel slides (one slide per image/video).
 */
export function mapCustomerMediaRecords(records = []) {
  const slides = [];

  for (const item of records) {
    const attrs = item.attributes || item;
    const mediaList = attrs.image?.data;
    const items = Array.isArray(mediaList)
      ? mediaList
      : mediaList
        ? [mediaList]
        : [];

    const baseCaption = attrs.title || attrs.description || "";
    const name = attrs.customerName || "Plantozone";

    if (items.length === 0) {
      continue;
    }

    items.forEach((media, index) => {
      const mime = media?.attributes?.mime || "";
      const src = getStrapiMediaUrl(media, "");
      if (!src) return;

      const isVideo =
        mime.startsWith("video/") ||
        /\.(mp4|webm|mov)$/i.test(src);

      slides.push({
        id: `${item.id}-${index}`,
        type: isVideo ? "video" : "image",
        src,
        caption: baseCaption,
        name,
        alt: baseCaption || name || "Plantozone customer moment",
      });
    });
  }

  return slides;
}
