"use client";
import { Section } from "../../layout/Section";
import { Container } from "../../layout/Container";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "../../ui/breadcrumb";
import Link from "next/link";

const PageBanner = ({ title = "Plants", showBreadcrumb = true }) => {
  return (
    <div className="pt-[88px]">
      <div 
        className="relative py-20 md:py-24 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/breadcrumbbg.png')" }}
      >
        <div className="absolute inset-0 bg-white/70"></div>
        <Container>
          <div className="relative z-10 flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              {title}
            </h1>
            {showBreadcrumb && (
              <div className="flex items-center gap-2 text-gray-600">
                <Link href="/" className="hover:text-green-600 transition-colors">
                  Home
                </Link>
                <span>/</span>
                <span className="text-gray-800 font-medium">{title}</span>
              </div>
            )}
          </div>
        </Container>
      </div>
    </div>
  );
};

export default PageBanner;
