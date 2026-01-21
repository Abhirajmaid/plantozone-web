"use client";
import React from "react";
import { Section } from "../../layout/Section";
import { Container } from "../../layout/Container";
import PromoBannerCard from "@/src/components/common/PromoBannerCard";

const PromotionalBanners = () => {
  const banners = [
    {
      id: 1,
      titlePrimary: "Rare &",
      titleSecondary: "Exotic Plants",
      description: "Discover unique and rare plant species that will make your collection stand out. Perfect for plant enthusiasts seeking something extraordinary.",
      discountLabel: "Flat 20% Discount",
      image: "/images/image-Photoroom.png",
      bg: "bg-white",
      buttonVariant: "primary",
      href: "/shop/rare-&-exotic-plants",
    },
    {
      id: 2,
      titlePrimary: "Beautiful",
      titleSecondary: "Flowering Plants",
      description: "Add vibrant colors and natural beauty to your space with our stunning collection of flowering plants. Blooming with elegance and charm.",
      discountLabel: "Flat 25% Discount",
      image: "/images/image-Photoroom (1).png",
      bg: "bg-secondary",
      buttonVariant: "secondary",
      href: "/shop/flowering-plants",
    },
  ];

  return (
    <Section className="bg-white py-8 md:py-12">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center">
          {banners.map((b) => (
            <PromoBannerCard
              key={b.id}
              titlePrimary={b.titlePrimary}
              titleSecondary={b.titleSecondary}
              description={b.description}
              discountLabel={b.discountLabel}
              image={b.image}
              bg={b.bg}
              buttonVariant={b.buttonVariant}
              href={b.href}
              size="large"
            />
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default PromotionalBanners;

