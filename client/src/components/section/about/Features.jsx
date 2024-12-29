import React from "react";
import { Section } from "../../layout/Section";
import { Container } from "../../layout/Container";
import { Headphones, Package, Shield, Tag } from "lucide-react";
import { SectionTitle } from "../..";

const features = [
  {
    icon: Package,
    title: "FAST SHIPPING",
    description:
      "Our dedicated fulfillment team allows us to get you what you need, when you need it.",
  },
  {
    icon: Tag,
    title: "THE BEST PRICES",
    description:
      "We bring you the lowest possible prices on thousands of tactical gear items.",
  },
  {
    icon: Shield,
    title: "100% SAFE SHOPPING",
    description:
      "Our ecommerce security and customer service is guaranteed for the best possible shopping experience.",
  },
  {
    icon: Headphones,
    title: "DEDICATED CUSTOMER SERVICE",
    description:
      "Got a question? Call or email us anytime and we will provide you with professional support.",
  },
];

const Features = () => {
  return (
    <Section className="bg-lightGray">
      <Container className="px-4">
        <div className="text-center">
          <SectionTitle title="Why Buy From Us" />
          <h3 className="mt-5 text-title font-semibold text-primary">
            PROVIDING THE ULTIMATE
            <br />
            CUSTOMER EXPERIENCE
          </h3>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="rounded-lg bg-white p-6 text-center shadow-lg"
              >
                <Icon className="mx-auto h-12 w-12 text-primary" />
                <h3 className="mt-4 font-playfair text-lg font-bold">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-darkGray">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
};

export default Features;
