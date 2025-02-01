import { Container } from "@/src/components/layout/Container";
import { Section } from "@/src/components/layout/Section";
import { Mail, Phone } from "lucide-react";

export const metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Plantozone for inquiries, customer support, and questions about our plant offerings.",
  keywords:
    "contact plantozone, customer support, plant inquiries, contact page, garden questions, plant care support",
  author: "Plantozone",
  publisher: "Plantozone",
  robots: "index, follow",
  openGraph: {
    title: "Contact Us | Plantozone",
    description:
      "Reach out to Plantozone for customer support, inquiries about our plants, or to learn more about our services.",
    url: "https://www.plantozone.com/contact-us",
    site_name: "Plantozone",
    type: "website",
    images: [
      {
        url: "/images/contact-us-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Contact Us - Plantozone",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@plantozone",
    title: "Contact Us | Plantozone",
    description:
      "Have questions? Contact Plantozone for support, plant care help, and more.",
    image: "/images/contact-us-twitter-card.jpg",
  },
};

export default function page() {
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
                <p className="font-medium">Phone: +880161112222</p>
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
                <p className="font-medium">Emails: customer@exclusive.com</p>
                <p className="font-medium">Emails: support@exclusive.com</p>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <form className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Your Name *"
                className="w-full px-4 py-3 bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B9C09]"
                required
              />
              <input
                type="email"
                placeholder="Your Email *"
                className="w-full px-4 py-3 bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B9C09]"
                required
              />
              <input
                type="tel"
                placeholder="Your Phone *"
                className="w-full px-4 py-3 bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B9C09]"
                required
              />
            </div>
            <textarea
              placeholder="Your Message"
              rows={6}
              className="w-full px-4 py-3 bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B9C09]"
            ></textarea>
            <button
              type="submit"
              className="px-8 py-3 bg-[#0B9C09] text-white rounded-md hover:bg-[#098008] transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </Container>
    </Section>
  );
}
