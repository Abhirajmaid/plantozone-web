import React from "react";
import { Container } from "@/src/components/layout/Container";
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
  { id: 8, name: "Herbs & Edibles" }
];

const InfiniteCategoryMarquee = () => {
  return (
    <Section className="bg-secondary !py-4 overflow-hidden w-full max-w-full">
      <div className="relative w-full max-w-full overflow-hidden">
        {/* Gradient Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-12 md:w-20 bg-gradient-to-r from-secondary to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-12 md:w-20 bg-gradient-to-l from-secondary to-transparent z-10 pointer-events-none"></div>
        {/* Marquee Container */}
        <div className="flex gap-4 sm:gap-6 md:gap-8 overflow-hidden w-full max-w-full">
          {/* First Set */}
          <div className="flex items-center gap-4 sm:gap-6 md:gap-8 animate-marquee whitespace-nowrap">
            {categoryNavData.map((category) => (
              <div key={category.id} className="flex items-center gap-2 sm:gap-3 md:gap-4 text-gray-800 hover:text-green-700 transition-colors cursor-pointer flex-shrink-0">
                <Icon icon="mdi:plant" className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-green-800 flex-shrink-0" />
                <span className="font-semibold text-sm sm:text-base md:text-lg text-green-800">{category.name}</span>
              </div>
            ))}
          </div>
          {/* Duplicate Set for Seamless Loop */}
          <div className="flex items-center gap-4 sm:gap-6 md:gap-8 animate-marquee whitespace-nowrap" aria-hidden="true">
            {categoryNavData.map((category) => (
              <div key={`duplicate-${category.id}`} className="flex items-center gap-2 sm:gap-3 md:gap-4 text-gray-800 hover:text-green-700 transition-colors cursor-pointer flex-shrink-0">
                <Icon icon="mdi:plant" className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-green-800 flex-shrink-0" />
                <span className="font-semibold text-sm sm:text-base md:text-lg text-green-800">{category.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};

export default InfiniteCategoryMarquee;
