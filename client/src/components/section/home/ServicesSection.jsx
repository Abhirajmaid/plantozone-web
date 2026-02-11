"use client";
import React from "react";
import { Section } from "../../layout/Section";
import { Container } from "../../layout/Container";
import { Icon } from "@iconify/react";

const ServicesSection = () => {
  return (
    <Section className="bg-white py-16 overflow-visible">
      <Container>
        {/* Mobile: horizontal, compact */}
        <div className="flex md:hidden gap-4 overflow-x-auto py-2 -mx-4 px-4 snap-x snap-mandatory touch-pan-x">
          <div className="min-w-[220px] flex-shrink-0 flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm snap-start">
            <div className="relative flex-shrink-0">
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full"></div>
              <div className="relative z-10 w-10 h-10 flex items-center justify-center">
                <Icon icon="material-symbols:local-shipping-outline" className="w-6 h-6 text-green-700" />
              </div>
            </div>
            <div className="text-left">
              <h3 className="text-sm font-semibold text-gray-800">Free Shipping</h3>
              <p className="text-xs text-gray-600">Free shipping for order above ₹2000</p>
            </div>
          </div>

          <div className="min-w-[220px] flex-shrink-0 flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm snap-start">
            <div className="relative flex-shrink-0">
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full"></div>
              <div className="relative z-10 w-10 h-10 flex items-center justify-center">
                <Icon icon="material-symbols:account-balance-wallet-outline" className="w-6 h-6 text-green-700" />
              </div>
            </div>
            <div className="text-left">
              <h3 className="text-sm font-semibold text-gray-800">Flexible Payment</h3>
              <p className="text-xs text-gray-600">Multiple secure payment options</p>
            </div>
          </div>

          <div className="min-w-[220px] flex-shrink-0 flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm snap-start">
            <div className="relative flex-shrink-0">
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full"></div>
              <div className="relative z-10 w-10 h-10 flex items-center justify-center">
                <Icon icon="material-symbols:headphones" className="w-6 h-6 text-green-700" />
              </div>
            </div>
            <div className="text-left">
              <h3 className="text-sm font-semibold text-gray-800">24×7 Support</h3>
              <p className="text-xs text-gray-600">We support online all days.</p>
            </div>
          </div>
        </div>

        {/* Desktop / Tablet grid */}
        <div className="hidden md:grid grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center space-y-4">
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

          <div className="flex flex-col items-center text-center space-y-4">
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

          <div className="flex flex-col items-center text-center space-y-4">
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
      </Container>
    </Section>
  );
};

export default ServicesSection;
