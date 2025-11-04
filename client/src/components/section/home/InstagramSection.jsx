"use client";
import React from "react";
import { Section } from "../../layout/Section";
import { Container } from "../../layout/Container";
import Image from "next/image";
import { InfiniteCategoryMarquee } from "@/src/components";

// Instagram post images data
const instagramPosts = [
  { id: 1, image: "/images/plant.png", alt: "Plant care" },
  { id: 2, image: "/images/plant.png", alt: "Greenhouse" },
  { id: 3, image: "/images/plant.png", alt: "Potting plants" },
  { id: 4, image: "/images/plant.png", alt: "Ficus plant" },
  { id: 5, image: "/images/plant.png", alt: "Plant enthusiast" }, // Large center image
  { id: 6, image: "/images/plant.png", alt: "Nursery" },
  { id: 7, image: "/images/plant.png", alt: "Flowering plant" },
  { id: 8, image: "/images/plant.png", alt: "Plant care" },
  { id: 9, image: "/images/plant.png", alt: "Plant lover" }
];

const InstagramSection = () => {
  return (
    <>
    <Section className="bg-gray-100 py-12 md:py-16">
      <Container>
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <span className="text-sm md:text-base text-gray-500 mb-2 block font-medium">
            Follow Us
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
            Follow Us On <span className="text-primary">Instagram</span>
          </h2>
        </div>

        {/* Instagram Grid - Left 2x2, Center Large, Right 2x2 */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 md:gap-4 max-w-6xl mx-auto">
          {/* Left Side: 2x2 Grid (4 small images) */}
          <div className="col-span-2 grid grid-cols-2 gap-3 md:gap-4">
            {/* Top Left */}
            <div className="relative aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer group">
              <Image
                src={instagramPosts[0].image}
                alt={instagramPosts[0].alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            {/* Top Left - Second */}
            <div className="relative aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer group">
              <Image
                src={instagramPosts[1].image}
                alt={instagramPosts[1].alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            {/* Bottom Left */}
            <div className="relative aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer group">
              <Image
                src={instagramPosts[2].image}
                alt={instagramPosts[2].alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            {/* Bottom Left - Second */}
            <div className="relative aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer group">
              <Image
                src={instagramPosts[3].image}
                alt={instagramPosts[3].alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          </div>

          {/* Center: Large Image (spans 2 columns, 2 rows) */}
          <div className="col-span-2 row-span-2 relative aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer group">
            <Image
              src={instagramPosts[4].image}
              alt={instagramPosts[4].alt}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>

          {/* Right Side: 2x2 Grid (4 small images) */}
          <div className="col-span-2 grid grid-cols-2 gap-3 md:gap-4">
            {/* Top Right */}
            <div className="relative aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer group">
              <Image
                src={instagramPosts[5].image}
                alt={instagramPosts[5].alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            {/* Top Right - Second */}
            <div className="relative aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer group">
              <Image
                src={instagramPosts[6].image}
                alt={instagramPosts[6].alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            {/* Bottom Right */}
            <div className="relative aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer group">
              <Image
                src={instagramPosts[7].image}
                alt={instagramPosts[7].alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            {/* Bottom Right - Second */}
            <div className="relative aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer group">
              <Image
                src={instagramPosts[8].image}
                alt={instagramPosts[8].alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </Container>
    </Section>

    {/* Infinite Marquee at Bottom */}
    <InfiniteCategoryMarquee />
    </>
  );
};

export default InstagramSection;

