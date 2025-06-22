"use client";
import { Container } from "@/src/components/layout/Container";

export default function PrivacyPolicyPage() {
  return (
    <Container className="py-12 max-w-3xl mx-auto pt-[170px]">
      <h1 className="text-3xl font-bold mb-6 text-green-700">Privacy Policy</h1>
      <div className="space-y-4 text-gray-700 text-base">
        <p>
          At Plantozone, we value your privacy and are committed to protecting
          your personal information. This Privacy Policy explains how we
          collect, use, and safeguard your data when you use our website and
          services.
        </p>
        <h2 className="text-xl font-semibold mt-6">Information Collection</h2>
        <p>
          We collect information you provide directly to us, such as when you
          create an account, place an order, or contact us. This may include
          your name, email, phone number, address, and payment details.
        </p>
        <h2 className="text-xl font-semibold mt-6">Use of Information</h2>
        <p>
          We use your information to process orders, provide customer support,
          improve our services, and send you updates or promotional offers (if
          you opt-in).
        </p>
        <h2 className="text-xl font-semibold mt-6">Data Security</h2>
        <p>
          We implement industry-standard security measures to protect your data.
          However, no method of transmission over the Internet is 100% secure.
        </p>
        <h2 className="text-xl font-semibold mt-6">Third-Party Services</h2>
        <p>
          We may share your information with trusted third parties for payment
          processing and delivery. We do not sell your personal information.
        </p>
        <h2 className="text-xl font-semibold mt-6">Your Rights</h2>
        <p>
          You may access, update, or request deletion of your personal
          information by contacting us at info@plantozone.com.
        </p>
        <p>
          For any questions regarding this policy, please contact us at
          info@plantozone.com.
        </p>
      </div>
    </Container>
  );
}
