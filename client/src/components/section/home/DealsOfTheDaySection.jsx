"use client";
import React from "react";
import { Section } from "../../layout/Section";
import { Container } from "../../layout/Container";
import { SecondaryButton } from "@/src/components";
import Link from "next/link";
import Image from "next/image";
import { PlantGridCard } from "@/src/components";

// Helper function to format price with comma separators
const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Product data for deals of the day
const dealsProducts = [
  {
    id: 1,
    title: "Calathea plant",
    category: "Indoor Plant",
    currentPrice: 650,
    originalPrice: 975,
    discount: "50% off",
    rating: 4.8,
    image: "/images/plant.png"
  },
  {
    id: 2,
    title: "Sansevieria Trifasciata",
    category: "Indoor Plant",
    currentPrice: 650,
    originalPrice: 975,
    discount: "50% off",
    rating: 4.9,
    image: "/images/plant.png"
  },
  {
    id: 3,
    title: "Peace Lily Plant",
    category: "Indoor Plant",
    currentPrice: 650,
    originalPrice: 975,
    discount: "50% off",
    rating: 5.0,
    image: "/images/plant.png"
  },
  {
    id: 4,
    title: "Nephrolepis exaltata",
    category: "Indoor Plant",
    currentPrice: 650,
    originalPrice: 975,
    discount: "50% off",
    rating: 4.8,
    image: "/images/plant.png"
  },
  {
    id: 5,
    title: "Monstera deliciosa",
    category: "Indoor Plant",
    currentPrice: 650,
    originalPrice: 975,
    discount: "50% off",
    rating: 4.9,
    image: "/images/plant.png"
  },
  {
    id: 6,
    title: "Dieffenbachia Camille",
    category: "Indoor Plant",
    currentPrice: 650,
    originalPrice: 975,
    discount: "50% off",
    rating: 4.8,
    image: "/images/plant.png"
  }
];

const ProductCard = ({ product }) => {
  return (
    <PlantGridCard
      href={`/product/${product.title.toLowerCase().replace(/\s+/g, '-')}`}
      imageUrl={product.image}
      discountLabel={product.discount}
      category={product.category}
      rating={product.rating}
      title={product.title}
      price={formatPrice(product.currentPrice)}
      originalPrice={formatPrice(product.originalPrice)}
    />
  );
};

const DealsOfTheDaySection = () => {
  return (
    <Section className="bg-white py-12 md:py-16">
      <Container>
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-base text-black uppercase tracking-wide mb-2">Best Seller</p>
          <h2 className="text-4xl md:text-5xl font-semibold text-gray-900">
            Deals of the Day
          </h2>
        </div>

        {/* Main Content - Promotional Card + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Large Promotional Card */}
          <div className="lg:col-span-1">
            <div className="relative rounded-2xl overflow-hidden shadow-xl h-full min-h-[500px] md:min-h-[600px]">
              <Image
                src="/images/planterimg.jpg"
                alt="50% Off Deal"
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              
              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                {/* 50% Off Badge */}
                <div className="mb-4">
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">50% Off</div>
                  <div className="text-sm md:text-base text-white/90 font-medium">06 OCT - 16 OCT</div>
                </div>
                
                {/* Shop Now Button */}
                <SecondaryButton href="/shop">Shop Now</SecondaryButton>
              </div>
            </div>
          </div>

          {/* Right: Product Grid (6 cards) */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {dealsProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default DealsOfTheDaySection;

