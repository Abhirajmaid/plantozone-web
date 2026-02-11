"use client";
import React from "react";
import { Section } from "../../layout/Section";
import { Icon } from "@iconify/react";
import { SectionTitle } from "../..";
import { Container } from "../../layout/Container";

const whyUs = [
  {
    icon: "lucide:recycle",
    title: "Secure and Recyclable Packaging",
  },
  {
    icon: "tabler:replace",
    title: "Free Replacements if Damaged",
  },
  {
    icon: "icon-park-outline:water",
    title: "Self-Watering Pots with Every Plant",
  },
];

const WhyUs = () => {
  return (
    <Section>
      <div
        className="py-12"
        style={{
          background:
            "radial-gradient(200px circle at 0% 0%, rgba(245,158,11,0.14), transparent 30%)," +
            "radial-gradient(200px circle at 100% 0%, rgba(245,158,11,0.12), transparent 30%)," +
            "radial-gradient(200px circle at 0% 100%, rgba(245,158,11,0.10), transparent 30%)," +
            "radial-gradient(220px circle at 100% 100%, rgba(245,158,11,0.12), transparent 30%)," +
            "#fff",
        }}
      >
        <Container>
          <div className="w-full flex justify-center mb-10 pt-4">
            <SectionTitle title="Why Us" />
          </div>

          {/* Modern Card Grid - Horizontal scroll on mobile, grid on larger screens */}
          <div 
            className="flex sm:grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 md:gap-10 w-full mx-auto px-2 md:px-0 overflow-x-auto sm:overflow-x-visible pb-4 sm:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {whyUs.map((item, id) => (
              <div
                key={id}
                className="flex flex-col items-center bg-white/90 rounded-2xl shadow-xl border border-lightGreen/20 p-6 sm:p-8 md:p-12 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 flex-shrink-0 w-[280px] sm:w-auto"
              >
                <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-lightGreen/10 mb-4 sm:mb-6 shadow-inner">
                  <Icon
                    icon={item.icon}
                    className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-lightGreen"
                  />
                </div>
                <p className="text-base sm:text-lg md:text-2xl font-semibold text-primary text-center">
                  {item.title}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </div>
    </Section>
  );
};

export default WhyUs;
