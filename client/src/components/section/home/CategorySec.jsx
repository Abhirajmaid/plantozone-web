"use client";
import React, { useEffect, useState } from "react";
import { Container } from "../../layout/Container";
import { Section } from "../../layout/Section";
import Link from "next/link";
import { InfiniteCategoryMarquee } from "@/src/components";
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
      <InfiniteCategoryMarquee />

      <Section className="bg-white">
        <Container>
          <div className="text-center mb-12">
            <p className="text-base text-black uppercase tracking-wide mb-2">Our Categories</p>
            <h2 className="text-4xl md:text-5xl font-semibold text-gray-900">
              Shop By Category
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {categories.map((item, idx) => (
              <Link href={`/shop/${item.url}`} key={idx} className="group">
                <div className="flex flex-col items-center">
                  <div className="w-[180px] h-[180px] md:w-[200px] md:h-[200px] rounded-full overflow-hidden shadow-lg border-4 border-green-100 bg-white flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={200}
                      height={200}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <span className="text-sm md:text-base font-semibold text-gray-800 text-center group-hover:text-primary transition-colors duration-300">
                    {item.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <style jsx>{``}</style>
    </>
  );
};

export default CategorySec;
