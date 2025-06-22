"use client";
import { Container } from "@/src/components/layout/Container";

export default function ShippingDeliveryPage() {
  return (
    <Container className="py-12 max-w-3xl mx-auto pt-[170px]">
      <h1 className="text-3xl font-bold mb-6 text-green-700">
        Shipping and Delivery Policy
      </h1>
      <div className="space-y-4 text-gray-700 text-base">
        <h2 className="text-xl font-semibold mt-6">Shipping Process</h2>
        <p>
          We process and dispatch orders within 1-3 business days after payment
          confirmation. You will receive a tracking number once your order is
          shipped.
        </p>
        <h2 className="text-xl font-semibold mt-6">Delivery Timeline</h2>
        <p>
          Delivery usually takes 3-7 business days depending on your location.
          Delays may occur due to unforeseen circumstances.
        </p>
        <h2 className="text-xl font-semibold mt-6">Shipping Charges</h2>
        <p>
          We offer free shipping on all orders above ₹500. For orders below
          ₹500, a nominal shipping fee may apply.
        </p>
        <h2 className="text-xl font-semibold mt-6">Order Tracking</h2>
        <p>
          You can track your order status using the tracking number provided in
          your email or by logging into your account.
        </p>
        <h2 className="text-xl font-semibold mt-6">Contact Us</h2>
        <p>
          For any shipping or delivery related queries, please contact us at
          info@plantozone.com.
        </p>
      </div>
    </Container>
  );
}
