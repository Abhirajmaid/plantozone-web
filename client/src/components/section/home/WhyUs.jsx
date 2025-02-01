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
      <div className="bg-secondary p-8 pb-14 bg-[url('/images/why-us-bg.png')] bg-cover bg-center">
        <Container>
          <div className="w-full flex justify-center mb-10">
            <SectionTitle title="Why Us" />
          </div>

          {/* Grid for better responsiveness */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10 w-full mx-auto text-center">
            {whyUs.map((item, id) => (
              <div
                key={id}
                className="flex flex-col gap-4 items-center text-white"
              >
                <Icon
                  icon={item.icon}
                  className="w-14 h-14 md:w-16 md:h-16 text-lightGreen"
                />
                <p className="text-lg md:text-2xl font-medium">{item.title}</p>
              </div>
            ))}
          </div>
        </Container>
      </div>
    </Section>
  );
};

export default WhyUs;
