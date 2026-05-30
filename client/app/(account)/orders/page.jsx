"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/src/components/layout/Container";
import { Section } from "@/src/components/layout/Section";
import { NewsletterSection, ShopServiceSection } from "@/src/components";
import { resolveMediaPath } from "@/src/lib/strapiMedia";
import { resolveOrdersEmail } from "@/src/lib/utils/guestOrder";
import { Icon } from "@iconify/react";
import { Loader2, Package, ChevronDown, ChevronUp } from "lucide-react";

const STATUS_STYLES = {
  paid: "bg-green-100 text-green-800 border-green-200",
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  failed: "bg-red-100 text-red-800 border-red-200",
};

const STATUS_LABELS = {
  paid: "Paid",
  pending: "Pending",
  failed: "Failed",
};

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getItemImage(item) {
  const src = item?.image || item?.img;
  if (!src) return "/images/plant.png";
  return resolveMediaPath(src) || "/images/plant.png";
}

function getItemName(item) {
  return item?.title || item?.name || item?.plantName || "Plant";
}

function OrderCard({ order, userEmail }) {
  const [expanded, setExpanded] = useState(false);
  const attrs = order.attributes || {};
  const items = Array.isArray(attrs.items) ? attrs.items : [];
  const status = attrs.status || "pending";
  const orderId = attrs.orderId || order.id;
  const trackHref = `/track-order?orderId=${encodeURIComponent(orderId)}&email=${encodeURIComponent(userEmail || attrs.userEmail || "")}`;

  return (
    <article className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left p-5 md:p-6 hover:bg-gray-50/80 transition-colors"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-4 min-w-0">
            <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500 mb-1">Order ID</p>
              <p className="font-semibold text-gray-900 truncate">
                #{String(orderId).slice(0, 20)}
                {String(orderId).length > 20 ? "…" : ""}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {formatDate(attrs.createdAt)} · {items.length} item
                {items.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6">
            <div className="text-left sm:text-right">
              <p className="text-xs text-gray-500 mb-1">Total</p>
              <p className="text-lg font-bold text-gray-900">
                ₹{Number(attrs.total || 0).toLocaleString("en-IN")}
              </p>
            </div>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                STATUS_STYLES[status] || STATUS_STYLES.pending
              }`}
            >
              {STATUS_LABELS[status] || status}
            </span>
            {expanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
            )}
          </div>
        </div>
      </button>

      {expanded && (
        <div className="px-5 md:px-6 pb-6 pt-0 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 pt-5 text-sm">
            <div>
              <p className="text-gray-500 mb-1">Delivery address</p>
              <p className="text-gray-800">
                {attrs.address || "—"}
                {attrs.city && (
                  <>
                    <br />
                    {attrs.city}
                    {attrs.state ? `, ${attrs.state}` : ""}{" "}
                    {attrs.pincode || ""}
                  </>
                )}
              </p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Contact</p>
              <p className="text-gray-800">{attrs.userPhone || "—"}</p>
              <p className="text-gray-600 mt-1">{attrs.userEmail}</p>
            </div>
          </div>

          {items.length > 0 && (
            <ul className="space-y-3 mb-6">
              {items.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-4 p-3 rounded-xl bg-gray-50"
                >
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-white shrink-0">
                    <Image
                      src={getItemImage(item)}
                      alt={getItemName(item)}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {getItemName(item)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity || 1}
                      {item.size ? ` · ${item.size}` : ""}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900 shrink-0">
                    ₹
                    {(
                      (item.price || 0) * (item.quantity || 1)
                    ).toLocaleString("en-IN")}
                  </p>
                </li>
              ))}
            </ul>
          )}

          <div className="flex flex-wrap gap-3">
            <Link
              href={trackHref}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Icon icon="mdi:truck-delivery" className="w-4 h-4" />
              Track order
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Shop again
            </Link>
          </div>
        </div>
      )}
    </article>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasCustomerEmail, setHasCustomerEmail] = useState(false);

  const loadOrders = useCallback(async () => {
    const email = resolveOrdersEmail();
    if (!email) {
      setHasCustomerEmail(false);
      setOrders([]);
      setLoading(false);
      setError(null);
      return;
    }

    setHasCustomerEmail(true);
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/my-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Could not load your orders.");
        setOrders([]);
        return;
      }
      setOrders(json.data || []);
    } catch (err) {
      console.error("Failed to load orders:", err);
      setError("Could not load your orders. Please try again later.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
    const onRefresh = () => loadOrders();
    window.addEventListener("focus", onRefresh);
    window.addEventListener("orders-updated", onRefresh);
    return () => {
      window.removeEventListener("focus", onRefresh);
      window.removeEventListener("orders-updated", onRefresh);
    };
  }, [loadOrders]);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div
        className="relative py-20 md:py-24 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/breadcrumbbg.png')" }}
      >
        <div className="absolute inset-0 bg-white/70" />
        <Container>
          <div className="relative z-10 flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              My Orders
            </h1>
            <div className="flex items-center gap-2 text-gray-600">
              <Link href="/" className="hover:text-green-600 transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-gray-800 font-medium">Orders</span>
            </div>
          </div>
        </Container>
      </div>

      <Section className="bg-gray-50 py-12 md:py-16">
        <Container>
          <div className="max-w-3xl mx-auto">
            {loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                <p className="text-gray-600">Loading your orders…</p>
              </div>
            )}

            {!loading && error && (
              <div className="text-center py-12 bg-white rounded-2xl border border-red-100">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  type="button"
                  onClick={() => loadOrders()}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Try again
                </button>
              </div>
            )}

            {!loading && !error && !hasCustomerEmail && (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-md">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  No orders yet
                </h2>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Complete a purchase at checkout (with your email). Your orders will appear here automatically — no sign-in required.
                </p>
                <Link
                  href="/shop"
                  className="inline-flex px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  Shop plants
                </Link>
              </div>
            )}

            {!loading && !error && hasCustomerEmail && orders.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-md">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  No orders yet
                </h2>
                <p className="text-gray-600 mb-6">
                  You have not placed any orders yet. Start shopping to see them here.
                </p>
                <Link
                  href="/shop"
                  className="inline-flex px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  Start shopping
                </Link>
              </div>
            )}

            {!loading && !error && orders.length > 0 && (
              <div className="space-y-4">
                {orders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    userEmail={
                      order.attributes?.userEmail || resolveOrdersEmail()
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </Container>
      </Section>

      <ShopServiceSection />
      <NewsletterSection />
    </div>
  );
}
