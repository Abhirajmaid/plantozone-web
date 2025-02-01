import { Diver, Filters, PageBanner } from "@/src/components";
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
          {/* Filters (Sticky on Desktop) */}
          <div className="w-full md:w-1/4">
            <div className="sticky top-[100px] max-h-[80vh] overflow-y-auto">
              <Filters />
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full md:w-3/4">{children}</div>
        </Container>
      </Section>
    </>
  );
};

export default Layout;
