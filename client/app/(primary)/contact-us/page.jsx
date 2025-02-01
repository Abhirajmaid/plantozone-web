"use client";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { Container } from "@/src/components/layout/Container";
import { Section } from "@/src/components/layout/Section";
import { Mail, Phone } from "lucide-react";

export default function ContactPage() {
  const { register, handleSubmit, reset } = useForm();
  const [message, setMessage] = useState("");

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("/api/contact", data);
      if (response.data.success) {
        setMessage("Your message has been sent successfully!");
        reset();
      } else {
        setMessage("Failed to send message. Try again later.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error sending message. Please try again.");
    }
  };

  return (
    <Section>
      <Container className="pt-[100px]">
        <div className="container mx-auto px-4 py-12 grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
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

          {/* Contact Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <input
                {...register("name", { required: true })}
                type="text"
                placeholder="Your Name *"
                className="w-full px-4 py-3 bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B9C09]"
                required
              />
              <input
                {...register("email", { required: true })}
                type="email"
                placeholder="Your Email *"
                className="w-full px-4 py-3 bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B9C09]"
                required
              />
              <input
                {...register("phone", { required: true })}
                type="tel"
                placeholder="Your Phone *"
                className="w-full px-4 py-3 bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B9C09]"
                required
              />
            </div>
            <textarea
              {...register("message", { required: true })}
              placeholder="Your Message"
              rows={6}
              className="w-full px-4 py-3 bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B9C09]"
              required
            ></textarea>
            <button
              type="submit"
              className="px-8 py-3 bg-[#0B9C09] text-white rounded-md hover:bg-[#098008] transition-colors"
            >
              Send Message
            </button>
          </form>

          {/* Success Message */}
          {message && (
            <p className="text-green-600 font-medium text-center mt-4">
              {message}
            </p>
          )}
        </div>
      </Container>
    </Section>
  );
}
