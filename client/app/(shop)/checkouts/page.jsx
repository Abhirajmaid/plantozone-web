"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCartItems } from "@/src/lib/utils/cartUtils";
import { Container } from "@/src/components/layout/Container";
import PrimaryButton from "@/src/components/common/PrimaryButton";
import SecondaryButton from "@/src/components/common/SecondaryButton";
import Link from "next/link";
import { ShopServiceSection, NewsletterSection } from "@/src/components";
import {
  isPincodeServiceable,
  isValidPincodeFormat,
  getServiceablePincodesList,
} from "@/src/lib/utils/pincodeValidation";

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Discount state
  const [discount, setDiscount] = useState({ code: "", percent: 0 });

  // User details state
  const [userDetails, setUserDetails] = useState({
    name: "",
    lastName: "",
    companyName: "",
    country: "India",
    email: "",
    phone: "",
    address: "",
    pincode: "",
    city: "",
    state: "",
  });
  const [touched, setTouched] = useState({});
  const [formError, setFormError] = useState("");
  const [pincodeError, setPincodeError] = useState("");
  const [isPincodeValidating, setIsPincodeValidating] = useState(false);

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

  // Delivery fee logic
  const DELIVERY_FEE = 79;
  const FREE_DELIVERY_THRESHOLD = 2000;
  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const isFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;

  const total = subtotal - discountAmount + deliveryFee;

  // Validation
  const isValid =
    userDetails.name.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userDetails.email) &&
    /^[6-9]\d{9}$/.test(userDetails.phone) &&
    userDetails.address.trim() &&
    userDetails.pincode.trim().length === 6 &&
    isValidPincodeFormat(userDetails.pincode) &&
    isPincodeServiceable(userDetails.pincode) &&
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

    // Additional pin code validation
    if (userDetails.pincode && !isPincodeServiceable(userDetails.pincode)) {
      setFormError(
        "Sorry, we don't deliver to this pin code yet. Please check our serviceable areas."
      );
      setPincodeError(
        "Sorry, we don't deliver to this pin code yet. Coming soon!"
      );
      return;
    }

    setFormError("");
    setPincodeError("");
    setLoading(true);

    // 1. Create order on backend
    const orderRes = await fetch(
      "https://dashboard.plantozone.com/api/create-razorpay-order",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total }),
      }
    );
    const orderData = await orderRes.json();

    if (!orderData.id) {
      setLoading(false);
      setFormError("Failed to initiate payment. Please try again.");
      return;
    }

    const options = {
      key: "rzp_live_sJplWbjaaPEBXZ",
      amount: total * 100,
      currency: "INR",
      name: "Plantozone",
      description: "Order Payment",
      image: "/images/logo_color.png",
      order_id: orderData.id, // Pass order_id here!
      handler: async function (response) {
        // Save order in your DB as before
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
                  orderId: response.razorpay_order_id,
                  paymentId: response.razorpay_payment_id,
                  paymentSignature: response.razorpay_signature,
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
                  deliveryFee: deliveryFee,
                  isFreeDelivery: isFreeDelivery,
                  total: total,
                  status: "paid",
                },
              }),
            }
          );
          // ... Shiprocket order as before
          await createShiprocketOrder({
            orderId: response.razorpay_order_id,
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
            deliveryFee: deliveryFee,
            isFreeDelivery: isFreeDelivery,
            total: total,
          });
          // Redirect to order completed page
          router.push("/order-completed");
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
    const { name, value } = e.target;
    setUserDetails((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate pin code when it changes
    if (name === "pincode") {
      setPincodeError("");
      setIsPincodeValidating(true);

      // Debounce pin code validation
      setTimeout(() => {
        if (value.length === 6) {
          if (!isValidPincodeFormat(value)) {
            setPincodeError("Please enter a valid 6-digit pin code");
          } else if (!isPincodeServiceable(value)) {
            setPincodeError(
              "Sorry, we don't deliver to this pin code yet. Coming soon!"
            );
          }
        }
        setIsPincodeValidating(false);
      }, 500);
    }
  };

  const handleBlur = (e) => {
    setTouched((prev) => ({
      ...prev,
      [e.target.name]: true,
    }));
  };

  return (
    <div className="pt-[88px]">
      {/* Hero/Breadcrumb Section */}
      <div 
        className="relative py-20 md:py-24 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/breadcrumbbg.png')" }}
      >
        <div className="absolute inset-0 bg-white/70"></div>
        <Container>
          <div className="relative z-10 flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Checkout
            </h1>
            <div className="flex items-center gap-2 text-gray-600">
              <Link href="/" className="hover:text-green-600 transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/cart" className="hover:text-green-600 transition-colors">
                Shopping Cart
              </Link>
              <span>/</span>
              <span className="text-gray-800 font-medium">Checkout</span>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Checkout Section */}
      <div className="py-16 bg-white">
        <Container>
          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <p className="mb-4 text-lg text-gray-500">Your cart is empty</p>
              <Link href="/shop">
                <SecondaryButton withArrow={false}>
                  Continue Shopping
                </SecondaryButton>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Left: Billing Details - Spans 2 columns */}
              <form
                className="lg:col-span-2 space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleRazorpay();
                }}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Billing Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={userDetails.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                      required
                      placeholder="Ex. John"
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={userDetails.lastName || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                      required
                      placeholder="Ex. Doe"
                    />
                  </div>
                </div>

                {/* Company Name (Optional) */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Company Name (Optional)
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={userDetails.companyName || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    placeholder="Enter Company Name"
                  />
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Country *
                  </label>
                  <select
                    name="country"
                    value={userDetails.country || "India"}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    required
                  >
                    <option value="">Select Country</option>
                    <option value="India">India</option>
                  </select>
                </div>

                {/* Street Address */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={userDetails.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    required
                    placeholder="Enter Street Address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={userDetails.city}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                      required
                      placeholder="Select City"
                    />
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={userDetails.state}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                      required
                      placeholder="Select State"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Zip Code */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Zip Code *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={userDetails.pincode}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      maxLength={6}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                      required
                      placeholder="Enter Zip Code"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={userDetails.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                      required
                      placeholder="Enter Phone Number"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={userDetails.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    required
                    placeholder="Enter Email Address"
                  />
                </div>

                {/* Delivery Address Section */}
                <div>
                  <label className="block text-sm font-medium mb-3 text-gray-700">
                    Delivery Address *
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="deliveryAddress"
                        value="same"
                        defaultChecked
                        className="w-5 h-5 text-green-600 focus:ring-green-600"
                      />
                      <span className="text-gray-700">Same as shipping address</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="deliveryAddress"
                        value="different"
                        className="w-5 h-5 text-green-600 focus:ring-green-600"
                      />
                      <span className="text-gray-700">Use a different billing address</span>
                    </label>
                  </div>
                </div>

                {formError && (
                  <div className="text-red-600 text-sm font-medium bg-red-50 p-4 rounded-lg">
                    {formError}
                  </div>
                )}
              </form>

              {/* Right: Order Summary - Spans 1 column */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-xl p-6 sticky top-24">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Order Summary
                  </h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-gray-700">
                      <span>Items:</span>
                      <span className="font-semibold">{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Sub Total</span>
                      <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Shipping</span>
                      <span className="font-semibold">₹{deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Taxes</span>
                      <span className="font-semibold">₹0.00</span>
                    </div>
                    {discount.percent > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Coupon Discount</span>
                        <span className="font-semibold">-₹{discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t border-gray-300 pt-4">
                      <div className="flex justify-between text-gray-900">
                        <span className="text-lg font-bold">Total</span>
                        <span className="text-2xl font-bold">₹{total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <PrimaryButton
                    onClick={handleRazorpay}
                    disabled={loading || !isValid}
                    withArrow={false}
                    className="w-full py-4 text-lg font-semibold"
                  >
                    {loading ? "Processing..." : "Proceed to Payment"}
                  </PrimaryButton>

                  {!isValid && (
                    <p className="text-red-600 text-sm mt-3 text-center">
                      Please fill all required fields
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </Container>
      </div>

      {/* Services Section (Center Aligned) */}
      <div className="mb-16">
        <ShopServiceSection />
      </div>

      {/* Newsletter Section */}
      <div className="mb-16">
        <NewsletterSection />
      </div>
    </div>
  );
}
