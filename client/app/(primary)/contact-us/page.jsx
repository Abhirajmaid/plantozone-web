"use client";

import { useState } from "react";
import { Container } from "@/src/components/layout/Container";
import { Section } from "@/src/components/layout/Section";
import { Mail, Phone } from "lucide-react";

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
    <Section>
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
                <p className="font-medium">Emails: sales@plantozone.com</p>
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
  );
}
