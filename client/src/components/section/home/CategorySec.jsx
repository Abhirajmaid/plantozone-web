"use client";
import React, { useEffect, useState } from "react";
import { Container } from "../../layout/Container";
import { Section } from "../../layout/Section";
import { SectionTitle } from "../..";
import Link from "next/link";
import Image from "next/image";

// Category banner items
const categoryBannerItems = [
  "Outdoor Plants",
  "Office Desk Plants", 
  "Pots & Accessories",
  "Gift Plants & Combos",
  "Care & Maintenance"
];

// Update categories to match the image you shared
const categories = [
  {
    name: "Indoor Plants",
    url: "indoor-plants",
    image: "/images/plant.png",
  },
  {
    name: "Outdoor Plants",
    url: "outdoor-plants",
    image: "/images/plant.png",
  },
  {
    name: "Office Desk Plants",
    url: "office-desk-plants",
    image: "/images/plant.png",
  },
  {
    name: "Pots & Accessories",
    url: "pots-accessories",
    image: "/images/accessories.jpg",
  },
  {
    name: "Gift Plants & Combos",
    url: "gift-plants-combos",
    image: "/images/plant.png",
  },
];

const CategorySec = () => {
  return (
    <>
      {/* Yellow Category Banner */}
      <div className="bg-yellow-400 py-4 overflow-hidden">
        <div className="flex items-center gap-8 animate-marquee">
          {[...categoryBannerItems, ...categoryBannerItems].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 text-gray-800 font-medium whitespace-nowrap">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              {item}
            </div>
          ))}
        </div>
      </div>

      <Section className="bg-white">
        <Container>
          <div className="w-full flex flex-col items-center mb-12">
            <span className="text-lg text-gray-500 mb-2 font-medium">
              Our Categories
            </span>
            <SectionTitle
              title={
                <>
                  Shop By <span className="text-green-600">Category</span>
                </>
              }
            />
          </div>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {categories.map((item, idx) => (
              <Link href={`/shop/${item.url}`} key={idx} className="group">
                <div className="flex flex-col items-center">
                  <div className="w-[200px] h-[200px] rounded-full overflow-hidden shadow-lg border-4 border-green-100 bg-white flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={200}
                      height={200}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <span className="text-base font-semibold text-gray-800 text-center group-hover:text-green-600 transition-colors duration-300">
                    {item.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </>
  );
};

export default CategorySec;
