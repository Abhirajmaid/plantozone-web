"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";

// Import required modules
import { FreeMode, Keyboard, Mousewheel, Autoplay } from "swiper/modules";
import { SectionTitle, TestimonialCard } from "..";
import { Section } from "../layout/Section";

const data = [
  {
    name: "Emily R.",
    quote:
      "I’ve bought several plants from this site, and each one has arrived in perfect condition! The packaging is superb, and the plants are thriving in my living room. I especially love the variety of air-purifying plants they offer. Will definitely be ordering more!",
    image: "/images/plant.png",
  },
  {
    name: "Emily R.",
    quote:
      "I’ve bought several plants from this site, and each one has arrived in perfect condition! The packaging is superb, and the plants are thriving in my living room. I especially love the variety of air-purifying plants they offer. Will definitely be ordering more!",
    image: "/images/plant.png",
  },
  {
    name: "Emily R.",
    quote:
      "I’ve bought several plants from this site, and each one has arrived in perfect condition! The packaging is superb, and the plants are thriving in my living room. I especially love the variety of air-purifying plants they offer. Will definitely be ordering more!",
    image: "/images/plant.png",
  },
  {
    name: "Emily R.",
    quote:
      "I’ve bought several plants from this site, and each one has arrived in perfect condition! The packaging is superb, and the plants are thriving in my living room. I especially love the variety of air-purifying plants they offer. Will definitely be ordering more!",
    image: "/images/plant.png",
  },
  {
    name: "Emily R.",
    quote:
      "I’ve bought several plants from this site, and each one has arrived in perfect condition! The packaging is superb, and the plants are thriving in my living room. I especially love the variety of air-purifying plants they offer. Will definitely be ordering more!",
    image: "/images/plant.png",
  },
  {
    name: "Emily R.",
    quote:
      "I’ve bought several plants from this site, and each one has arrived in perfect condition! The packaging is superb, and the plants are thriving in my living room. I especially love the variety of air-purifying plants they offer. Will definitely be ordering more!",
    image: "/images/plant.png",
  },
];

const TestimonialSwiper = () => {
  return (
    <Section>
      <div className="w-full flex justify-center">
        <SectionTitle title="We Care About Our Customers" />
      </div>
      <div className="w-full max-w-6xl mx-auto py-12 overflow-hidden mt-[50px]">
        <Swiper
          slidesPerView={3} // Default for mobile
          spaceBetween={15}
          freeMode={false}
          modules={[FreeMode, Keyboard, Mousewheel, Autoplay]}
          autoplay={{
            delay: 3000, // Adjust delay as needed (3000ms = 3 seconds)
            disableOnInteraction: false, // Continue autoplay after interaction
          }}
          keyboard={false}
          mousewheel={false}
          className="mySwiper h-auto w-full !overflow-visible "
        >
          {data?.map((item, id) => {
            return (
              <SwiperSlide className="min-w-[370px]" key={id}>
                <TestimonialCard data={item} />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </Section>
  );
};

export default TestimonialSwiper;
