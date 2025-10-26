"use client";
import React from "react";
import { Section } from "../../layout/Section";
import { Container } from "../../layout/Container";
import { Icon } from "@iconify/react";

const ServicesSection = () => {
  return (
    <Section className="bg-white py-16">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
