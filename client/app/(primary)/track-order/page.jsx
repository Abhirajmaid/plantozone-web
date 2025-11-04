"use client";
import React from "react";
import { Container } from "@/src/components/layout/Container";
import { Section } from "@/src/components/layout/Section";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/src/components/ui/breadcrumb";
import { NewsletterSection, ShopServiceSection } from "@/src/components";
import OrderStatus from "@/src/components/common/OrderStatus";
import Link from "next/link";
import Image from "next/image";

// Mock order tracking data
const orderData = {
  orderId: "#SDGT1254FD",
  status: "Accepted",
  steps: [
    {
      id: 1,
      title: "Order Placed",
      date: "20 Oct 2024",
      time: "11:00 AM",
      completed: true,
      icon: "document-check"
    },
    {
      id: 2,
      title: "Accepted",
      date: "20 Oct 2024", 
      time: "11:15 AM",
      completed: true,
      icon: "document-check"
    },
    {
      id: 3,
      title: "In Progress",
      date: "Expected",
      time: "21 Oct 2024",
      completed: false,
      icon: "cog"
    },
    {
      id: 4,
      title: "On the Way",
      date: "Expected",
      time: "22,23 Oct 2024",
      completed: false,
      icon: "truck"
    },
    {
      id: 5,
      title: "Delivered",
      date: "Expected",
      time: "24 Oct 2024",
      completed: false,
      icon: "package"
    }
  ],
  products: [
    {
      id: 1,
      name: "Monstera deliciosa",
      type: "Indoor Plants",
      image: "/images/plant.png"
    },
    {
      id: 2,
      name: "Snake Plant",
      type: "Indoor Plants",
      image: "/images/plant.png"
    },
    {
      id: 3,
      name: "Fiddle Leaf Fig",
      type: "Indoor Plants",
      image: "/images/plant.png"
    },
    {
      id: 4,
      name: "Peace Lily",
      type: "Indoor Plants",
      image: "/images/plant.png"
    }
  ]
};

const StepIcon = ({ icon, completed }) => {
  const iconClass = completed ? "text-gray-800" : "text-gray-400";
  
  switch (icon) {
    case "document-check":
      return (
        <svg className={`w-6 h-6 ${iconClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          {completed && (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" className="text-yellow-500" />
          )}
        </svg>
      );
    case "cog":
      return (
        <svg className={`w-6 h-6 ${iconClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    case "truck":
      return (
        <svg className={`w-6 h-6 ${iconClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 14H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z" />
        </svg>
      );
    case "package":
      return (
        <svg className={`w-6 h-6 ${iconClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 14H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z" />
          {completed && (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" className="text-yellow-500" />
          )}
        </svg>
      );
    default:
      return null;
  }
};

// Hero Section with Breadcrumb
function TrackOrderHero() {
  return (
    <div 
      className="relative py-20 md:py-24 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/breadcrumbbg.png')" }}
    >
      <div className="absolute inset-0 bg-white/70"></div>
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

const TrackOrderPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section with Breadcrumb */}
      <TrackOrderHero />

      {/* Main Content */}
      <Section className="bg-gray-50">
        <Container>
          <div className="max-w-4xl mx-auto">

            {/* Order Status Section */}
            <OrderStatus orderData={orderData} />

            {/* Products Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Products</h2>
              
              <div className="space-y-4">
                {orderData.products.map((product) => (
                  <div key={product.id} className="flex items-center p-4 border border-gray-200 rounded-lg">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-600">{product.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Service Section - Full Width */}
      <Section className="bg-gray-50">
        <Container>
          <div className="[&>div]:!mb-8 [&>div]:!my-8">
            <ShopServiceSection />
          </div>
        </Container>
      </Section>

      {/* Newsletter Section */}
      <NewsletterSection />
    </div>
  );
};

export default TrackOrderPage;
