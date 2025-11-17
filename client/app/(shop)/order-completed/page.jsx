"use client";
import React from "react";
import { Container } from "@/src/components/layout/Container";
import { Section } from "@/src/components/layout/Section";
import { Button } from "@/src/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/src/components/ui/breadcrumb";
import { NewsletterSection } from "@/src/components";
import Link from "next/link";
import Image from "next/image";

// Mock order data - in real app, this would come from props or API
const orderData = {
  orderId: "#SDGT1254FD",
  paymentMethod: "Paypal",
  transactionId: "TR542SSFE",
  estimatedDelivery: "24 October 2024",
  products: [
    {
      id: 1,
      name: "Monstera deliciosa",
      type: "Indoor Plant",
      price: 850.00,
      image: "/images/plant.png"
    },
    {
      id: 2,
      name: "Snake Plant",
      type: "Indoor Plant", 
      price: 650.00,
      image: "/images/plant.png"
    },
    {
      id: 3,
      name: "Fiddle Leaf Fig",
      type: "Indoor Plant",
      price: 850.00,
      image: "/images/plant.png"
    },
    {
      id: 4,
      name: "Peace Lily",
      type: "Indoor Plant",
      price: 650.00,
      image: "/images/plant.png"
    }
  ],
  shipping: 0.00,
  taxes: 0.00,
  couponDiscount: 100.00,
  total: 3000.00
};

// Hero Section with Breadcrumb
function OrderCompletedHero() {
  return (
    <div 
      className="relative py-20 md:py-24 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/breadcrumbbg.png')" }}
    >
      <div className="absolute inset-0 bg-white/70"></div>
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

const OrderCompleted = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section with Breadcrumb */}
      <OrderCompletedHero />

      {/* Main Content */}
      <Section className="bg-gray-50">
        <Container>
          <div className="max-w-4xl mx-auto">

            {/* Success Message */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-yellow-500 rounded-full mb-6">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Your order is completed!
              </h2>
              <p className="text-lg text-gray-600">
                Thank you. Your Order has been received.
              </p>
            </div>

            {/* Order Summary Box */}
            <div className="bg-yellow-500 rounded-2xl p-8 mb-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-sm text-gray-700 mb-2">Order ID</div>
                  <div className="font-bold text-gray-900">{orderData.orderId}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-700 mb-2">Payment Method</div>
                  <div className="font-bold text-gray-900">{orderData.paymentMethod}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-700 mb-2">Transaction ID</div>
                  <div className="font-bold text-gray-900">{orderData.transactionId}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-700 mb-2">Estimated Delivery Date</div>
                  <div className="font-bold text-gray-900">{orderData.estimatedDelivery}</div>
                </div>
              </div>
              
              {/* Download Invoice Button - Centered below the grid */}
              <div className="flex justify-center mt-8">
                <Link href="/orders">
                  <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    Download Invoice
                  </Button>
                </Link>
              </div>
            </div>

            {/* Order Details */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Order Details</h3>
              
              {/* Products List */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Products</h4>
                <div className="space-y-4">
                  {orderData.products.map((product) => (
                    <div key={product.id} className="flex items-center justify-between py-6 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={50}
                            height={50}
                            className="object-cover rounded-lg"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-gray-900 text-lg">{product.name}</div>
                          <div className="text-sm text-gray-600">{product.type}</div>
                        </div>
                      </div>
                      <div className="font-bold text-gray-900 text-lg">
                        ₹{product.price.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary of Charges */}
              <div className="border-t border-gray-200 pt-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold">₹{orderData.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxes</span>
                    <span className="font-semibold">₹{orderData.taxes.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Coupon Discount</span>
                    <span className="font-semibold text-green-600">-₹{orderData.couponDiscount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3">
                    <span>Total</span>
                    <span>₹{orderData.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              <div className="bg-white rounded-xl p-6 text-center shadow-lg">
                <div className="w-16 h-16 bg-yellow-100 border-2 border-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 14H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z" />
                  </svg>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Free Shipping</h4>
                <p className="text-sm text-gray-600">Free shipping for order above ₹2000</p>
              </div>

              <div className="bg-white rounded-xl p-6 text-center shadow-lg">
                <div className="w-16 h-16 bg-yellow-100 border-2 border-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Flexible Payment</h4>
                <p className="text-sm text-gray-600">Multiple secure payment options</p>
              </div>

              <div className="bg-white rounded-xl p-6 text-center shadow-lg">
                <div className="w-16 h-16 bg-yellow-100 border-2 border-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">24x7 Support</h4>
                <p className="text-sm text-gray-600">We support online all days</p>
              </div>
            </div>

            {/* Newsletter Section */}
            <NewsletterSection />
          </div>
        </Container>
      </Section>
    </div>
  );
};

export default OrderCompleted;
