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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-16 mb-28 justify-items-center">
      {serviceItems.map((service, index) => (
        <div key={index} className="flex items-center space-x-4 text-center">
          <div className="relative flex-shrink-0">
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-yellow-400 rounded-full"></div>
            <div className="relative z-10 w-12 h-12 flex items-center justify-center">
              <Icon icon={service.icon} className="w-16 h-16 text-green-700" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">{service.title}</h3>
            <p className="text-sm text-gray-600">{service.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShopServiceSection;


