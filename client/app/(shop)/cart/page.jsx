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
    let percent = 0;
    if (tenPercentCodes.includes(code)) {
      percent = 10;
      setDiscountPercent(10);
      setDiscountError("");
    } else if (code === "SAVE15") {
      percent = 15;
      setDiscountPercent(15);
      setDiscountError("");
    } else {
      setDiscountPercent(0);
      setDiscountError("Invalid discount code");
    }
    // Store discount info for checkout page
    if (percent > 0) {
      localStorage.setItem(
        "plantozone_discount",
        JSON.stringify({
          code,
          percent,
        })
      );
    } else {
      localStorage.removeItem("plantozone_discount");
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

  // Delivery fee logic
  const DELIVERY_FEE = 79;
  const FREE_DELIVERY_THRESHOLD = 2000;
  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const isFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;

  const total = subtotal - discountAmount + deliveryFee;

  return (
    <Section className="min-h-screen">
      <Container className="mx-auto px-4 sm:px-6 lg:px-8 xl:px-[100px] py-4 sm:py-6 lg:py-8 pt-16 lg:pt-[100px]">
        {/* Free Delivery Banner */}
        <div className="mb-6 p-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🚚</span>
              <div>
                <h3 className="font-bold text-lg">
                  FREE Delivery on Orders Above ₹2000!
                </h3>
                <p className="text-sm opacity-90">
                  Save ₹{DELIVERY_FEE} on shipping charges
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-medium">
                🌱 Shop More, Save More!
              </div>
            </div>
          </div>
        </div>

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

              {/* Free Delivery Progress */}
              {!isFreeDelivery && (
                <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-green-800">
                      🚚 Free Delivery Progress
                    </span>
                    <span className="text-xs text-green-600 font-semibold">
                      ₹{FREE_DELIVERY_THRESHOLD - subtotal} more to go!
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div
                      className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          (subtotal / FREE_DELIVERY_THRESHOLD) * 100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-green-700">
                    Add ₹{FREE_DELIVERY_THRESHOLD - subtotal} more to your cart
                    and save ₹{DELIVERY_FEE} on delivery! 🌱
                  </p>
                </div>
              )}

              {isFreeDelivery && (
                <div className="mb-6 p-4 bg-gradient-to-r from-green-100 to-green-50 rounded-lg border border-green-300">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🎉</span>
                    <span className="text-sm font-bold text-green-800">
                      Congratulations! FREE Delivery Unlocked!
                    </span>
                  </div>
                  <p className="text-xs text-green-700">
                    You've saved ₹{DELIVERY_FEE} on delivery charges. Keep
                    shopping for more amazing plants! 🌿
                  </p>
                </div>
              )}
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
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <span>Delivery</span>
                    {isFreeDelivery && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                        FREE
                      </span>
                    )}
                  </div>
                  <span
                    className={`font-semibold ${
                      isFreeDelivery
                        ? "text-green-700 line-through"
                        : "text-gray-800"
                    }`}
                  >
                    {isFreeDelivery ? `₹${DELIVERY_FEE}` : `₹${deliveryFee}`}
                  </span>
                </div>
                {isFreeDelivery && (
                  <div className="text-xs text-green-600 bg-green-50 p-2 rounded border border-green-200">
                    🎉 Congratulations! You've qualified for free delivery on
                    orders above ₹2000
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
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              {!isFreeDelivery
                ? "🌱 Add More Plants & Get FREE Delivery!"
                : "You may also like"}
            </h2>
            {!isFreeDelivery && (
              <div className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-medium">
                Save ₹{DELIVERY_FEE} on delivery
              </div>
            )}
          </div>
          {!isFreeDelivery && (
            <p className="text-gray-600 mb-6 text-sm">
              Add just ₹{FREE_DELIVERY_THRESHOLD - subtotal} more to unlock free
              delivery and save ₹{DELIVERY_FEE}! Choose from our beautiful
              collection below:
            </p>
          )}
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
