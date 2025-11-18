"use client";
import React from "react";
import Link from "next/link";
import Marquee from "react-fast-marquee";

const CategoryMarqueeNav = () => {
  const categories = [
    "Outdoor Plants",
    "Office Desk Plants", 
    "Pots & Accessories",
    "Gift Plants & Combos",
    "Care & Maintenance"
  ];

  return (
    <div className="bg-secondary py-4 overflow-hidden">
      <Marquee speed={50} gradient={false} className="flex items-center">
        {[...categories, ...categories, ...categories].map((category, idx) => (
          <Link 
            key={idx} 
            href={`/shop/${category.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`}
            className="flex items-center gap-2 text-gray-800 font-medium whitespace-nowrap hover:text-primary transition-colors duration-300 mx-8"
          >
            {/* Green Leaf Icon */}
            <svg className="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm-1.56 10.18l-3.48-3.48a.996.996 0 1 1 1.41-1.41l2.66 2.66 4.78-4.78a.996.996 0 1 1 1.41 1.41l-5.58 5.58a.996.996 0 0 1-1.41 0z"/>
            </svg>
            {category}
          </Link>
        ))}
      </Marquee>
    </div>
  );
};

export default CategoryMarqueeNav;

