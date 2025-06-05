const CART_KEY = 'cart';
const CART_EXPIRY_KEY = 'cart_expiry';
const CART_EXPIRY_DAYS = 30;

const setCartWithExpiry = (cart) => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(CART_KEY, JSON.stringify(cart));
    const expiry = Date.now() + CART_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
    sessionStorage.setItem(CART_EXPIRY_KEY, expiry.toString());
  }
};

const getCartItems = () => {
  if (typeof window !== 'undefined') {
    const expiry = sessionStorage.getItem(CART_EXPIRY_KEY);
    if (expiry && Date.now() > Number(expiry)) {
      sessionStorage.removeItem(CART_KEY);
      sessionStorage.removeItem(CART_EXPIRY_KEY);
      return [];
    }
    const items = sessionStorage.getItem(CART_KEY);
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

  setCartWithExpiry(cart);
  return cart;
};

const removeFromCart = (productId, size, shape) => {
  const cart = getCartItems();
  const updatedCart = cart.filter(
    (item) => !(item.product === productId && item.size === size && item.shape === shape)
  );
  setCartWithExpiry(updatedCart);
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
  setCartWithExpiry(updatedCart);
  return updatedCart;
};

export { getCartItems, addToCart, removeFromCart, updateQuantity };
