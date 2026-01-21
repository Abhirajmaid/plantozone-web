"use client";
import { PageBanner, ShopServiceSection, NewsletterSection } from "@/src/components";
import { Container } from "@/src/components/layout/Container";
import { Section } from "@/src/components/layout/Section";
import React from "react";

const Layout = ({ children }) => {
  return (
    <>
      <PageBanner title="Plants" showBreadcrumb={true} />
      <Section>
        <Container className="flex flex-col md:flex-row justify-between items-start gap-6">
          {/* Main Content */}
          <div className="w-full">{children}</div>
        </Container>
      </Section>

      {/* Services Section */}
      <ShopServiceSection />

      {/* Newsletter Section */}
      <NewsletterSection />
    </>
  );
};

export default Layout;
