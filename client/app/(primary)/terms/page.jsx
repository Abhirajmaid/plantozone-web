// filepath: d:\Work\WebFudge\Clients\Plantozone\plantozone-web\client\app\terms\page.jsx
"use client";
import { Container } from "@/src/components/layout/Container";

export default function TermsPage() {
  return (
    <Container className="py-12 max-w-3xl mx-auto pt-[170px]">
      <h1 className="text-3xl font-bold mb-6 text-green-700">
        Terms and Conditions
      </h1>
      <div className="space-y-4 text-gray-700 text-base">
        <p>
          By using the Plantozone website and services, you agree to the
          following terms and conditions. Please read them carefully.
        </p>
        <h2 className="text-xl font-semibold mt-6">Use of Website</h2>
        <p>
          You agree to use this website for lawful purposes only. You must not
          misuse our services or attempt to access them using unauthorized
          means.
        </p>
        <h2 className="text-xl font-semibold mt-6">Orders & Payments</h2>
        <p>
          All orders are subject to acceptance and availability. Payment must be
          made in full before dispatch. We reserve the right to refuse or cancel
          any order.
        </p>
        <h2 className="text-xl font-semibold mt-6">Intellectual Property</h2>
        <p>
          All content on this website, including images and text, is the
          property of Plantozone and may not be used without permission.
        </p>
        <h2 className="text-xl font-semibold mt-6">Limitation of Liability</h2>
        <p>
          Plantozone is not liable for any indirect or consequential loss or
          damage arising from the use of our website or products.
        </p>
        <h2 className="text-xl font-semibold mt-6">Changes to Terms</h2>
        <p>
          We reserve the right to update these terms at any time. Continued use
          of the website constitutes acceptance of the new terms.
        </p>
      </div>
    </Container>
  );
}
