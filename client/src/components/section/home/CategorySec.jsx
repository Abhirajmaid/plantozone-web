"use client";
import React, { useState } from "react";
import { Container } from "../../layout/Container";
import { Section } from "../../layout/Section";
import { SectionTitle } from "../..";
import Link from "next/link";
import Image from "next/image";

const categories = [
  {
    top: "top-0",
    name: "Air-Purifying Plants",
    url: "air-purifying-plants",
    image2: "/images/plant.png",
    image1: "/images/plant.png",
  },
  {
    top: "top-5",
    name: "Bonsai & Miniatures",
    url: "bonsai-miniature",
    image2: "/images/plant.png",
    image1: "/images/plant.png",
  },
  {
    top: "top-10",
    name: "Rare & Exotic Plants",
    url: "rare-exotic-plants",
    image2: "/images/plant.png",
    image1: "/images/plant.png",
  },
  {
    top: "top-14",
    name: "Flowering Plants",
    url: "flowering-plants",
    image2: "/images/plant.png",
    image1: "/images/plant.png",
  },
];

const CategorySec = () => {
  const [hoveredCategory, setHoveredCategory] = useState(null);

  return (
    <Section>
      <Container>
        <div className="w-full flex justify-center">
          <SectionTitle title="Shop by categories" />
        </div>

        <div className="mt-10 w-full flex flex-col md:flex-row gap-10 relative">
          {/* Categories List */}
          <div className="w-full md:w-1/2">
            {categories.map((item, id) => (
              <Link key={id} href={`/shop/${item.url}`} passHref>
                <div
                  onMouseEnter={() => setHoveredCategory(item)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  className="md:text-title p-6 md:p-10 border-b border-mediumGray font-medium cursor-pointer text-primary hover:text-lightGreen text-[28px] "
                >
                  {item.name}
                </div>
              </Link>
            ))}
          </div>

          {/* Image Display - Shown on Hover for Larger Screens */}
          {hoveredCategory && (
            <div
              className={`hidden md:flex absolute ${hoveredCategory?.top} right-0 justify-center items-center`}
            >
              <Image
                src={hoveredCategory.image1}
                alt={hoveredCategory.name}
                width={350}
                height={450}
                className="w-full h-full object-cover border-2 border-mediumGray -translate-y-[80px] origin-bottom-left rotate-[15deg] rounded-lg"
              />
              <Image
                src={hoveredCategory.image2}
                alt={hoveredCategory.name}
                width={350}
                height={450}
                className="absolute w-full h-full border-mediumGray border-2 -left-[180px] object-cover rounded-lg"
              />
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
};

export default CategorySec;
