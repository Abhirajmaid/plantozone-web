"use client";
import React, { useEffect, useState } from "react";
import { Container } from "@/src/components/layout/Container";
import { Section } from "@/src/components/layout/Section";
import { Button } from "@/src/components/ui/button";
import { NewsletterSection } from "@/src/components";
import Link from "next/link";
import Image from "next/image";
import { STRAPI_BASE_URL } from "@/src/lib/strapiBaseUrl";

function OrderCompletedHero() {
  return (
    <div
      className="relative py-20 md:py-24 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/breadcrumbbg.png')" }}
    >
      <div className="absolute inset-0 bg-white/70" />
      <Container>
        <div className="relative z-10 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Order Completed
          </h1>
          <div className="flex items-center gap-2 text-gray-600">
            <Link href="/" className="hover:text-green-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-800 font-medium">Order Completed</span>
          </div>
        </div>
      </Container>
    </div>
  );
}

function getEstimatedDelivery() {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getItemImage(item) {
  const src = item?.image;
  if (!src) return "/images/plant.png";
  if (typeof src === "string" && (src.startsWith("http") || src.startsWith("/"))) {
    return src;
  }
  if (typeof src === "string") return `${STRAPI_BASE_URL}${src}`;
  return "/images/plant.png";
}

const OrderCompleted = () => {
  const [order, setOrder] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("lastOrder");
      if (raw) setOrder(JSON.parse(raw));
    } catch {
      setOrder(null);
    }
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <p className="text-gray-600">Loading order details…</p>
      </div>
    );
  }

  if (!order?.orderId) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <OrderCompletedHero />
        <Section className="bg-gray-50 py-16">
          <Container>
            <div className="max-w-lg mx-auto text-center bg-white rounded-2xl shadow-lg p-10">
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                No order details found
              </h2>
              <p className="text-gray-600 mb-6">
                If you just placed an order, check your email for confirmation.
                Otherwise browse our shop to order plants.
              </p>
              <Link href="/shop">
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  Continue shopping
                </Button>
              </Link>
            </div>
          </Container>
        </Section>
      </div>
    );
  }

  const items = Array.isArray(order.items) ? order.items : [];
  const estimatedDelivery = getEstimatedDelivery();

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <OrderCompletedHero />

      <Section className="bg-gray-50">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-green-600 rounded-full mb-6">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Your order is completed!
              </h2>
              <p className="text-lg text-gray-600">
                Thank you. Your payment was successful.
              </p>
              {order.email && (
                <p className="text-sm text-gray-500 mt-3 max-w-md mx-auto">
                  Confirmation sent to{" "}
                  <span className="font-medium text-gray-700">{order.email}</span>
                </p>
              )}
            </div>

            <div className="bg-yellow-500 rounded-2xl p-8 mb-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                <div className="text-center">
                  <div className="text-sm text-gray-700 mb-2">Order ID</div>
                  <div className="font-bold text-gray-900 break-all text-sm">
                    {order.orderId}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-700 mb-2">Payment</div>
                  <div className="font-bold text-gray-900">
                    {order.paymentMethod || "Online"}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-700 mb-2">Payment ID</div>
                  <div className="font-bold text-gray-900 break-all text-xs md:text-sm">
                    {order.paymentId || "—"}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-700 mb-2">
                    Est. delivery
                  </div>
                  <div className="font-bold text-gray-900 text-sm">
                    {estimatedDelivery}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-3 mt-8">
                {order.email && (
                  <Link
                    href={`/track-order?orderId=${encodeURIComponent(order.orderId)}&email=${encodeURIComponent(order.email)}`}
                  >
                    <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg">
                      Track Order
                    </Button>
                  </Link>
                )}
                <Link href="/orders">
                  <Button
                    variant="outline"
                    className="px-8 py-4 rounded-lg font-semibold text-lg border-gray-800 text-gray-800 bg-white/80"
                  >
                    My Orders
                  </Button>
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Order Details
              </h3>
              {order.userName && (
                <p className="text-sm text-gray-600 mb-6">
                  {order.userName}
                  {order.userPhone ? ` · ${order.userPhone}` : ""}
                </p>
              )}

              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Products ({items.length})
                </h4>
                <div className="space-y-4">
                  {items.length === 0 ? (
                    <p className="text-gray-500 text-sm">No items in order.</p>
                  ) : (
                    items.map((item, idx) => {
                      const name = item.title || item.name || "Plant";
                      const qty = item.quantity || 1;
                      const lineTotal = Number(item.price || 0) * qty;
                      const img = getItemImage(item);
                      return (
                        <div
                          key={`${item.product}-${idx}`}
                          className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                              <Image
                                src={img}
                                alt={name}
                                fill
                                className="object-cover"
                                unoptimized={img.startsWith("http")}
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-gray-900">
                                {name}
                              </div>
                              <div className="text-sm text-gray-600">
                                Qty {qty}
                                {item.size ? ` · ${item.size}` : ""}
                                {item.shape ? ` · ${item.shape}` : ""}
                              </div>
                            </div>
                          </div>
                          <div className="font-bold text-gray-900 shrink-0 ml-4">
                            ₹{lineTotal.toLocaleString("en-IN")}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {order.address && (
                <div className="mb-8 p-4 bg-gray-50 rounded-lg text-sm text-gray-700">
                  <p className="font-semibold text-gray-900 mb-1">
                    Delivery address
                  </p>
                  <p>{order.address}</p>
                  {(order.city || order.pincode) && (
                    <p>
                      {[order.city, order.state].filter(Boolean).join(", ")}{" "}
                      {order.pincode}
                    </p>
                  )}
                </div>
              )}

              <div className="border-t border-gray-200 pt-6">
                <div className="space-y-3 text-sm md:text-base">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">
                      ₹{Number(order.subtotal || 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                  {order.discountAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Discount
                        {order.discountCode ? ` (${order.discountCode})` : ""}
                      </span>
                      <span className="font-semibold text-green-600">
                        -₹
                        {Number(order.discountAmount).toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3">
                    <span>Total paid</span>
                    <span className="text-primary">
                      ₹{Number(order.total || 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              <div className="bg-white rounded-xl p-6 text-center shadow-lg">
                <h4 className="font-bold text-gray-900 mb-2">Free Shipping</h4>
                <p className="text-sm text-gray-600">On all orders</p>
              </div>
              <div className="bg-white rounded-xl p-6 text-center shadow-lg">
                <h4 className="font-bold text-gray-900 mb-2">Secure Payment</h4>
                <p className="text-sm text-gray-600">Razorpay protected</p>
              </div>
              <div className="bg-white rounded-xl p-6 text-center shadow-lg">
                <h4 className="font-bold text-gray-900 mb-2">24×7 Support</h4>
                <p className="text-sm text-gray-600">info@plantozone.com</p>
              </div>
            </div>

            <NewsletterSection />
          </div>
        </Container>
      </Section>
    </div>
  );
};

export default OrderCompleted;
