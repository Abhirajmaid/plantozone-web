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
      <div className="bg-secondary py-12 bg-[url('/images/why-us-bg.png')] bg-cover bg-center">
        <Container>
          <div className="w-full flex justify-center mb-10 pt-4">
            <SectionTitle title="Why Us" />
          </div>

          {/* Modern Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10 w-full mx-auto px-2 md:px-0">
            {whyUs.map((item, id) => (
              <div
                key={id}
                className="flex flex-col items-center bg-white/90 rounded-2xl shadow-xl border border-lightGreen/20 p-8 md:p-12 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
              >
                <div className="flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-lightGreen/10 mb-6 shadow-inner">
                  <Icon
                    icon={item.icon}
                    className="w-12 h-12 md:w-16 md:h-16 text-lightGreen"
                  />
                </div>
                <p className="text-lg md:text-2xl font-semibold text-primary text-center">
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
