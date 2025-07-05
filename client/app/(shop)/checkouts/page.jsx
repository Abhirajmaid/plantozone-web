"use client";

import { useEffect, useState } from "react";
import { getCartItems } from "@/src/lib/utils/cartUtils";
import { Container } from "@/src/components/layout/Container";
import { Section } from "@/src/components/layout/Section";
import { Button } from "@/src/components/ui/button";

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Discount state
  const [discount, setDiscount] = useState({ code: "", percent: 0 });

  // User details state
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    pincode: "",
    city: "",
    state: "",
  });
  const [touched, setTouched] = useState({});
  const [formError, setFormError] = useState("");

  useEffect(() => {
    setCartItems(getCartItems());
    // Read discount info from localStorage
    if (typeof window !== "undefined") {
      const d = localStorage.getItem("plantozone_discount");
      if (d) {
        try {
          const parsed = JSON.parse(d);
          if (parsed && parsed.code && parsed.percent) {
            setDiscount(parsed);
          }
        } catch {}
      }
    }
  }, []);

  // Calculate subtotal
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discountAmount = Math.round((subtotal * discount.percent) / 100);
  const total = subtotal - discountAmount;

  // Validation
  const isValid =
    userDetails.name.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userDetails.email) &&
    /^[6-9]\d{9}$/.test(userDetails.phone) &&
    userDetails.address.trim() &&
    userDetails.pincode.trim().length === 6 &&
    userDetails.city.trim() &&
    userDetails.state.trim();

  // Helper to create Shiprocket order after payment
  const createShiprocketOrder = async (orderData) => {
    try {
      // 1. Authenticate with Shiprocket API to get token
      const authRes = await fetch(
        "https://apiv2.shiprocket.in/v1/external/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "YOUR_SHIPROCKET_EMAIL",
            password: "YOUR_SHIPROCKET_PASSWORD",
          }),
        }
      );
      const authJson = await authRes.json();
      const token = authJson.token;

      // 2. Prepare Shiprocket order payload
      const firstItem = orderData.items[0];
      const shiprocketOrder = {
        order_id: orderData.orderId,
        order_date: new Date().toISOString().slice(0, 10),
        pickup_location: "Primary", // Change as per your Shiprocket settings
        billing_customer_name: orderData.userName,
        billing_last_name: "",
        billing_address: orderData.address,
        billing_address_2: orderData.address2 || "",
        billing_city: orderData.city,
        billing_pincode: orderData.pincode,
        billing_state: orderData.state,
        billing_country: "India",
        billing_email: orderData.userEmail,
        billing_phone: orderData.userPhone,
        shipping_is_billing: true,
        order_items: orderData.items.map((item) => ({
          name: item.title,
          sku: item.product?.toString() || "",
          units: item.quantity,
          selling_price: item.price,
        })),
        payment_method: "Prepaid",
        sub_total: orderData.total,
        length: 10,
        breadth: 10,
        height: 10,
        weight: 0.5,
      };

      // 3. Create order in Shiprocket
      await fetch(
        "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(shiprocketOrder),
        }
      );
    } catch (err) {
      // Optionally handle Shiprocket errors
      // console.error("Shiprocket order error", err);
    }
  };

  // Razorpay handler
  const handleRazorpay = async () => {
    if (!isValid) {
      setFormError("Please fill all required fields correctly.");
      setTouched({
        name: true,
        email: true,
        phone: true,
        address: true,
        pincode: true,
        city: true,
        state: true,
      });
      return;
    }
    setFormError("");
    setLoading(true);
    const options = {
      key: "rzp_live_ej1IxaDWxmb1nD", // Replace with your Razorpay key
      amount: total * 100, // in paise, use discounted total
      currency: "INR",
      name: "Plantozone",
      description: "Order Payment",
      image: "/images/logo_color.png",
      handler: async function (response) {
        // Add order to Strapi Orders API
        try {
          const orderRes = await fetch(
            "https://dashboard.plantozone.com/api/order-details",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                data: {
                  orderId: response.razorpay_payment_id,
                  userName: userDetails.name,
                  userEmail: userDetails.email,
                  userPhone: userDetails.phone,
                  address: `${userDetails.address}${
                    userDetails.address2 ? ", " + userDetails.address2 : ""
                  }`,
                  address2: userDetails.address2 || "",
                  pincode: userDetails.pincode,
                  city: userDetails.city,
                  state: userDetails.state,
                  items: cartItems,
                  subtotal: subtotal,
                  discountCode: discount.code,
                  discountPercent: discount.percent,
                  discountAmount: discountAmount,
                  total: total,
                  paymentId: response.razorpay_payment_id,
                  status: "paid",
                },
              }),
            }
          );
          // Also create order in Shiprocket
          await createShiprocketOrder({
            orderId: response.razorpay_payment_id,
            userName: userDetails.name,
            userEmail: userDetails.email,
            userPhone: userDetails.phone,
            address: userDetails.address,
            address2: userDetails.address2 || "",
            pincode: userDetails.pincode,
            city: userDetails.city,
            state: userDetails.state,
            items: cartItems,
            subtotal: subtotal,
            discountCode: discount.code,
            discountPercent: discount.percent,
            discountAmount: discountAmount,
            total: total,
          });
          alert(
            "Payment successful! Order placed. Payment ID: " +
              response.razorpay_payment_id
          );
        } catch (err) {
          alert(
            "Payment succeeded but failed to save order. Please contact support."
          );
        }
      },
      prefill: {
        name: userDetails.name,
        email: userDetails.email,
        contact: userDetails.phone,
      },
      theme: {
        color: "#16a34a",
      },
    };

    if (typeof window !== "undefined") {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => {
        setLoading(false);
        const rzp = new window.Razorpay(options);
        rzp.open();
      };
      document.body.appendChild(script);
    }
  };

  const handleChange = (e) => {
    setUserDetails((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleBlur = (e) => {
    setTouched((prev) => ({
      ...prev,
      [e.target.name]: true,
    }));
  };

  return (
    <Section className="min-h-screen bg-gray-50">
      <Container className="mx-auto px-4 sm:px-6 lg:px-8 xl:px-[100px] py-8 sm:py-10 lg:py-16 pt-20 lg:pt-[120px]">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center text-green-700">
            Checkout
          </h1>
          {cartItems.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg shadow">
              <p className="mb-4 text-lg text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-transparent">
              {/* Left: Shipping Form */}
              <form
                className="space-y-6 bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex flex-col h-fit"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleRazorpay();
                }}
              >
                <h3 className="text-lg font-semibold text-green-700 mb-4">
                  Shipping Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      Name<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={userDetails.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-200 ${
                        touched.name && !userDetails.name
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      required
                      placeholder="Full Name"
                    />
                  </div>
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      Email<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={userDetails.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-200 ${
                        touched.email &&
                        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userDetails.email)
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      required
                      placeholder="you@email.com"
                    />
                  </div>
                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      Phone<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={userDetails.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-200 ${
                        touched.phone && !/^[6-9]\d{9}$/.test(userDetails.phone)
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      required
                      placeholder="10-digit mobile number"
                    />
                  </div>
                  {/* Pincode */}
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      Pincode<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={userDetails.pincode}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      maxLength={6}
                      className={`w-full border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-200 ${
                        touched.pincode && userDetails.pincode.length !== 6
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      required
                      placeholder="6-digit pincode"
                    />
                  </div>
                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      City<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={userDetails.city}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-200 ${
                        touched.city && !userDetails.city
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      required
                      placeholder="City"
                    />
                  </div>
                  {/* State */}
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      State<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={userDetails.state}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-200 ${
                        touched.state && !userDetails.state
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      required
                      placeholder="State"
                    />
                  </div>
                </div>
                {/* Address */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Address<span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="address"
                    value={userDetails.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-200 ${
                      touched.address && !userDetails.address
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    rows={2}
                    required
                    placeholder="Flat, House no., Building, Company, Apartment"
                  />
                  <textarea
                    name="address2"
                    value={userDetails.address2 || ""}
                    onChange={(e) =>
                      setUserDetails((prev) => ({
                        ...prev,
                        address2: e.target.value,
                      }))
                    }
                    className="w-full border rounded-lg px-3 py-2 bg-white mt-2 focus:outline-none focus:ring-2 focus:ring-green-200 border-gray-300"
                    rows={2}
                    placeholder="Area, Colony, Street, Sector, Village (optional)"
                  />
                </div>
                {formError && (
                  <div className="text-red-600 text-sm font-medium">
                    {formError}
                  </div>
                )}
                <Button
                  className="w-full py-5 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white text-base font-bold rounded-xl shadow-md border-0 transition-all duration-200 flex items-center justify-center gap-2"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Pay Now"}
                </Button>
              </form>
              {/* Right: Order Summary */}
              <div className="bg-white rounded-2xl shadow-xl p-0 h-fit flex flex-col items-center">
                <div className="w-full max-w-md mx-auto bg-gradient-to-br from-green-50 to-white rounded-2xl border border-green-200 shadow p-0 mt-0">
                  <div className="flex flex-col items-center py-6 border-b border-dashed border-green-300">
                    <img
                      src="/logo.png"
                      alt="Plantozone"
                      className="w-16 h-16 mb-2"
                    />
                    <h2 className="text-2xl font-bold text-green-700 tracking-wider mb-1">
                      Plantozone
                    </h2>
                    <span className="text-xs text-gray-400">Order Bill</span>
                  </div>
                  <ul className="divide-y divide-dashed divide-green-200 mb-0">
                    {cartItems.map((item, idx) => (
                      <li
                        key={idx}
                        className="py-4 flex items-center gap-3 px-6"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-12 h-12 object-cover rounded border"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-800 text-sm line-clamp-1">
                            {item.title}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            <span className="mr-2">
                              Size:{" "}
                              <span className="font-semibold">{item.size}</span>
                            </span>
                            <span>
                              Shape:{" "}
                              <span className="font-semibold">
                                {item.shape}
                              </span>
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Qty:{" "}
                            <span className="font-semibold">
                              {item.quantity}
                            </span>
                          </div>
                        </div>
                        <div className="font-semibold text-green-700 text-base min-w-[60px] text-right">
                          ₹{item.price * item.quantity}
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="px-6 py-4 border-t border-dashed border-green-300">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold text-gray-800">
                        ₹{subtotal}
                      </span>
                    </div>
                    {discount.percent > 0 && (
                      <div className="flex justify-between items-center mb-2 text-green-700">
                        <span>
                          Discount
                          {discount.code && (
                            <span className="ml-2 text-xs text-green-600">
                              ({discount.code} -{discount.percent}%)
                            </span>
                          )}
                        </span>
                        <span className="font-semibold">
                          -₹{discountAmount}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Delivery</span>
                      <span className="font-semibold text-gray-800">Free</span>
                    </div>
                    <div className="flex justify-between items-center font-bold text-lg border-t border-dashed border-green-200 pt-3">
                      <span>Total</span>
                      <span className="text-green-700">₹{total}</span>
                    </div>
                  </div>
                  <div className="px-6 pb-6">
                    <Button
                      className="w-full py-5 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white text-base font-bold rounded-xl shadow-md border-0 transition-all duration-200 flex items-center justify-center gap-2"
                      type="button"
                      disabled={loading || !isValid}
                      onClick={handleRazorpay}
                    >
                      <svg
                        className="w-6 h-6 mr-2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17 9V7a5 5 0 00-10 0v2M5 12h14l-1.38 8.29A2 2 0 0115.64 22H8.36a2 2 0 01-1.98-1.71L5 12zm2 0V7a3 3 0 016 0v5"
                        />
                      </svg>
                      {loading ? "Processing..." : "Pay with Razorpay"}
                    </Button>
                    {!isValid && (
                      <div className="text-red-600 text-sm font-medium mt-2 text-center">
                        Please fill all required details to proceed.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}
