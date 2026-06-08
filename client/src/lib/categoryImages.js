/** Local category hero images in /public/category (filename matches Strapi title). */
const LOCAL_CATEGORY_FILES = {
  "Air-Purifying Plants": "Air-Purifying Plants.png",
  "Bonsai & Miniature": "Bonsai & Miniature.png",
  "Cactus & Succulents": "Cactus & Succulents.png",
  "Flowering Plants": "Flowering Plants.png",
};

/** @param {string | undefined | null} title */
export function getLocalCategoryImageUrl(title) {
  const file = LOCAL_CATEGORY_FILES[title?.trim()];
  if (!file) return null;
  return `/category/${encodeURIComponent(file)}`;
}
