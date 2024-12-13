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
          <div className="w-full flex justify-center mb-14">
            <SectionTitle title="Why Us" />
          </div>
          <div className="flex w-full justify-between mx-auto">
            {whyUs.map((item, id) => {
              return (
                <div
                  className="flex flex-col gap-5 w-[30%] justify-center items-center"
                  key={id}
                >
                  <Icon icon={item.icon} className="w-16 h-16" />
                  <p className="text-3xl font-medium text-center">
                    {item.title}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </div>
    </Section>
  );
};

export default WhyUs;
