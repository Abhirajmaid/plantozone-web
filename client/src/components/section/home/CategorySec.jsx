"use client";
import React, { useState } from "react";
import { Container } from "../../layout/Container";
import { Section } from "../../layout/Section";
import { SectionTitle } from "../..";
import Link from "next/link";

// Sample data for category images (you can replace these with real image paths)
const categories = [
  {
    top: "top-0",
    name: "Air-Purifying Plants",
    url: "air-purifying-plants",
    image2: "/images/plant.png", // Replace with actual image URL
    image1: "/images/plant.png", // Replace with actual image URL
  },
  {
    top: "top-5",
    name: "Bonsai & Miniatures",
    url: "bonsai-miniature",
    image2: "/images/plant.png", // Replace with actual image URL
    image1: "/images/plant.png", // Replace with actual image URL
  },
  {
    top: "top-10",
    name: "Rare & Exotic Plants",
    url: "rare-exotic-plants",
    image2: "/images/plant.png", // Replace with actual image URL
    image1: "/images/plant.png", // Replace with actual image URL
  },
  {
    top: "top-14",
    name: "Flowering Plants",
    url: "flowering-plants",
    image2: "/images/plant.png", // Replace with actual image URL
    image1: "/images/plant.png", // Replace with actual image URL
  },
];

const CategorySec = () => {
  const [hoveredCategory, setHoveredCategory] = useState(null); // State to track hovered category

  return (
    <Section>
      <Container>
        <div className="w-full flex justify-center">
          <SectionTitle title="Shop by categories" />
        </div>
        <div className="mt-[50px] w-full gap-10 relative">
          {/* Categories list */}
          <div>
            {categories.map((item, id) => {
              return (
                <Link key={id} href={`/shop/${item.url}`}>
                  <div
                    onMouseEnter={() => setHoveredCategory(item)}
                    onMouseLeave={() => setHoveredCategory(null)}
                    className="text-title p-10 border-b border-mediumGray font-medium cursor-pointer hover:text-lightGreen"
                  >
                    {item.name}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Conditionally render image card */}
          {hoveredCategory && (
            <div
              className={`absolute ${hoveredCategory?.top} right-0 flex justify-center items-center`}
            >
              <img
                src={hoveredCategory.image1}
                alt={hoveredCategory.name}
                className="md:w-[470px] scale-[0.85] md:h-[550px] object-cover border-2 border-mediumGray -translate-y-[100px] origin-bottom-left rotate-[20deg] rounded-lg"
              />

              <img
                src={hoveredCategory.image2}
                alt={hoveredCategory.name}
                className="absolute w-[470px] scale-[0.85] border-mediumGray border-2 -left-[230px] h-[550px] object-cover rounded-lg"
              />
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
};

export default CategorySec;
