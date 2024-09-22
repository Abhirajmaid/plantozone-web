"use client";
import React, { useState } from "react";
import { Container } from "../layout/Container";
import { Section } from "../layout/Section";
import { SectionTitle } from "..";

// Sample data for category images (you can replace these with real image paths)
const categories = [
  {
    top: "top-0",
    name: "Air-Purifying Plants",
    image2: "/images/plant.png", // Replace with actual image URL
    image1: "/images/plant.png", // Replace with actual image URL
  },
  {
    top: "top-5",
    name: "Bonsai & Miniatures",
    image2: "/images/plant.png", // Replace with actual image URL
    image1: "/images/plant.png", // Replace with actual image URL
  },
  {
    top: "top-10",
    name: "Rare & Exotic Plants",
    image2: "/images/plant.png", // Replace with actual image URL
    image1: "/images/plant.png", // Replace with actual image URL
  },
  {
    top: "top-14",
    name: "Flowering Plants",
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
                <div
                  key={id}
                  onMouseEnter={() => setHoveredCategory(item)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  className="text-title p-10 border-b border-mediumGray font-semibold cursor-pointer hover:text-lightGreen"
                >
                  {item.name}
                </div>
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
                className="md:w-[470px]  md:h-[550px] object-cover border-2 border-mediumGray -translate-y-[100px] origin-bottom-left rotate-[20deg] rounded-lg"
              />

              <img
                src={hoveredCategory.image2}
                alt={hoveredCategory.name}
                className="absolute w-[470px] border-mediumGray border-2 -left-[230px] h-[550px] object-cover rounded-lg"
              />
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
};

export default CategorySec;
