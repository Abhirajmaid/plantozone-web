"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Container } from "@/src/components/layout/Container";
import { Button } from "@/src/components/ui/button";
import {
  getCartItems,
  removeFromCart,
  updateQuantity,
  addToCart as addToCartUtil,
} from "@/src/lib/utils/cartUtils";
import { Section } from "@/src/components/layout/Section";
import plantsAction from "@/src/lib/action/plants.action";
import { ProductCard } from "@/src/components";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const router = useRouter();

  // Discount system state
  const [discountCode, setDiscountCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountError, setDiscountError] = useState("");

  useEffect(() => {
    setCartItems(getCartItems());
    // Fetch all plants, then pick 3 random
    plantsAction.getPlants().then((res) => {
      const all = res?.data?.data || [];
      const shuffled = all.sort(() => 0.5 - Math.random());
      setSuggestions(shuffled.slice(0, 3));
    });
  }, []);

  // Updated handlers to include shape
  const handleQuantityChange = (productId, size, shape, newQuantity) => {
    if (newQuantity < 1) return;
    const updated = updateQuantity(productId, size, shape, newQuantity);
    setCartItems(updated);
  };

  const handleRemoveItem = (productId, size, shape) => {
    const updated = removeFromCart(productId, size, shape);
    setCartItems(updated);
  };

  // Discount code handler
  const handleApplyDiscount = () => {
    const code = discountCode.trim().toUpperCase();
    const tenPercentCodes = [
      "SHRI10",
      "ARJV10",
      "SVM10",
      "CP10",
      "TEJU10",
      "NAG10",
      "SV10",
    ];
    if (tenPercentCodes.includes(code)) {
      setDiscountPercent(10);
      setDiscountError("");
    } else if (code === "SAVE15") {
      setDiscountPercent(15);
      setDiscountError("");
    } else {
      setDiscountPercent(0);
      setDiscountError("Invalid discount code");
    }
  };

  // Updated total calculation to use correct price per item
  const subtotal = cartItems.reduce((sum, item) => {
    // Use item.price if present, fallback to 650/850 based on size
    let price = item.price;
    if (!price) {
      price = item.size === "8 Inch" ? 850 : 650;
    }
    return sum + price * item.quantity;
  }, 0);

  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const total = subtotal - discountAmount;

  return (
    <Section className="min-h-screen">
      <Container className="mx-auto px-4 sm:px-6 lg:px-8 xl:px-[100px] py-4 sm:py-6 lg:py-8 pt-16 lg:pt-[100px]">
        <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="mb-4">Your cart is empty</p>
            <Link href="/plants">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              {cartItems.map((item) => {
                // Ensure price is correct for display
                const displayPrice =
                  item.price || (item.size === "8 Inch" ? 850 : 650);
                return (
                  <div
                    key={`${item.product}-${item.size}-${item.shape || ""}`}
                    className="flex gap-4 p-4 border rounded-lg"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-24 h-24 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.title}</h3>
                      <div className="text-sm text-gray-600 flex flex-wrap gap-4">
                        <span>
                          Size:{" "}
                          {item.size === "6 Inch" || item.size === "8 Inch"
                            ? item.size
                            : "N/A"}
                        </span>
                        <span>
                          Shape:{" "}
                          {item.shape || (
                            <span className="italic text-gray-400">N/A</span>
                          )}
                        </span>
                      </div>
                      <p className="text-green-600 font-semibold">
                        ₹{displayPrice}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item.product,
                              item.size,
                              item.shape,
                              item.quantity - 1
                            )
                          }
                          className="px-2 border rounded"
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item.product,
                              item.size,
                              item.shape,
                              item.quantity + 1
                            )
                          }
                          className="px-2 border rounded"
                        >
                          +
                        </button>
                        <button
                          onClick={() =>
                            handleRemoveItem(
                              item.product,
                              item.size,
                              item.shape
                            )
                          }
                          className="ml-4 text-red-500 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-gray-50 p-6 rounded-lg h-fit">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              {/* Discount Code Input */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Discount code"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  className="border rounded-md px-3 py-2 text-sm sm:text-base"
                />
                <Button
                  type="button"
                  onClick={handleApplyDiscount}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 text-sm sm:text-base"
                >
                  Apply
                </Button>
              </div>
              {discountError && (
                <div className="text-red-500 text-xs mb-2">{discountError}</div>
              )}
              {discountPercent > 0 && (
                <div className="text-green-600 text-xs mb-2">
                  Code applied: {discountCode.trim().toUpperCase()} (-
                  {discountPercent}%)
                </div>
              )}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                {discountPercent > 0 && (
                  <div className="flex justify-between text-green-700">
                    <span>Discount</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>
              <Button
                className="w-full"
                onClick={() => router.push("/checkouts")}
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        )}

        {/* Suggestion Section */}
        <div className="mt-16">
          <h2 className="text-xl font-semibold mb-6">You may also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {suggestions.map((plant) => (
              <ProductCard
                key={plant.id}
                data={plant}
                onAddToCart={({ size, shape, price }) => {
                  const attrs = plant.attributes;
                  const img = attrs?.images?.data?.[0]?.attributes?.url || "";
                  addToCartUtil({
                    product: plant.id,
                    title: attrs.title,
                    price: price,
                    size: size, // use selected size
                    shape: shape, // use selected shape
                    quantity: 1,
                    image: img,
                  });
                  setCartItems(getCartItems());
                }}
                showAddToCart
              />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
