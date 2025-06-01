"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Package,
  Leaf,
  Truck,
  Sprout,
  CreditCard,
  Banknote,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";
import { Separator } from "@/src/components/ui/separator";
import { Section } from "@/src/components/layout/Section";
import { Container } from "@/src/components/layout/Container";
import { useAuth } from "@/src/hooks/useAuth";
import cartAction from "@/src/lib/action/cart.action";

// Form validation schema
const checkoutSchema = z.object({
  email: z.string().email("Invalid email format"),
  country: z.string().min(1, "Country is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pinCode: z
    .string()
    .regex(/^\d{6}$/, "PIN code must be 6 digits")
    .min(1, "PIN code is required"),
  phone: z
    .string()
    .regex(/^\d{10}$/, "Phone number must be 10 digits")
    .min(1, "Phone number is required"),
  saveInfo: z.boolean().optional(),
  newsletter: z.boolean().optional(),
  paymentMethod: z.enum(["razorpay", "cod"], {
    required_error: "Please select a payment method",
  }),
  sameAsBilling: z.boolean().optional(),
});

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: user?.email || "",
      country: "india",
      state: "maharashtra",
      paymentMethod: "razorpay",
      sameAsBilling: true,
    },
  });

  const paymentMethod = watch("paymentMethod");

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
        if (!userCart || userCart.length === 0) {
          router.push("/cart");
          return;
        }
        setCartItems(userCart);
      } catch (error) {
        console.error("Failed to fetch cart items", error);
        router.push("/cart");
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

  // Handle form submission
  const onSubmit = async (data) => {
    setProcessing(true);

    try {
      const orderData = {
        ...data,
        cartItems,
        subtotal,
        shippingCost,
        discount: discountAmount,
        total,
        couponCode: couponApplied ? couponCode : null,
      };

      if (data.paymentMethod === "razorpay") {
        // Create Razorpay order
        const response = await fetch("/api/create-razorpay-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        });

        const order = await response.json();

        if (!response.ok) {
          throw new Error(order.error || "Failed to create order");
        }

        // Initialize Razorpay
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency,
          name: "Plantozone",
          description: "Plant Purchase",
          order_id: order.id,
          handler: async (response) => {
            // Verify payment
            const verifyResponse = await fetch("/api/verify-payment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderData,
              }),
            });

            const verifyResult = await verifyResponse.json();

            if (verifyResponse.ok) {
              // Clear cart and redirect to success
              router.push(`/order-success?orderId=${verifyResult.orderId}`);
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          },
          prefill: {
            name: `${data.firstName} ${data.lastName}`,
            email: data.email,
            contact: data.phone,
          },
          theme: {
            color: "#16a34a",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // COD Order
        const response = await fetch("/api/create-cod-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        });

        const result = await response.json();

        if (response.ok) {
          router.push(`/order-success?orderId=${result.orderId}`);
        } else {
          throw new Error(result.error || "Failed to create order");
        }
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <Section className="min-h-screen">
        <Container className="pt-20">
          <div className="flex justify-center items-center min-h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p>Loading checkout...</p>
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section>
      <Container className="min-h-screen pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Left Column - Forms */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Image
                  src="/images/logo_color.png"
                  alt="Plantozone Logo"
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                />
                <Link
                  href="/cart"
                  className="text-sm text-green-600 hover:text-green-700"
                >
                  Return to cart
                </Link>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Contact Section */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Contact</h2>
                  <div>
                    <Input
                      {...register("email")}
                      type="email"
                      placeholder="Email"
                      className="w-full"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="newsletter" {...register("newsletter")} />
                    <Label htmlFor="newsletter">
                      Email me with news and offers
                    </Label>
                  </div>
                </div>

                {/* Delivery Section */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Delivery</h2>

                  {/* Country */}
                  <div>
                    <select
                      {...register("country")}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:outline-none"
                    >
                      <option value="india">India</option>
                    </select>
                    {errors.country && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.country.message}
                      </p>
                    )}
                  </div>

                  {/* Name */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Input
                        {...register("firstName")}
                        placeholder="First name"
                      />
                      {errors.firstName && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Input
                        {...register("lastName")}
                        placeholder="Last name"
                      />
                      {errors.lastName && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <Input {...register("address")} placeholder="Address" />
                    {errors.address && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.address.message}
                      </p>
                    )}
                  </div>

                  {/* City, State, PIN */}
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <Input {...register("city")} placeholder="City" />
                      {errors.city && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.city.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <select
                        {...register("state")}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:outline-none"
                      >
                        <option value="maharashtra">Maharashtra</option>
                        <option value="delhi">Delhi</option>
                        <option value="karnataka">Karnataka</option>
                        <option value="gujarat">Gujarat</option>
                        <option value="rajasthan">Rajasthan</option>
                        <option value="tamilnadu">Tamil Nadu</option>
                        <option value="westbengal">West Bengal</option>
                        <option value="telangana">Telangana</option>
                        <option value="andhra-pradesh">Andhra Pradesh</option>
                        <option value="uttar-pradesh">Uttar Pradesh</option>
                      </select>
                      {errors.state && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.state.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Input {...register("pinCode")} placeholder="PIN code" />
                      {errors.pinCode && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.pinCode.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <Input {...register("phone")} placeholder="Phone" />
                    {errors.phone && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  {/* Save Info */}
                  <div className="flex items-center space-x-2">
                    <Checkbox id="save-info" {...register("saveInfo")} />
                    <Label htmlFor="save-info">
                      Save this information for next time
                    </Label>
                  </div>
                </div>

                {/* Payment Section */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Payment</h2>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-600 mb-4">
                        All transactions are secure and encrypted.
                      </p>
                      <RadioGroup
                        value={paymentMethod}
                        onValueChange={(value) =>
                          setValue("paymentMethod", value)
                        }
                        className="space-y-3"
                      >
                        <div className="flex items-center space-x-2 p-3 border rounded-lg">
                          <RadioGroupItem value="cod" id="cod" />
                          <Label
                            htmlFor="cod"
                            className="flex items-center gap-2"
                          >
                            <Banknote className="w-4 h-4" />
                            Cash On Delivery (COD)
                          </Label>
                        </div>
                      </RadioGroup>
                      {errors.paymentMethod && (
                        <p className="text-sm text-red-500 mt-2">
                          {errors.paymentMethod.message}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Billing Address */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Billing address</h2>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="same-address"
                      {...register("sameAsBilling")}
                      defaultChecked
                    />
                    <Label htmlFor="same-address">
                      Same as shipping address
                    </Label>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={processing}
                  className="w-full bg-green-600 hover:bg-green-700 py-3"
                >
                  {processing
                    ? "Processing..."
                    : paymentMethod === "cod"
                    ? "Place Order"
                    : "Pay Now"}
                </Button>
              </form>

              <div className="flex justify-center space-x-4 text-sm text-gray-500">
                <Link href="/refund">Refund policy</Link>
                <Link href="/privacy">Privacy policy</Link>
                <Link href="/terms">Terms of service</Link>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="space-y-6 bg-gray-50 p-6 rounded-lg">
              {/* Cart Items */}
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-start space-x-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-lg border bg-white">
                      <img
                        src={item.image || "/api/placeholder/64/64"}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-500 text-xs text-white">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{item.title}</h3>
                      <p className="text-xs text-gray-500">Size: {item.size}</p>
                    </div>
                    <p className="font-medium text-sm">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Coupon Section */}
              <div className="space-y-4">
                <div className="flex">
                  <Input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Discount code or gift card"
                    className="rounded-r-none"
                    disabled={couponApplied}
                  />
                  {couponApplied ? (
                    <Button
                      type="button"
                      onClick={removeCoupon}
                      variant="outline"
                      className="rounded-l-none text-red-600 border-red-600"
                    >
                      Remove
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={applyCoupon}
                      variant="outline"
                      className="rounded-l-none"
                    >
                      Apply
                    </Button>
                  )}
                </div>

                {!couponApplied && (
                  <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-green-800">
                        <span className="font-medium text-sm">ECO100</span>
                        <span className="text-xs">
                          ₹100 off on ₹899+ Orders!
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-green-800">
                        <span className="font-medium text-sm">PLANT50</span>
                        <span className="text-xs">
                          ₹50 off on ₹500+ Orders!
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {couponApplied && (
                  <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                    <p className="text-sm text-green-800 font-medium">
                      Coupon "{couponCode}" applied successfully!
                    </p>
                  </div>
                )}
              </div>

              <Separator />

              {/* Price Summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span className={shippingCost === 0 ? "text-green-600" : ""}>
                    {shippingCost === 0 ? "FREE" : `₹${shippingCost}`}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-semibold">
                  1 Million+ Happy Customers Trust Us!
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Package className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-sm">Guaranteed Returns</p>
                      <p className="text-xs text-gray-600">
                        Assured replacements if your plant arrives damaged or
                        dies within the first 15 days
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Leaf className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-sm">
                        Healthy & Premium Looking Plants
                      </p>
                      <p className="text-xs text-gray-600">
                        We grow & nurture all our plants with love for 6 months
                        before sending them to you
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Truck className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-sm">
                        Our Plants Grow Everywhere
                      </p>
                      <p className="text-xs text-gray-600">
                        We deliver all over the country
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Sprout className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-sm">Growing the Grower</p>
                      <p className="text-xs text-gray-600">
                        We have been growing plants for over 30 years and
                        understand the science behind it
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Razorpay Script */}
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </Container>
    </Section>
  );
}
