"use client";
import React from "react";
import { Section } from "../../layout/Section";
import { Container } from "../../layout/Container";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import { PlantGridCard, SectionTitle } from "@/src/components";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

// Helper function to format price with comma separators
const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Mock data for deals of the day
const dealsData = [
  {
    id: 1,
    title: "Calathea Medallion",
    category: "Indoor Plant",
    currentPrice: 650,
    originalPrice: 975,
    discount: "30% off",
    rating: 5.0,
    image: "/images/plant.png",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit"
  },
  {
    id: 2,
    title: "Birds Nest",
    category: "Indoor Plant",
    currentPrice: 650,
    originalPrice: 975,
    discount: "50% off",
    rating: 5.0,
    image: "/images/plant.png",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit"
  },
  {
    id: 3,
    title: "Snake Plant",
    category: "Indoor Plant",
    currentPrice: 650,
    originalPrice: 975,
    discount: "50% off",
    rating: 5.0,
    image: "/images/plant.png",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit"
  },
  {
    id: 4,
    title: "ZZ Plant",
    category: "Indoor Plant",
    currentPrice: 650,
    originalPrice: 975,
    discount: "40% off",
    rating: 5.0,
    image: "/images/plant.png",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit"
  }
];

const DealCard = ({ deal }) => {
  return (
    <PlantGridCard
      href={`/product/${deal.title.toLowerCase().replace(/\s+/g, '-')}`}
      imageUrl={deal.image}
      discountLabel={deal.discount}
      category={deal.category}
      rating={deal.rating}
      title={deal.title}
      price={formatPrice(deal.currentPrice)}
      originalPrice={formatPrice(deal.originalPrice)}
    />
  );
};

const DealsOfTheDay = () => {
  const [swiper, setSwiper] = useState(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    if (swiper && swiper.params) {
      swiper.params.navigation.prevEl = prevRef.current;
      swiper.params.navigation.nextEl = nextRef.current;
      swiper.navigation.init();
      swiper.navigation.update();
    }
  }, [swiper]);

  return (
    <Section className="bg-white py-12 md:py-16">
      <Container>
        {/* Section Header */}
        <SectionTitle 
          subtitle="Today Deals"
          title="Deals of the Day"
          className="mb-12"
          subtitleClassName="text-black"
        />

        {/* Swiper Carousel */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Autoplay]}
            onSwiper={setSwiper}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 2,
                spaceBetween: 24,
              },
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            loop={true}
            className="deals-swiper"
          >
            {dealsData.map((deal) => (
              <SwiperSlide key={deal.id}>
                <DealCard deal={deal} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <button 
            ref={prevRef}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Previous"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            ref={nextRef}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Next"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </Container>
    </Section>
  );
};

export default DealsOfTheDay;

