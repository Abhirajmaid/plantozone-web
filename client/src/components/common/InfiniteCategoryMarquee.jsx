import React from "react";
import Link from "next/link";
import { Section } from "@/src/components/layout/Section";
import { Icon } from "@iconify/react";

const categoryNavData = [
  { id: 1, name: "Indoor Plants" },
  { id: 2, name: "Outdoor Plants" },
  { id: 3, name: "Office Desk Plants" },
  { id: 4, name: "Pots & Accessories" },
  { id: 5, name: "Gift Plants & Combos" },
  { id: 6, name: "Air Purifying Plants" },
  { id: 7, name: "Flowering Plants" },
  { id: 8, name: "Herbs & Edibles" },
];

const InfiniteCategoryMarquee = () => {
  return (
    <Section className="bg-secondary !py-2 overflow-hidden">
      <Link href="/shop" className="block relative cursor-pointer group">
        {/* Gradient Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-20 bg-gradient-to-r from-secondary to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-20 bg-gradient-to-l from-secondary to-transparent z-10 pointer-events-none"></div>
        {/* Marquee Container */}
        <div className="flex gap-6 overflow-hidden px-4">
          {/* First Set */}
          <div className="flex items-center gap-6 sm:gap-8 animate-marquee whitespace-nowrap">
            {categoryNavData.map((category) => (
              <div
                key={category.id}
                className="flex items-center gap-3 sm:gap-4 text-gray-800 group-hover:text-green-700 transition-colors"
              >
                <Icon
                  icon="mdi:plant"
                  className="w-6 h-6 sm:w-8 sm:h-8 text-green-800 flex-shrink-0"
                />
                <span className="font-semibold text-sm sm:text-lg text-green-800">
                  {category.name}
                </span>
              </div>
            ))}
          </div>
          {/* Duplicate Set for Seamless Loop */}
          <div
            className="flex items-center gap-6 sm:gap-8 animate-marquee whitespace-nowrap"
            aria-hidden="true"
          >
            {categoryNavData.map((category) => (
              <div
                key={`duplicate-${category.id}`}
                className="flex items-center gap-3 sm:gap-4 text-gray-800 group-hover:text-green-700 transition-colors"
              >
                <Icon
                  icon="mdi:plant"
                  className="w-6 h-6 sm:w-8 sm:h-8 text-green-800 flex-shrink-0"
                />
                <span className="font-semibold text-sm sm:text-lg text-green-800">
                  {category.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Link>
    </Section>
  );
};

export default InfiniteCategoryMarquee;
