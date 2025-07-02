"use client";
import React from "react";
import { Container } from "../../layout/Container";
import { Section } from "../../layout/Section";
import { SectionTitle } from "../..";
import Link from "next/link";
import Image from "next/image";

// Update categories to match the image you shared
const categories = [
  {
    name: "Flowering",
    url: "flowering",
    image: "/images/plant.png", // Update image as needed
  },
  {
    name: "Air Purifying",
    url: "air-purifying",
    image: "/images/plant.png",
  },
  {
    name: "Ornamentals",
    url: "ornamentals",
    image: "/images/plant.png",
  },
  {
    name: "Pot Accessories",
    url: "pot-accessories",
    image: "/images/plant.png",
  },
];

const CategorySec = () => {
  return (
    <Section>
      <Container>
        <div className="w-full flex flex-col items-center mb-8">
          <span className="text-lg md:text-lg mb-1 font-medium">
            Our Categories
          </span>
          <SectionTitle
            title={
              <>
                Shop By <span className="text-lightGreen">Category</span>
              </>
            }
          />
        </div>
        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          {categories.map((item, idx) => (
            <Link key={idx} href={`/shop/${item.url}`} passHref>
              <div className="flex flex-col items-center group cursor-pointer">
                <div className="w-[120px] h-[120px] md:w-[250px] md:h-[250px] rounded-full overflow-hidden shadow-lg border-2 border-lightGreen/30 bg-white flex items-center justify-center mb-3 transition-transform duration-200 group-hover:scale-105">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={350}
                    height={350}
                    className="object-cover w-full h-full"
                  />
                </div>
                <span className="text-sm md:text-base font-semibold text-primary text-center">
                  {item.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default CategorySec;
