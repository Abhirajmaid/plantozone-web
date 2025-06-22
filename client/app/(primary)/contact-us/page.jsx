"use client";

import { useState } from "react";
import { Container } from "@/src/components/layout/Container";
import { Section } from "@/src/components/layout/Section";
import { Mail, Phone } from "lucide-react";
import InfiniteMarquee from "@/src/components/section/home/InfiniteMarquee";
import Link from "next/link";

const faqs = [
  {
    question: "How can I track my order?",
    answer:
      "You will receive a tracking link via email after your order is shipped. You can also contact our support for updates.",
  },
  {
    question: "Do you deliver plants outside India?",
    answer: "Currently, we deliver to 50+ cities across India only.",
  },
  {
    question: "How do I care for my new plant?",
    answer:
      "Each plant comes with care instructions. You can also find tips on our blog or contact us for guidance.",
  },
  {
    question: "Can I customize my order?",
    answer:
      "Yes, for bulk or custom orders, please contact us directly and our team will assist you.",
  },
];

function ContactHero() {
  return (
    <div className="relative bg-lightGreen/10 py-16 md:py-24 mb-12">
      <Container>
        <div className="flex flex-col items-center text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-primary mb-4">
            Contact Us
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto text-lg mb-6">
            Have a question, feedback, or need help? Our team is here to assist
            you. Reach out and we’ll get back to you within 24 hours.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-lightGreen text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-green-700 transition"
          >
            Shop Now
          </Link>
        </div>
      </Container>
      <div
        className="absolute inset-0 pointer-events-none select-none"
        aria-hidden="true"
      />
    </div>
  );
}

function FAQSection() {
  return (
    <Section className="bg-white py-12 md:py-20">
      <Container>
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8 text-center">
          Frequently Asked Questions
        </h2>
        <div className="max-w-2xl mx-auto divide-y divide-lightGreen/20 rounded-2xl bg-lightGreen/5 shadow-lg">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="py-6 px-4 md:px-8 flex flex-col gap-2 transition hover:bg-lightGreen/10"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center justify-center bg-lightGreen/10 text-lightGreen font-bold w-8 h-8 rounded-full">
                  Q
                </span>
                <span className="font-semibold text-primary text-base md:text-lg">
                  {faq.question}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="inline-flex items-center justify-center bg-lightGreen/10 text-lightGreen font-bold w-8 h-8 rounded-full">
                  A
                </span>
                <span className="text-gray-700 text-base">{faq.answer}</span>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

export default function Page() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    _autoresponse:
      "Thank you for contacting us! We have received your message and will get back to you within 24 hours. \n\nBest regards,\nPlantozone Team",
    _template: "table",
    _subject: "Thank you for contacting Plantozone!",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    // Only update user-editable fields
    if (!e.target.name.startsWith("_")) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://formsubmit.co/ajax/plantozonegreenindia@gmail.com",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
          _autoresponse:
            "Thank you for contacting us! We have received your message and will get back to you within 24 hours. \n\nBest regards,\nPlantozone Team",
          _template: "table",
          _subject: "Thank you for contacting Plantozone!",
        });
      } else {
        throw new Error("Form submission failed");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Section>
        <ContactHero />
        <InfiniteMarquee txt="PLANTOZONE" deg="0" />
        <Container className="pt-[100px]">
          <div className="container mx-auto px-4 py-12 grid md:grid-cols-2 gap-12">
            {/* Left Column - Contact Information */}
            <div className="space-y-8">
              {/* Call To Us Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-[#0B9C09] p-3 rounded-full">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">Call To Us</h3>
                </div>
                <div className="space-y-1 pl-14">
                  <p className="text-gray-600">
                    We are available 24/7, 7 days a week.
                  </p>
                  <p className="font-medium">
                    Phone: <br />
                    +91 9059152555 <br /> +91 9059152666
                  </p>
                </div>
              </div>

              {/* Write To Us Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-[#0B9C09] p-3 rounded-full">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">Write To Us</h3>
                </div>
                <div className="space-y-1 pl-14">
                  <p className="text-gray-600">
                    Fill out our form and we will contact you within 24 hours.
                  </p>
                  <p className="font-medium">Emails: info@plantozone.com</p>
                  <p className="font-medium">
                    Emails: plantozone.sales@gmail.com
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div className="w-full">
              {submitted ? (
                <div className="bg-green-100 text-green-800 p-6 rounded-md text-center">
                  <h2 className="text-2xl font-semibold">Thank You!</h2>
                  <p>
                    We have received your message and will get back to you
                    shortly. Please check your email for a confirmation message.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="bg-red-100 text-red-800 p-4 rounded-md">
                      {error}
                    </div>
                  )}
                  <div className="grid md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name *"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B9C09]"
                      required
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Your Email *"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B9C09]"
                      required
                    />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Your Phone *"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B9C09]"
                      required
                    />
                  </div>
                  <textarea
                    name="message"
                    placeholder="Your Message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B9C09]"
                    required
                  ></textarea>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-[#0B9C09] text-white rounded-md hover:bg-[#098008] transition-colors disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </Container>
      </Section>
      <FAQSection />
      <InfiniteMarquee txt="PLANTOZONE" deg="0" />
    </>
  );
}
