"use client";
import { PageBanner } from "@/src/components";
import { Container } from "@/src/components/layout/Container";
import { Section } from "@/src/components/layout/Section";
import { Icon } from "@iconify/react";
import React from "react";

const Layout = ({ children }) => {
  return (
    <>
      <PageBanner title="Plants" showBreadcrumb={true} />
      <Section>
        <Container className="flex flex-col md:flex-row justify-between items-start gap-6">
          {/* Main Content */}
          <div className="w-full">{children}</div>
        </Container>
      </Section>

      {/* Services Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-16 mb-28 n
      nbvc  justify-items-center">
        <div className="flex items-center space-x-4 text-center">
          <div className="relative flex-shrink-0">
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-yellow-400 rounded-full"></div>
            <div className="relative z-10 w-12 h-12 flex items-center justify-center">
              <Icon icon="material-symbols:local-shipping-outline" className="w-8 h-8 text-green-700" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Free Shipping</h3>
            <p className="text-sm text-gray-600">Free shipping for order above ₹2000</p>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-center">
          <div className="relative flex-shrink-0">
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-yellow-400 rounded-full"></div>
            <div className="relative z-10 w-12 h-12 flex items-center justify-center">
              <Icon icon="material-symbols:account-balance-wallet-outline" className="w-8 h-8 text-green-700" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Flexible Payment</h3>
            <p className="text-sm text-gray-600">Multiple secure payment options</p>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-center">
          <div className="relative flex-shrink-0">
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-yellow-400 rounded-full"></div>
            <div className="relative z-10 w-12 h-12 flex items-center justify-center">
              <Icon icon="material-symbols:headphones" className="w-8 h-8 text-green-700" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">24×7 Support</h3>
            <p className="text-sm text-gray-600">We support online all days.</p>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-gray-100 py-16 mb-16 rounded-2xl mx-6">
        <div className="container mx-auto w-[90%] px-4">
          <div className="text-center">
            <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
              OUR NEWSLETTER
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Subscribe to Our Newsletter to Get Updates on Our Latest Offers
            </h2>
            <p className="text-gray-600 mb-8">
              Get 25% off on your first order just by subscribing to our newsletter
            </p>
            
            <form className="max-w-md mx-auto">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter Email Address"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
                <button
                  type="submit"
                  className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
