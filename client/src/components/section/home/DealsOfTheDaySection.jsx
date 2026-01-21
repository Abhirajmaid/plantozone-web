"use client";
import React from "react";
import { Section } from "../../layout/Section";
import { Container } from "../../layout/Container";
import { SectionTitle } from "@/src/components";
import DealCard from "@/src/components/common/DealCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

// Product data for deals of the day
const dealsProducts = [
  {
    id: 1,
    title: "Calathea Medallion",
    category: "Indoor Plant",
    currentPrice: 650,
    originalPrice: 975,
    discount: "30% off",
    rating: 5.0,
    image: "/images/plant.png"
  },
  {
    id: 2,
    title: "Birds Nest",
    category: "Indoor Plant",
    currentPrice: 650,
    originalPrice: 975,
    discount: "50% off",
    rating: 5.0,
    image: "/images/plant.png"
  },
  {
    id: 3,
    title: "Peace Lily Plant",
    category: "Indoor Plant",
    currentPrice: 650,
    originalPrice: 975,
    discount: "50% off",
    rating: 5.0,
    image: "/images/plant.png"
  },
  {
    id: 4,
    title: "Nephrolepis exaltata",
    category: "Indoor Plant",
    currentPrice: 650,
    originalPrice: 975,
    discount: "30% off",
    rating: 4.8,
    image: "/images/plant.png"
  },
  {
    id: 5,
    title: "Monstera deliciosa",
    category: "Indoor Plant",
    currentPrice: 650,
    originalPrice: 975,
    discount: "50% off",
    rating: 4.9,
    image: "/images/plant.png"
  },
  {
    id: 6,
    title: "Dieffenbachia Camille",
    category: "Indoor Plant",
    currentPrice: 650,
    originalPrice: 975,
    discount: "30% off",
    rating: 4.8,
    image: "/images/plant.png"
  }
];

const DealsOfTheDaySection = () => {
  return (
    <Section className="bg-gray-50 py-12 md:py-16">
      <Container>
        {/* Section Header */}
        <SectionTitle 
          subtitle="Today Deals"
          title="Deals of the Day"
          className="mb-12"
          titleClassName="text-[#0b9c09]"
        />

        {/* Carousel Container */}
        <div className="w-full mx-auto">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
            }}
            pagination={{
              clickable: true,
              bulletActiveClass: 'swiper-pagination-bullet-active',
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            loop={true}
            className="deals-swiper w-full"
          >
            {dealsProducts.map((product) => (
              <SwiperSlide key={product.id}>
                <div className="flex justify-center">
                  <DealCard
                    id={product.id}
                    title={product.title}
                    category={product.category}
                    currentPrice={product.currentPrice}
                    originalPrice={product.originalPrice}
                    discount={product.discount}
                    rating={product.rating}
                    image={product.image}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Custom Pagination Styles - Same as TestimonialsSection */}
        <style jsx global>{`
          .deals-swiper .swiper-pagination {
            position: relative;
            margin-top: 2rem;
          }
          .deals-swiper .swiper-pagination-bullet {
            width: 40px;
            height: 6px;
            border-radius: 3px;
            background: #e5e7eb;
            opacity: 1;
            transition: all 0.3s;
          }
          .deals-swiper .swiper-pagination-bullet-active {
            background: #0b9c09;
            width: 60px;
          }
        `}</style>
      </Container>
    </Section>
  );
};

export default DealsOfTheDaySection;
