 "use client";
 import React, { useEffect, useState } from "react";
 import { Container } from "@/src/components/layout/Container";
 import { Section } from "@/src/components/layout/Section";
 import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/src/components/ui/breadcrumb";
 import { NewsletterSection, ShopServiceSection } from "@/src/components";
 import OrderStatus from "@/src/components/common/OrderStatus";
 import Link from "next/link";
 import Image from "next/image";
 import { useSearchParams } from "next/navigation";

 // Mock base order tracking data (used when no API is available)
 const baseOrderData = {
   orderId: "#SDGT1254FD",
   status: "Accepted",
   steps: [
     { id: 1, label: "Order Placed", date: "20 Oct 2024", time: "11:00 AM", completed: true, icon: "package" },
     { id: 2, label: "Accepted", date: "20 Oct 2024", time: "11:15 AM", completed: true, icon: "check" },
     { id: 3, label: "In Progress", date: "Expected", time: "21 Oct 2024", completed: false, icon: "loader" },
     { id: 4, label: "On the Way", date: "Expected", time: "22,23 Oct 2024", completed: false, icon: "truck" },
     { id: 5, label: "Delivered", date: "Expected", time: "24 Oct 2024", completed: false, icon: "home" }
   ],
   products: [
     { id: 1, name: "Monstera deliciosa", type: "Indoor Plants", image: "/images/plant.png" },
     { id: 2, name: "Snake Plant", type: "Indoor Plants", image: "/images/plant.png" },
     { id: 3, name: "Fiddle Leaf Fig", type: "Indoor Plants", image: "/images/plant.png" },
     { id: 4, name: "Peace Lily", type: "Indoor Plants", image: "/images/plant.png" }
   ]
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
  const searchParams = useSearchParams();
  const orderIdParam = searchParams?.get?.("orderId") || "";
  const emailParam = searchParams?.get?.("email") || "";

  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!orderIdParam) {
      setOrderData(null);
      return;
    }

    setLoading(true);

    const timer = setTimeout(() => {
      const data = JSON.parse(JSON.stringify(baseOrderData));
      data.orderId = orderIdParam;
      data.requestedBy = emailParam || null;

      const idUpper = orderIdParam.toUpperCase();
      let completeCount = 2;
      if (idUpper.includes("DEL")) completeCount = 5;
      else if (idUpper.includes("WAY")) completeCount = 4;
      else if (idUpper.includes("PROG")) completeCount = 3;

      data.steps = data.steps.map((s, idx) => ({ ...s, completed: idx < completeCount }));

      setOrderData(data);
      setLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, [orderIdParam, emailParam]);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section with Breadcrumb */}
      <TrackOrderHero />

      {/* Main Content */}
      <Section className="bg-gray-50">
        <Container>
          <div className="max-w-4xl mx-auto">

            {/* If no orderId provided show prompt / link to input form */}
            {!orderIdParam && (
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Track Your Order</h3>
                <p className="text-gray-600 mb-6">Enter your order ID and email to see the latest status.</p>
                <Link href="/track-order-input" className="inline-block bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg">
                  Enter Order Details
                </Link>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 text-center">
                <p className="text-gray-600">Loading order details...</p>
              </div>
            )}

            {/* Order Status Section */}
            {orderData && !loading && (
              <>
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
              </>
            )}

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
