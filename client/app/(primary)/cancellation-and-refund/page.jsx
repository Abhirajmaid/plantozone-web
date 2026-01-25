"use client";
import { Container } from "@/src/components/layout/Container";

export default function CancellationRefundPage() {
  return (
    <Container className="py-12 max-w-3xl mx-auto pt-[170px]">
      <h1 className="text-3xl font-bold mb-6 text-green-700">
        Cancellation and Refund Policy
      </h1>
      <div className="space-y-4 text-gray-700 text-base">
        <h2 className="text-xl font-semibold mt-6">Order Cancellation</h2>
        <p>
          Orders can be cancelled before they are dispatched. To cancel your
          order, please contact us at info@plantozone.com or call +91 90591 52555, +91 89994 92523 as soon as possible.
        </p>
        <h2 className="text-xl font-semibold mt-6">Refund Policy</h2>
        <p>
          If you are not satisfied with your purchase, you may request a refund
          within 7 days of delivery. The product must be unused and in its
          original packaging.
        </p>
        <p>
          Refunds will be processed to your original payment method within 7-10
          business days after we receive and inspect the returned item.
        </p>
        <h2 className="text-xl font-semibold mt-6">Non-Refundable Items</h2>
        <p>
          Certain items such as perishable plants or customized products may not
          be eligible for refund. Please check product details before purchase.
        </p>
        <h2 className="text-xl font-semibold mt-6">Contact Us</h2>
        <p>
          For any questions or to initiate a cancellation or refund, please
          contact us at info@plantozone.com.
        </p>
      </div>
    </Container>
  );
}
