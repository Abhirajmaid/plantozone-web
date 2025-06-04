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

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

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
              {cartItems.map((item) => (
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
                      ₹{item.price}
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
                          handleRemoveItem(item.product, item.size, item.shape)
                        }
                        className="ml-4 text-red-500 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 p-6 rounded-lg h-fit">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{total}</span>
                </div>
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
                onAddToCart={({ size, shape }) => {
                  const attrs = plant.attributes;
                  const img = attrs?.images?.data?.[0]?.attributes?.url || "";
                  addToCartUtil({
                    product: plant.id,
                    title: attrs.title,
                    price: 750,
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
