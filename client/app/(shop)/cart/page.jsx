"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Container } from "@/src/components/layout/Container";
import { Button } from "@/src/components/ui/button";
import {
  getCartItems,
  removeFromCart,
  updateQuantity,
} from "@/src/lib/utils/cartUtils";
import { Section } from "@/src/components/layout/Section";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { PageBanner, ShopServiceSection } from "@/src/components";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const router = useRouter();

  // Discount system state
  const [discountCode, setDiscountCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountError, setDiscountError] = useState("");

  useEffect(() => {
    setCartItems(getCartItems());
  }, []);

  const handleQuantityChange = (productId, size, shape, newQuantity) => {
    if (newQuantity < 1) return;
    const updated = updateQuantity(productId, size, shape, newQuantity);
    setCartItems(updated);
  };

  const handleRemoveItem = (productId, size, shape) => {
    const updated = removeFromCart(productId, size, shape);
    setCartItems(updated);
  };

  const handleClearCart = () => {
    localStorage.removeItem("plantozone_cart");
    setCartItems([]);
  };

  // Discount code handler
  const handleApplyDiscount = () => {
    const code = discountCode.trim().toUpperCase();
    const validCodes = ["SAVE10", "WELCOME15", "PLANT20"];
    let percent = 0;
    
    if (code === "SAVE10") {
      percent = 10;
    } else if (code === "WELCOME15") {
      percent = 15;
    } else if (code === "PLANT20") {
      percent = 20;
    }
    
    if (percent > 0) {
      setDiscountPercent(percent);
      setDiscountError("");
    } else {
      setDiscountPercent(0);
      setDiscountError("Invalid discount code");
    }
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => {
    let price = item.price;
    if (!price) {
      price = item.size === "8 Inch" ? 850 : 650;
    }
    return sum + price * item.quantity;
  }, 0);

  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const shipping = subtotal >= 2000 ? 0 : 79;
  const taxes = 0;
  const total = subtotal - discountAmount + shipping + taxes;

  return (
    <>
      <PageBanner title="Shopping Cart" showBreadcrumb={true} />
      <Section className="min-h-screen bg-gray-50">
        <Container className="py-8">

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Icon icon="material-symbols:shopping-cart-outline" className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
            <Link href="/shop">
              <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3">
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items Table */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Table Header */}
                <div className="bg-secondary px-6 py-4 grid grid-cols-12 gap-4 text-sm font-semibold text-black">
                  <div className="col-span-1"></div>
                  <div className="col-span-4">Product</div>
                  <div className="col-span-2">Price</div>
                  <div className="col-span-2">Quantity</div>
                  <div className="col-span-2">Subtotal</div>
                  <div className="col-span-1"></div>
                </div>

                {/* Cart Items */}
                {cartItems.map((item, index) => {
                  const displayPrice = item.price || (item.size === "8 Inch" ? 850 : 650);
                  const itemSubtotal = displayPrice * item.quantity;
                  
                  return (
                    <div key={`${item.product}-${item.size}-${item.shape || ""}`} className="px-6 py-4 border-b border-gray-200 grid grid-cols-12 gap-4 items-center">
                      {/* Remove Button */}
                      <div className="col-span-1">
                        <button
                          onClick={() => handleRemoveItem(item.product, item.size, item.shape)}
                          className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Icon icon="material-symbols:close" className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Product Image and Info */}
                      <div className="col-span-4 flex items-center space-x-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                          <Image
                            src={item.image || "/images/default-plant.jpg"}
                            alt={item.title}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 text-sm">{item.title}</h3>
                          <p className="text-xs text-gray-500">Indoor Plant</p>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="col-span-2">
                        <span className="text-sm font-medium text-gray-800">₹{displayPrice}</span>
                      </div>

                      {/* Quantity Controls */}
                      <div className="col-span-2">
                        <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                          <button
                            onClick={() => handleQuantityChange(item.product, item.size, item.shape, item.quantity - 1)}
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                          >
                            -
                          </button>
                          <span className="px-4 py-1 text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.product, item.size, item.shape, item.quantity + 1)}
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className="col-span-2">
                        <span className="text-sm font-semibold text-gray-800">₹{itemSubtotal}</span>
                      </div>

                      {/* Empty space for alignment */}
                      <div className="col-span-1"></div>
                    </div>
                  );
                })}
              </div>

              {/* Coupon and Clear Cart */}
              <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    placeholder="Coupon Code"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <Button
                    onClick={handleApplyDiscount}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
                  >
                    Apply Coupon
                  </Button>
                </div>
                <button
                  onClick={handleClearCart}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Clear Shopping Cart
                </button>
              </div>
              {discountError && (
                <div className="text-red-500 text-sm mt-2">{discountError}</div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Items</span>
                    <span className="text-gray-800">{totalItems}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Sub Total</span>
                    <span className="text-gray-800">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-800">₹{shipping}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Taxes</span>
                    <span className="text-gray-800">₹{taxes}</span>
                  </div>
                  {discountPercent > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Coupon Discount</span>
                      <span>-₹{discountAmount}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span className="text-gray-800">Total</span>
                      <span className="text-gray-800">₹{total}</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => router.push("/checkouts")}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-base font-medium"
                >
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Services Section */}
        <div className="mb-12 mt-28">
          <ShopServiceSection />
        </div>
      </Container>
      </Section>

      {/* Newsletter Section */}
      <div className="bg-gray-100 py-16 rounded-2xl mx-6 mb-16">
        <Container>
          <div className="text-center">
            <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
              OUR NEWSLETTER
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Subscribe to Our Newsletter to Get Updates on Our Latest Offers
            </h2>
            <p className="text-gray-600 mb-8">
              Get 25% off on your first order just by subscribing to our newsletter
            </p>
            
            <form className="max-w-md mx-auto">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter Email Address"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
                <button
                  type="submit"
                  className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </Container>
      </div>
    </>
  );
}
