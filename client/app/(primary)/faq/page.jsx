"use client";

import React, { useState } from "react";
import { Container } from "@/src/components/layout/Container";
import { Section } from "@/src/components/layout/Section";
import Link from "next/link";
import { Icon } from "@iconify/react";

// Hero Section with Breadcrumb (matches About Us page)
function FAQHero() {
  return (
    <div
      className="relative py-12 md:py-20 lg:py-24 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/breadcrumbbg.png')" }}
    >
      <div className="absolute inset-0 bg-white/70" />
      <Container>
        <div className="relative z-10 flex flex-col items-center text-center px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-3 md:mb-4">
            FAQ
          </h1>
          <div className="flex items-center gap-2 text-sm sm:text-base text-gray-600">
            <Link href="/" className="hover:text-green-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-800 font-medium">FAQ</span>
          </div>
        </div>
      </Container>
    </div>
  );
}

const faqData = [
  {
    id: "1",
    question: "How do I care for my new plant?",
    answer: "Place your plant in appropriate light as per the care instructions included with your order. Water when the top inch of soil feels dry, and avoid overwatering. Most indoor plants thrive in room temperature (18–24°C) with moderate humidity. Check the plant care guide on our website or contact us for specific advice.",
  },
  {
    id: "2",
    question: "Do you sell plant accessories like pots and soil?",
    answer: "Yes, we offer a range of pots, planters, soil mixes, and basic gardening tools. You can find them in our Shop under the relevant categories. If you need something specific, reach out to us at info@plantozone.com.",
  },
  {
    id: "3",
    question: "How are the plants packaged for shipping?",
    answer: "Plants are packed securely in eco-friendly materials to prevent damage during transit. We use sturdy boxes, cushioning, and appropriate wrapping so your plant arrives healthy. Fragile or large plants may have additional packaging. For details, see our Shipping & Delivery page.",
  },
  {
    id: "4",
    question: "What forms of payment do you accept?",
    answer: "We accept major credit/debit cards, UPI, net banking, and other payment methods available at checkout. All transactions are processed securely. You can also request a callback for cash on delivery (COD) where available.",
  },
  {
    id: "5",
    question: "How can I track my order?",
    answer: "After your order is shipped, you will receive a tracking link via email and SMS. You can also visit the Track Your Order page on our website and enter your order ID and registered phone number to see the current status.",
  },
  {
    id: "6",
    question: "What is your return or refund policy?",
    answer: "We want you to be happy with your purchase. If your plant arrives damaged or not as described, please contact us within 48 hours with photos. We offer replacement or refund as per our Cancellation & Refund Policy. See the dedicated page for full terms.",
  },
  {
    id: "7",
    question: "How long will it take for my plants to arrive?",
    answer: "Delivery times depend on your location and product availability. Typically, orders are delivered within 3–7 business days. You will see estimated delivery dates at checkout and in your order confirmation. For urgent or bulk orders, contact us for custom arrangements.",
  },
  {
    id: "8",
    question: "Do you deliver to my city?",
    answer: "We deliver across India. At checkout, enter your pincode to confirm serviceability. Some remote areas may have longer delivery times or additional charges. For any doubt, contact us before placing the order.",
  },
  {
    id: "9",
    question: "How can I get in touch for more help?",
    answer: "You can email us at info@plantozone.com, call +91 90591 52555 or +91 89994 92523, or use the Contact Us form on our website. We aim to respond within 24 hours on business days.",
  },
];

function FAQItem({ item, isOpen, onToggle }) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className={`w-full rounded-xl px-5 py-4 flex items-center justify-between transition-all duration-300 text-left ${
          isOpen ? "bg-green-600 text-white" : "bg-gray-100 text-gray-900 hover:bg-gray-200"
        }`}
        aria-expanded={isOpen}
      >
        <span className="font-medium text-sm md:text-base pr-4">{item.question}</span>
        <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
          {isOpen ? (
            <Icon icon="mdi:minus" className="w-5 h-5" />
          ) : (
            <Icon icon="mdi:plus" className="w-5 h-5" />
          )}
        </span>
      </button>
      {isOpen && (
        <div className="bg-green-700/10 border border-green-200 rounded-b-xl px-5 py-4 text-gray-700 text-sm md:text-base leading-relaxed">
          {item.answer}
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [openItem, setOpenItem] = useState("1");

  const handleToggle = (id) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-20">
      <FAQHero />
      <Section className="bg-white py-8 md:py-12 lg:py-16">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-green-800">Frequently Asked Questions</h2>
            <p className="text-gray-600 mb-8">
              Find quick answers to common questions about orders, shipping, plant care, and more.
            </p>

            <div className="space-y-4">
              {faqData.map((item) => (
                <FAQItem
                  key={item.id}
                  item={item}
                  isOpen={openItem === item.id}
                  onToggle={() => handleToggle(item.id)}
                />
              ))}
            </div>

            <div className="mt-10 p-6 bg-gray-50 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Still have questions?</h3>
              <p className="text-gray-600 text-sm mb-4">
                Our team is here to help. Reach out and we’ll get back to you as soon as possible.
              </p>
              <Link
                href="/contact-us"
                className="inline-flex items-center gap-2 text-green-600 font-medium hover:text-green-700 transition-colors"
              >
                <Icon icon="mdi:email-outline" className="w-5 h-5" />
                Contact Us
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
