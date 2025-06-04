"use client";
import { Diver, PageBanner } from "@/src/components";
import { Container } from "@/src/components/layout/Container";
import { Section } from "@/src/components/layout/Section";
import React from "react";

const Layout = ({ children }) => {
  return (
    <>
      <PageBanner />
      <div className="w-full h-[80px]">
        <Diver />
      </div>
      <Section>
        <Container className="flex flex-col md:flex-row justify-between items-start gap-6">
          {/* Main Content */}
          <div className="w-full">{children}</div>
        </Container>
      </Section>
    </>
  );
};

export default Layout;
