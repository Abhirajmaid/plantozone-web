"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

// Import required modules
import {
  FreeMode,
  Keyboard,
  Mousewheel,
  Autoplay,
  Pagination,
} from "swiper/modules";
import { SectionTitle, TestimonialCard } from "../..";
import { Section } from "../../layout/Section";

const data = [
  {
    name: "Emily R.",
    quote:
      "I’ve bought several plants from this site, and each one has arrived in perfect condition! The packaging is superb, and the plants are thriving in my living room. I especially love the variety of air-purifying plants they offer. Will definitely be ordering more!",
    image: "/images/plant.png",
  },
  {
    name: "John D.",
    quote:
      "Absolutely love the plants I received! They were well-packaged, and the delivery was fast. Highly recommend this store for plant lovers.",
    image: "/images/plant.png",
  },
  {
    name: "Sophia M.",
    quote:
      "Fantastic customer service and high-quality plants! I was worried about shipping, but the plants arrived healthy and beautiful.",
    image: "/images/plant.png",
  },
  {
    name: "Michael B.",
    quote:
      "I've bought from many online plant shops, but this one stands out. The quality, packaging, and variety are excellent!",
    image: "/images/plant.png",
  },
  {
    name: "Olivia W.",
    quote:
      "Such a wonderful experience! My plants are thriving, and I appreciate the self-watering pots included. Will definitely buy again!",
    image: "/images/plant.png",
  },
];

const TestimonialSwiper = () => {
  return (
    <Section>
      <div className="w-full flex justify-center px-5 ">
        <SectionTitle title="We Care About Our Customers" />
      </div>

      <div className="w-full max-w-6xl mx-auto py-12 md:mt-[50px] mt-[0]">
        <Swiper
          slidesPerView={1} // Mobile default
          spaceBetween={15}
          freeMode={true}
          pagination={{
            clickable: true,
          }}
          breakpoints={{
            640: { slidesPerView: 1 }, // Mobile
            768: { slidesPerView: 2 }, // Tablet
            1024: { slidesPerView: 3 }, // Desktop
          }}
          modules={[FreeMode, Keyboard, Mousewheel, Autoplay, Pagination]}
          autoplay={{
            delay: 3000, // Adjust delay as needed (3000ms = 3 seconds)
            disableOnInteraction: false, // Continue autoplay after interaction
          }}
          className="mySwiper h-auto w-full"
        >
          {data?.map((item, id) => (
            <SwiperSlide key={id} className="px-3">
              <TestimonialCard data={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </Section>
  );
};

export default TestimonialSwiper;
