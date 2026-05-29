"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Container } from "@/src/components/layout/Container";
import { Section } from "@/src/components/layout/Section";
import { NewsletterSection, ShopServiceSection } from "@/src/components";
import OrderStatus from "@/src/components/common/OrderStatus";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { STRAPI_BASE_URL } from "@/src/lib/strapiBaseUrl";
import { Loader2, AlertCircle, MapPin } from "lucide-react";

function TrackOrderHero() {
  return (
    <div
      className="relative py-20 md:py-24 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/breadcrumbbg.png')" }}
    >
      <div className="absolute inset-0 bg-white/70" />
      <Container>
        <div className="relative z-10 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Track Your Order
          </h1>
          <div className="flex items-center gap-2 text-gray-600">
            <Link href="/" className="hover:text-green-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-800 font-medium">Track Your Order</span>
          </div>
        </div>
      </Container>
    </div>
  );
}

function getProductImage(src) {
  if (!src) return "/images/plant.png";
  if (typeof src === "string" && src.startsWith("http")) return src;
  if (typeof src === "string") return `${STRAPI_BASE_URL}${src}`;
  return "/images/plant.png";
}

const TrackOrderClient = () => {
  const searchParams = useSearchParams();
  const orderIdParam = searchParams?.get?.("orderId") || "";
  const emailParam = searchParams?.get?.("email") || "";

  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTracking = useCallback(async (orderId, email) => {
    setLoading(true);
    setError(null);
    setOrderData(null);

    try {
      const res = await fetch("/api/track-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, email }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Could not track this order.");
        return;
      }

      setOrderData(json.data);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!orderIdParam || !emailParam) {
      setOrderData(null);
      setError(null);
      return;
    }
    fetchTracking(orderIdParam, emailParam);
  }, [orderIdParam, emailParam, fetchTracking]);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <TrackOrderHero />

      <Section className="bg-gray-50">
        <Container>
          <div className="max-w-4xl mx-auto">
            {!orderIdParam && (
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Track Your Order</h3>
                <p className="text-gray-600 mb-6">
                  Enter your order ID and email to see the latest status from
                  Shiprocket.
                </p>
                <Link
                  href="/track-order-input"
                  className="inline-block bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg"
                >
                  Enter Order Details
                </Link>
              </div>
            )}

            {loading && (
              <div className="bg-white rounded-2xl shadow-lg p-12 mb-8 text-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
                <p className="text-gray-600">
                  Fetching live tracking from Shiprocket…
                </p>
              </div>
            )}

            {error && !loading && (
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                <div className="flex items-start gap-3 text-red-600">
                  <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">
                      Unable to track order
                    </p>
                    <p className="text-sm text-gray-600">{error}</p>
                    <Link
                      href="/track-order-input"
                      className="inline-block mt-4 text-sm text-primary font-medium hover:underline"
                    >
                      Try again with different details
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {orderData && !loading && (
              <>
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 flex flex-wrap gap-4 justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">Current status</p>
                    <p className="text-xl font-bold text-gray-900 capitalize">
                      {String(orderData.status).replace(/_/g, " ").toLowerCase()}
                    </p>
                    {orderData.paymentStatus && (
                      <p className="text-sm text-gray-500 mt-1">
                        Payment: {orderData.paymentStatus}
                      </p>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    {orderData.awb && (
                      <p>
                        <span className="font-medium">AWB:</span> {orderData.awb}
                      </p>
                    )}
                    {orderData.courier && (
                      <p>
                        <span className="font-medium">Courier:</span>{" "}
                        {orderData.courier}
                      </p>
                    )}
                    {!orderData.shiprocketFound && (
                      <p className="text-amber-700 bg-amber-50 px-2 py-1 rounded text-xs">
                        Shipment not yet created in Shiprocket — showing order
                        confirmation only.
                      </p>
                    )}
                  </div>
                </div>

                <OrderStatus orderData={orderData} />

                {orderData.timeline?.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <MapPin className="w-6 h-6 text-primary" />
                      Shipment updates
                    </h2>
                    <ul className="space-y-4 border-l-2 border-primary/20 pl-6">
                      {orderData.timeline.map((ev, idx) => (
                        <li key={idx} className="relative">
                          <span className="absolute -left-[1.6rem] top-1.5 w-3 h-3 rounded-full bg-primary ring-4 ring-primary/20" />
                          <p className="font-medium text-gray-900">
                            {ev.activity}
                          </p>
                          {ev.location && (
                            <p className="text-sm text-gray-500">{ev.location}</p>
                          )}
                          {ev.date && (
                            <p className="text-xs text-gray-400 mt-0.5">
                              {ev.date}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Products
                  </h2>
                  <div className="space-y-4">
                    {orderData.products?.length > 0 ? (
                      orderData.products.map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center p-4 border border-gray-200 rounded-lg"
                        >
                          <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden mr-4 shrink-0">
                            <Image
                              src={getProductImage(product.image)}
                              alt={product.name}
                              fill
                              className="object-cover"
                              unoptimized={getProductImage(
                                product.image
                              ).startsWith("http")}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900">
                              {product.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {product.type} · Qty {product.quantity}
                            </p>
                          </div>
                          <p className="text-sm font-semibold text-gray-900 shrink-0">
                            ₹
                            {(
                              Number(product.price) * (product.quantity || 1)
                            ).toLocaleString("en-IN")}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No products listed.</p>
                    )}
                  </div>
                  {orderData.total != null && (
                    <p className="text-right mt-6 text-lg font-bold text-gray-900">
                      Total: ₹{Number(orderData.total).toLocaleString("en-IN")}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </Container>
      </Section>

      <Section className="bg-gray-50">
        <Container>
          <div className="[&>div]:!mb-8 [&>div]:!my-8">
            <ShopServiceSection />
          </div>
        </Container>
      </Section>

      <NewsletterSection />
    </div>
  );
};

export default TrackOrderClient;
