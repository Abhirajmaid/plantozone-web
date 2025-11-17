const WISHLIST_KEY = 'wishlist';

const getWishlistItems = () => {
  if (typeof window !== 'undefined') {
    const items = sessionStorage.getItem(WISHLIST_KEY);
    return items ? JSON.parse(items) : [];
  }
  return [];
};

const addToWishlist = (item) => {
  const wishlist = getWishlistItems();
  const existingItemIndex = wishlist.findIndex(
    (i) => i.product === item.product && i.size === item.size && i.shape === item.shape
  );

  if (existingItemIndex === -1) {
    wishlist.push({
      ...item,
      dateAdded: new Date().toISOString(),
    });
    sessionStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }
  return wishlist;
};

const removeFromWishlist = (productId, size, shape) => {
  const wishlist = getWishlistItems();
  const updatedWishlist = wishlist.filter(
    (item) => !(item.product === productId && item.size === size && item.shape === shape)
  );
  sessionStorage.setItem(WISHLIST_KEY, JSON.stringify(updatedWishlist));
  return updatedWishlist;
};

const clearWishlist = () => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(WISHLIST_KEY);
  }
  return [];
};

export { getWishlistItems, addToWishlist, removeFromWishlist, clearWishlist };

