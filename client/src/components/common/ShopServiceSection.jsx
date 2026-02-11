"use client";
import { Icon } from "@iconify/react";
import React from "react";

const ShopServiceSection = ({ services = [] }) => {
  // Default services if none provided
  const defaultServices = [
    {
      icon: "material-symbols:local-shipping-outline",
      title: "Free Shipping",
      description: "Free shipping for order above ₹2000",
    },
    {
      icon: "material-symbols:account-balance-wallet-outline",
      title: "Flexible Payment",
      description: "Multiple secure payment options",
    },
    {
      icon: "material-symbols:headphones",
      title: "24×7 Support",
      description: "We support online all days.",
    },
  ];

  const serviceItems = services.length > 0 ? services : defaultServices;

  return (
    <>
      {/* Mobile: 3-column compact (visible at a glance) */}
      <div className="md:hidden grid grid-cols-3 gap-2 my-6 px-2">
        {serviceItems.map((service, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center p-2"
          >
            <div className="relative mb-1">
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full"></div>
              <div className="relative z-10 w-10 h-10 flex items-center justify-center mx-auto">
                <Icon icon={service.icon} className="w-6 h-6 text-green-700" />
              </div>
            </div>
            <h3 className="text-xs font-semibold text-gray-800">{service.title}</h3>
            <p className="text-[10px] text-gray-600 mt-0.5">{service.description}</p>
          </div>
        ))}
      </div>

      {/* Desktop / Tablet: original grid */}
      <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8 my-16 mb-28 justify-items-center">
        {serviceItems.map((service, index) => (
          <div key={index} className="flex items-center space-x-4 text-left">
            <div className="relative flex-shrink-0">
              <div className="absolute -bottom-1 -right-1 w-12 h-12 bg-yellow-400 rounded-full"></div>
              <div className="relative z-10 w-20 h-20 flex items-center justify-center">
                <Icon icon={service.icon} className="w-full h-full text-green-700" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">{service.title}</h3>
              <p className="text-sm text-gray-600">{service.description}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ShopServiceSection;
