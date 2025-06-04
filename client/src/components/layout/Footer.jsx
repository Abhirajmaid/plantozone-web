import { Icon } from "@iconify/react";
import Image from "next/image";
import { Container } from "./Container";
import Link from "next/link";

const aboutLinks = [
  { label: "Our Story", href: "/about" },
  { label: "Updates", href: "/updates" },
  { label: "Locate Stores", href: "/stores" },
];

const customerCareLinks = [
  { label: "Track Order", href: "/track-order" },
  { label: "Shipping Policy", href: "/shipping-policy" },
  { label: "Terms and Conditions", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
];

const navLinks = [
  { label: "Shop", href: "/shop" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-white py-10">
      <Container>
        <hr className="bg-black w-[80%] mx-auto h-[2px] mb-[50px]" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 px-4 sm:px-0 text-center md:text-left">
          {/* About Us */}
          <div>
            <h2 className="text-[16px] font-semibold text-gray-800">
              About Us
            </h2>
            <ul className="mt-4 text-[14px] space-y-3 text-gray-600">
              {aboutLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h2 className="text-[16px] font-semibold text-gray-800">
              Customer Care
            </h2>
            <ul className="mt-4 text-[14px] space-y-3 text-gray-600">
              {customerCareLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Nav Links */}
          <div>
            <h2 className="text-[16px] font-semibold text-gray-800">
              Navigation
            </h2>
            <ul className="mt-4 text-[14px] space-y-3 text-gray-600">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get in Touch */}
          <div>
            <h2 className="text-[16px] font-semibold text-gray-800">
              Get In Touch
            </h2>
            <p className="mt-4 text-[14px] text-gray-600">
              Call : +91 89994 92523
            </p>
            <p className="text-gray-600">Email : info@plantozone.com</p>
            <div className="mt-4 flex justify-center md:justify-start space-x-4 text-gray-600">
              <a href="#" aria-label="Facebook">
                <Icon icon="uiw:facebook" width="28" height="28" />
              </a>
              <a href="#" aria-label="Instagram">
                <Icon
                  icon="streamline:instagram-solid"
                  width="28"
                  height="28"
                />
              </a>
              <a href="#" aria-label="LinkedIn">
                <Icon icon="bi:linkedin" width="28" height="28" />
              </a>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="lg:col-span-2 flex flex-col items-center lg:flex-row lg:items-start gap-6">
            <Image
              width={300}
              height={400}
              className="w-auto h-[250px] sm:h-[300px] object-cover"
              alt="plantozone"
              src="/images/footer.png"
            />
            <div className="w-full max-w-sm">
              <h2 className="text-[18px] tracking-widest font-semibold text-gray-800">
                Sign up for our newsletter
              </h2>
              <p className="mt-4 text-[16px] text-gray-600">
                For plant care tips, our featured plant of the week, exclusive
                offers, and discounts.
              </p>
              <form className="mt-4 flex">
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="p-2 border border-gray-300 rounded-l-md w-full focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-[#0b9c09] text-white px-4 py-2 rounded-r-md"
                >
                  <Icon icon="ep:right" width={20} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
