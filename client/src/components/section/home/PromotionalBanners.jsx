"use client";
import React from "react";
import { Section } from "../../layout/Section";
import { Container } from "../../layout/Container";
import PromoBannerCard from "@/src/components/common/PromoBannerCard";

const PromotionalBanners = () => {
  const banners = [
    {
      id: 1,
      titlePrimary: "Freshly",
      titleSecondary: "Green Plants",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
      discountLabel: "Flat 20% Discount",
      image: "/images/plant1.png",
      bg: "bg-white",
      buttonVariant: "primary",
    },
    {
      id: 2,
      titlePrimary: "Graceful",
      titleSecondary: "Flower Plant",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
      discountLabel: "Flat 25% Discount",
      image: "/images/plant1.png",
      bg: "bg-secondary",
      buttonVariant: "secondary",
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
              size="large"
            />
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default PromotionalBanners;

