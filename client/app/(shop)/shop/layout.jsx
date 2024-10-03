import { Diver, Filters, PageBanner } from "@/src/components";
import { Container } from "@/src/components/layout/Container";
import { Section } from "@/src/components/layout/Section";
import React from "react";

export const metadata = {
  title: "Plants | Plantozone",
  description:
    "Explore our extensive range of jewellery at Mukund Maid Jewellers, including rings, necklaces, and bracelets.",
};

const layout = ({ children }) => {
  return (
    <>
      <PageBanner />
      <div className="w-full h-[80px]">
        <Diver />
      </div>
      <Section>
        <Container className="flex justify-between items-start relative">
          <Filters />
          {children}
        </Container>
      </Section>
    </>
  );
};

export default layout;
