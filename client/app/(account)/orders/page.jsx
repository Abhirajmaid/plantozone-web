"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/src/components/layout/Container";
import { Section } from "@/src/components/layout/Section";
import { NewsletterSection, ShopServiceSection } from "@/src/components";
import orderAction from "@/src/lib/action/order.action";
import { STRAPI_BASE_URL } from "@/src/lib/strapiBaseUrl";
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
  if (typeof src === "string" && src.startsWith("http")) return src;
  if (typeof src === "string") return `${STRAPI_BASE_URL}${src}`;
  return "/images/plant.png";
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
              {attrs.paymentId && (
                <p className="text-gray-500 mt-2 text-xs">
                  Payment ref: {attrs.paymentId}
                </p>
              )}
            </div>
          </div>

          <p className="text-sm font-semibold text-gray-900 mb-3">Items</p>
          <ul className="space-y-3 mb-6">
            {items.length === 0 ? (
              <li className="text-sm text-gray-500">No item details available</li>
            ) : (
              items.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50"
                >
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-white shrink-0">
                    <Image
                      src={getItemImage(item)}
                      alt={getItemName(item)}
                      fill
                      className="object-cover"
                      unoptimized={getItemImage(item).startsWith("http")}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {getItemName(item)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity || 1}
                      {item.size ? ` · ${item.size}` : ""}
                      {item.shape ? ` · ${item.shape}` : ""}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 shrink-0">
                    ₹
                    {(
                      Number(item.price || 0) * (item.quantity || 1)
                    ).toLocaleString("en-IN")}
                  </p>
                </li>
              ))
            )}
          </ul>

          <div className="flex flex-wrap gap-3">
            <Link
              href={trackHref}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors"
            >
              <Icon icon="lucide:map-pin" className="w-4 h-4" />
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
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const rawUser = sessionStorage.getItem("user");
    const rawJwt = sessionStorage.getItem("jwt");

    if (!rawUser || !rawJwt) {
      router.push("/account");
      return;
    }

    let parsedUser;
    try {
      parsedUser = JSON.parse(rawUser);
      setUser(parsedUser);
    } catch {
      router.push("/account");
      return;
    }

    if (!parsedUser?.email) {
      setError("Your account has no email on file.");
      setLoading(false);
      return;
    }

    orderAction
      .getOrdersByEmail(parsedUser.email)
      .then((res) => {
        setOrders(res.data?.data || []);
        setError(null);
      })
      .catch((err) => {
        console.error("Failed to load orders:", err);
        setError("Could not load your orders. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, [router]);

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
              <Link
                href="/profile"
                className="hover:text-green-600 transition-colors"
              >
                Profile
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
            {user && (
              <p className="text-sm text-gray-600 mb-6 text-center md:text-left">
                Showing orders for{" "}
                <span className="font-medium text-gray-900">{user.email}</span>
              </p>
            )}

            {loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                <p className="text-gray-600">Loading your orders…</p>
              </div>
            )}

            {!loading && error && (
              <div className="bg-white rounded-2xl shadow-md p-8 text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-primary text-white rounded-lg text-sm"
                >
                  Retry
                </button>
              </div>
            )}

            {!loading && !error && orders.length === 0 && (
              <div className="bg-white rounded-2xl shadow-md p-10 md:p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Package className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  No orders yet
                </h2>
                <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                  When you place an order, it will show up here with status and
                  item details.
                </p>
                <Link
                  href="/shop"
                  className="inline-flex px-6 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
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
                    userEmail={user?.email}
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
