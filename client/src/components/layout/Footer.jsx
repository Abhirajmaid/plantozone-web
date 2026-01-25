"use client";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { Container } from "./Container";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "../common/Logo";

const aboutLinks = [
  { label: "Our Story", href: "/about" },
  { label: "Updates", href: "/updates" },
  { label: "Locate Stores", href: "/stores" },
];

const customerCareLinks = [
  { label: "Track Order", href: "/track-order" },
  { label: "Shipping Policy", href: "/shipping-and-delivery" },
  { label: "Terms and Conditions", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy-policy" },
];

const navLinks = [
  { label: "Shop", href: "/shop" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const comingSoonLinks = ["/updates", "/stores", "/track-order"];

export default function Footer() {
  const router = useRouter();

  // Intercept click for "Coming Soon" links
  const handleLinkClick = (e, href) => {
    if (comingSoonLinks.includes(href)) {
      e.preventDefault();
      router.push("/coming-soon");
    }
  };

  return (
    <footer className="bg-primary text-white mx-6 mb-6 rounded-3xl shadow-2xl">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 py-8">
          {/* Brand Info */}
                 <div className="lg:col-span-1">
                   <div className="flex items-center mb-4">
                     <div className="w-8 h-8 mr-3 bg-white rounded-lg p-1">
                       <Logo />
                     </div>
                     <span className="text-xl font-bold text-white">Plantozone</span>
                   </div>
            <p className="text-gray-100 text-sm leading-relaxed mb-6">
              Your trusted destination for premium plants and gardening essentials. We bring nature closer to you with a wide selection of indoor plants, outdoor plants, and expert care guidance to help your green space thrive.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-100 hover:text-white transition-colors">
                <Icon icon="uiw:facebook" width="20" height="20" />
              </a>
              <a href="#" className="text-gray-100 hover:text-white transition-colors">
                <Icon icon="uiw:twitter" width="20" height="20" />
              </a>
              <a href="#" className="text-gray-100 hover:text-white transition-colors">
                <Icon icon="uiw:pinterest" width="20" height="20" />
              </a>
              <a href="#" className="text-gray-100 hover:text-white transition-colors">
                <Icon icon="streamline:instagram-solid" width="20" height="20" />
              </a>
              <a href="#" className="text-gray-100 hover:text-white transition-colors">
                <Icon icon="uiw:youtube" width="20" height="20" />
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about-us" className="text-gray-100 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/blog" className="text-gray-100 hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/contact-us" className="text-gray-100 hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/career" className="text-gray-100 hover:text-white transition-colors">Career</Link></li>
            </ul>
          </div>

          {/* Customer Services */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Customer Services</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/account" className="text-gray-100 hover:text-white transition-colors">My Account</Link></li>
              <li><Link href="/track-order" className="text-gray-100 hover:text-white transition-colors">Track Your Order</Link></li>
              <li><Link href="/return" className="text-gray-100 hover:text-white transition-colors">Return</Link></li>
              <li><Link href="/faq" className="text-gray-100 hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Our Information */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Our Information</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/privacy-policy" className="text-gray-100 hover:text-white transition-colors">Privacy</Link></li>
              <li><Link href="/terms" className="text-gray-100 hover:text-white transition-colors">User Terms & Condition</Link></li>
              <li><Link href="/cancellation-and-refund" className="text-gray-100 hover:text-white transition-colors">Return Policy</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Info</h3>
            <div className="space-y-3 text-sm text-gray-100">
              <p>Phone: +91 90591 52555, <br /> +91 89994 92523</p>
              <p>Email: info@plantozone.com</p>
              <p>Address: 5th floor, yellareddy guda, Secunderabad, Hyderabad, Telangana - 500016</p>
            </div>
          </div>
        </div>
        {/* Bottom Bar */}
        <div className="border-t border-green-500 py-6 rounded-b-3xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-200 mb-4 md:mb-0">
              Copyright © 2025 Plantozone. All Rights Reserved.
            </p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-300">Language:</span>
                <select className="bg-transparent text-white text-sm border-none focus:outline-none">
                  <option value="en">English</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-300">Currency:</span>
                <select className="bg-transparent text-white text-sm border-none focus:outline-none">
                  <option value="inr">INR</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
