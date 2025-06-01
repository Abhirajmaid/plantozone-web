"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Section } from "@/src/components/layout/Section";
import { Container } from "@/src/components/layout/Container";
import { useAuth } from "@/src/hooks/useAuth";
import cartAction from "@/src/lib/action/cart.action";
import Link from "next/link";
import Image from "next/image";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  // Fetch cart items
  useEffect(() => {
    const fetchCartItems = async () => {
      if (!isAuthenticated) {
        router.push("/login");
        return;
      }

      try {
        setLoading(true);
        const userCart = await cartAction.getUserCart();
        setCartItems(userCart || []);
      } catch (error) {
        console.error("Failed to fetch cart items", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [isAuthenticated, router]);

  // Calculate totals
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const shippingCost = subtotal > 899 ? 0 : 100;
  const discountAmount = couponApplied ? discount : 0;
  const total = subtotal + shippingCost - discountAmount;

  // Update quantity
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    setUpdating(true);
    try {
      await cartAction.updateCartItemQuantity(itemId, newQuantity);
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error("Failed to update quantity", error);
    } finally {
      setUpdating(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    setUpdating(true);
    try {
      await cartAction.removeFromCart(itemId);
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.id !== itemId)
      );
    } catch (error) {
      console.error("Failed to remove item", error);
    } finally {
      setUpdating(false);
    }
  };

  // Apply coupon
  const applyCoupon = () => {
    if (couponCode.toUpperCase() === "ECO100" && subtotal >= 899) {
      setDiscount(100);
      setCouponApplied(true);
    } else if (couponCode.toUpperCase() === "PLANT50" && subtotal >= 500) {
      setDiscount(50);
      setCouponApplied(true);
    } else {
      alert("Invalid coupon code or minimum order not met");
    }
  };

  // Remove coupon
  const removeCoupon = () => {
    setCouponCode("");
    setDiscount(0);
    setCouponApplied(false);
  };

  if (loading) {
    return (
      <Section className="min-h-screen">
        <Container className="pt-20">
          <div className="flex justify-center items-center min-h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p>Loading your cart...</p>
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Section className="min-h-screen">
        <Container className="pt-20">
          <div className="text-center py-16">
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any plants to your cart yet.
            </p>
            <Link href="/plants">
              <Button className="bg-green-600 hover:bg-green-700">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section className="min-h-screen">
      <Container className="pt-20 pb-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Shopping Cart
            </h1>
            <p className="text-gray-600">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in
              your cart
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={item.image || "/api/placeholder/96/96"}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-grow">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                          <div className="mb-4 sm:mb-0">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {item.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Size: {item.size}
                            </p>
                            <p className="text-lg font-semibold text-green-600 mt-2">
                              ₹{item.price}
                            </p>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-4">
                            <div className="flex items-center border rounded-lg">
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                                disabled={updating || item.quantity <= 1}
                                className="p-2 hover:bg-gray-100 disabled:opacity-50"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="px-4 py-2 text-sm font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                disabled={updating}
                                className="p-2 hover:bg-gray-100 disabled:opacity-50"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>

                            <button
                              onClick={() => removeFromCart(item.id)}
                              disabled={updating}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Item Total */}
                        <div className="mt-4 text-right sm:text-left">
                          <p className="text-sm text-gray-600">
                            Subtotal: ₹{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                  {/* Coupon Code */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Coupon Code
                    </label>
                    <div className="flex gap-2">
                      <Input
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter coupon code"
                        disabled={couponApplied}
                        className="flex-1"
                      />
                      {couponApplied ? (
                        <Button
                          onClick={removeCoupon}
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-600"
                        >
                          Remove
                        </Button>
                      ) : (
                        <Button
                          onClick={applyCoupon}
                          variant="outline"
                          size="sm"
                        >
                          Apply
                        </Button>
                      )}
                    </div>
                    {couponApplied && (
                      <p className="text-sm text-green-600 mt-2">
                        Coupon applied successfully!
                      </p>
                    )}
                  </div>

                  {/* Available Coupons */}
                  <div className="mb-6 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-800 mb-1">
                      Available Offers:
                    </p>
                    <p className="text-xs text-green-700">
                      • ECO100 - ₹100 off on orders above ₹899
                    </p>
                    <p className="text-xs text-green-700">
                      • PLANT50 - ₹50 off on orders above ₹500
                    </p>
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span
                        className={shippingCost === 0 ? "text-green-600" : ""}
                      >
                        {shippingCost === 0 ? "FREE" : `₹${shippingCost}`}
                      </span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount</span>
                        <span>-₹{discountAmount}</span>
                      </div>
                    )}

                    <div className="border-t pt-3">
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span>₹{total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Free Shipping Notice */}
                  {subtotal < 899 && (
                    <div className="mb-6 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        Add ₹{(899 - subtotal).toFixed(2)} more to get FREE
                        shipping!
                      </p>
                    </div>
                  )}

                  {/* Checkout Button */}
                  <Link href="/checkout">
                    <Button className="w-full bg-green-600 hover:bg-green-700 py-3">
                      Proceed to Checkout
                    </Button>
                  </Link>

                  <Link href="/plants">
                    <Button variant="outline" className="w-full mt-3">
                      Continue Shopping
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
