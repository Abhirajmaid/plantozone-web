"use client";

import { useState } from "react";
import { Container } from "@/src/components/layout/Container";
import { Icon } from "@iconify/react";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ShopServiceSection, NewsletterSection } from "@/src/components";
import SecondaryButton from "@/src/components/common/SecondaryButton";

// Hero Section with Breadcrumb
function ContactHero() {
  return (
    <div 
      className="relative py-20 md:py-24 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/breadcrumbbg.png')" }}
    >
      <div className="absolute inset-0 bg-white/70"></div>
      <Container>
        <div className="relative z-10 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Contact Us
          </h1>
          <div className="flex items-center gap-2 text-gray-600">
            <Link href="/" className="hover:text-green-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-800 font-medium">Contact Us</span>
          </div>
        </div>
      </Container>
    </div>
  );
}

// Contact Info Cards
function ContactInfoCards() {
  const contactInfo = [
    {
      icon: "mdi:map-marker",
      iconColor: "text-yellow-400",
      bgColor: "bg-green-800",
      title: "Address",
      description: "5th floor, yellareddy guda, Secunderabad, Hyderabad, Telangana - 500016",
    },
    {
      icon: "mdi:phone",
      iconColor: "text-yellow-400",
      bgColor: "bg-green-800",
      title: "Phone",
      description: "+91 90591 52555, +91 89994 92523",
    },
    {
      icon: "mdi:email",
      iconColor: "text-yellow-400",
      bgColor: "bg-green-800",
      title: "Email",
      description: "info@plantozone.com",
    },
  ];

  return (
    <div className="py-16 bg-white">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {contactInfo.map((info, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl shadow-lg p-8 flex flex-col items-center text-center hover:shadow-xl transition-shadow"
            >
              <div className={`${info.bgColor} w-16 h-16 rounded-full flex items-center justify-center mb-4`}>
                <Icon icon={info.icon} className={`w-8 h-8 ${info.iconColor}`} />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {info.title}
              </h3>
              <p className="text-sm text-gray-600">{info.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

// Map Section
function MapSection() {
  const address = "5th floor, yellareddy guda, Secunderabad, Hyderabad, Telangana 500016";
  const encodedAddress = encodeURIComponent(address);
  
  return (
    <div className="relative w-full h-[400px] md:h-[500px] bg-gray-200">
      <div className="w-full h-full relative">
        <iframe
          src={`https://www.google.com/maps?q=${encodedAddress}&output=embed`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="grayscale"
        ></iframe>
        {/* Location Pin Overlay */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full">
          <div className="bg-green-800 w-14 h-14 rounded-full flex items-center justify-center shadow-lg">
            <Icon icon="mdi:map-marker" className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
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
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          subject: "",
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
    <div className="pt-[88px]">
      {/* Hero Section */}
      <ContactHero />

      {/* Contact Form Section */}
      <div className="py-16 bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left Column - Form */}
            <div className="w-full">
              {submitted ? (
                <div className="bg-green-100 text-green-800 p-8 rounded-lg text-center">
                  <h2 className="text-2xl font-semibold mb-4">Thank You!</h2>
                  <p>
                    We have received your message and will get back to you
                    shortly. Please check your email for a confirmation message.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-100 text-red-800 p-4 rounded-lg">
                      {error}
                    </div>
                  )}

                  {/* First Name & Last Name */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        placeholder="Ex. John"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Ex. Doe"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        placeholder="example@gmail.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-700 mb-2">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Enter Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      placeholder="Enter here..."
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Message */}
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-2">
                      Your Message *
                    </label>
                    <textarea
                      name="message"
                      placeholder="Enter here..."
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent resize-none"
                      required
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <SecondaryButton
                    type="submit"
                    withArrow={false}
                    className="px-8 py-3 disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send a Message"}
                  </SecondaryButton>
                </form>
              )}
            </div>

            {/* Right Column - Image */}
            <div className="relative w-full h-full min-h-[500px] lg:min-h-[600px]">
              <div className="relative w-full h-full rounded-2xl overflow-hidden">
                <Image
                  src="/images/plant.png"
                  alt="Contact us - Plantozone"
                  fill
                  className="object-cover"
                  priority
                />
                {/* Decorative Sparkles */}
                <div className="absolute bottom-6 right-6 text-yellow-400">
                  <Sparkles className="w-10 h-10 fill-yellow-400" />
                </div>
                <div className="absolute bottom-12 right-12 text-yellow-400">
                  <Sparkles className="w-6 h-6 fill-yellow-400" />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Contact Info Cards */}
      <ContactInfoCards />

      {/* Map Section */}
      <div className="mb-16">
        <MapSection />
      </div>

      {/* Services Section (3 Badge Strip) */}
      <div className="mb-16">
        <ShopServiceSection />
      </div>

      {/* Newsletter Section */}
      <div className="mb-16">
        <NewsletterSection />
      </div>
    </div>
  );
}
