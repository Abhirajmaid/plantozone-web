"use client";
import React from "react";
import Link from "next/link";

const BottomCategoryNav = () => {
  const categories = [
    "Outdoor Plants",
    "Office Desk Plants", 
    "Pots & Accessories",
    "Gift Plants & Combos",
    "Care & Maintenance"
  ];

  return (
    <div className="bg-yellow-400 py-4 overflow-hidden">
      <div className="flex items-center gap-8 animate-marquee">
        {[...categories, ...categories].map((category, idx) => (
          <Link 
            key={idx} 
            href={`/shop/${category.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`}
            className="flex items-center gap-2 text-gray-800 font-medium whitespace-nowrap hover:text-gray-600 transition-colors duration-300"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            {category}
          </Link>
        ))}
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default BottomCategoryNav;
