"use client";
import React, { useEffect, useState, useRef } from "react";
import { Section } from "../../layout/Section";
import { Container } from "../../layout/Container";
import { PlantGridCard } from "@/src/components";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

// Helper function to format price with comma separators
const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Mock data for top seller products with countdown timers
const mockTopSellers = [
  {
    id: 1,
    title: "Monstera deliciosa",
    category: "Indoor Plant",
    currentPrice: 650,
    originalPrice: 1099,
    discount: "50% off",
    rating: 4.9,
    image: "/images/plant.png",
    countdown: { days: 5, hours: 12, minutes: 30, seconds: 25 }
  },
  {
    id: 2,
    title: "Watermelon Peperomia",
    category: "Indoor Plant",
    currentPrice: 850,
    originalPrice: 1499,
    discount: "20% off",
    rating: 4.9,
    image: "/images/plant.png",
    countdown: { days: 3, hours: 8, minutes: 45, seconds: 12 }
  },
  {
    id: 3,
    title: "Pepper Face Plant",
    category: "Indoor Plant",
    currentPrice: 650,
    originalPrice: 975,
    discount: "20% off",
    rating: 4.9,
    image: "/images/plant.png",
    countdown: { days: 2, hours: 6, minutes: 15, seconds: 8 }
  },
  {
    id: 4,
    title: "Bird's Nest Fern",
    category: "Indoor Plant",
    currentPrice: 750,
    originalPrice: 1299,
    discount: "20% off",
    rating: 4.9,
    image: "/images/plant.png",
    countdown: { days: 4, hours: 10, minutes: 20, seconds: 35 }
  }
];

// Using common PlantGridCard instead of a custom card

const TopSellerProducts = () => {
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
        <div className="text-center mb-12">
          <p className="text-base text-black uppercase tracking-wide mb-2">Our Products</p>
          <h2 className="text-4xl md:text-5xl font-semibold text-gray-900">
            Our Top Seller Products
            </h2>
        </div>

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
                slidesPerView: 3,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 24,
              },
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            loop={true}
            className="top-seller-swiper"
          >
            {mockTopSellers.map((product) => (
              <SwiperSlide key={product.id}>
                <div className="px-1">
                  <PlantGridCard
                    href={`/product/${product.title.toLowerCase().replace(/\s+/g, '-')}`}
                    imageUrl={product.image}
                    discountLabel={product.discount}
                    category={product.category}
                    rating={product.rating}
                    title={product.title}
                    price={formatPrice(product.currentPrice)}
                    originalPrice={formatPrice(product.originalPrice)}
                  />
                </div>
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

export default TopSellerProducts;
