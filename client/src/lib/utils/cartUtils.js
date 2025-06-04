const getCartItems = () => {
  if (typeof window !== 'undefined') {
    const items = sessionStorage.getItem('cart');
    return items ? JSON.parse(items) : [];
  }
  return [];
};

const addToCart = (item) => {
  const cart = getCartItems();
  const existingItemIndex = cart.findIndex(
    (i) =>
      i.product === item.product &&
      i.size === item.size &&
      i.shape === item.shape
  );

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += item.quantity;
  } else {
    cart.push(item);
  }

  sessionStorage.setItem('cart', JSON.stringify(cart));
  return cart;
};

const removeFromCart = (productId, size, shape) => {
  const cart = getCartItems();
  const updatedCart = cart.filter(
    (item) => !(item.product === productId && item.size === size && item.shape === shape)
  );
  sessionStorage.setItem('cart', JSON.stringify(updatedCart));
  return updatedCart;
};

const updateQuantity = (productId, size, shape, quantity) => {
  const cart = getCartItems();
  const updatedCart = cart.map((item) => {
    if (item.product === productId && item.size === size && item.shape === shape) {
      return { ...item, quantity };
    }
    return item;
  });
  sessionStorage.setItem('cart', JSON.stringify(updatedCart));
  return updatedCart;
};

export { getCartItems, addToCart, removeFromCart, updateQuantity };
