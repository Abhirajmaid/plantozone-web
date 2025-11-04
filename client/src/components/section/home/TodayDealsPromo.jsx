"use client";
import React from "react";
import { Section } from "../../layout/Section";
import { Container } from "../../layout/Container";
import PromoBannerCard from "@/src/components/common/PromoBannerCard";

const TodayDealsPromo = () => {
  return (
    <Section className="bg-white py-8 md:py-12">
      <Container>
        <div className="text-center mb-8">
          <p className="text-base text-black uppercase tracking-wide mb-2">Today Deals</p>
          <h2 className="text-4xl md:text-5xl font-semibold text-gray-900">Deals of the Day</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center">
          <PromoBannerCard
            titlePrimary="Freshly"
            titleSecondary="Green Plants"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit"
            discountLabel="Flat 20% Discount"
            image="/images/plant1.png"
            bg="bg-white"
            buttonVariant="primary"
            size="small"
          />
          <PromoBannerCard
            titlePrimary="Graceful"
            titleSecondary="Flower Plant"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit"
            discountLabel="Flat 25% Discount"
            image="/images/plant1.png"
            bg="bg-secondary"
            buttonVariant="secondary"
            size="small"
          />
        </div>
      </Container>
    </Section>
  );
};

export default TodayDealsPromo;


