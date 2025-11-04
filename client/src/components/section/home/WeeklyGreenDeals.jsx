"use client";
import React from "react";
import { Section } from "../../layout/Section";
import { Container } from "../../layout/Container";
import { PrimaryButton } from "@/src/components";
import Link from "next/link";
import Image from "next/image";

const WeeklyGreenDeals = () => {
  return (
    <Section className="bg-white py-8 md:py-12">
      <Container>
        {/* Grey Container with Minimal Height */}
        <div className="bg-gray-100 rounded-2xl relative overflow-hidden">
          {/* Subtle Leaf Pattern Background */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M50 10 C40 10, 30 15, 25 20 C20 25, 15 35, 15 45 C15 55, 20 65, 30 75 C35 80, 40 85, 50 90 C60 85, 65 80, 70 75 C80 65, 85 55, 85 45 C85 35, 80 25, 75 20 C70 15, 60 10, 50 10 Z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '80px 80px'
          }}></div>

          {/* Content inside grey container */}
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-6 lg:gap-8 p-6 md:p-8 lg:p-10">
            {/* Left Content - Text */}
            <div className="flex-1 w-full lg:w-1/2">
              <div className="text-left">
                {/* Subtitle */}
                <span className="text-sm md:text-base text-gray-500 mb-2 block font-medium">
                  Weekly Green Deals
                </span>
                
                {/* Main Heading */}
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
                  <span className="text-primary">Exclusive Discounts</span>{" "}
                  <span className="text-gray-900">on Must-Have Greens!</span>
                </h2>
                
                {/* Description */}
                <p className="text-sm md:text-base text-gray-500 mb-5 max-w-xl">
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                </p>
                
                {/* CTA Button */}
                <PrimaryButton href="/shop">Shop Now</PrimaryButton>
              </div>
            </div>

            {/* Right Content - Image */}
            <div className="flex-1 w-full lg:w-1/2">
              <div className="relative h-[250px] md:h-[300px] lg:h-[350px] rounded-xl overflow-hidden">
                <Image
                  src="/images/plant.png"
                  alt="Weekly Green Deals"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default WeeklyGreenDeals;

