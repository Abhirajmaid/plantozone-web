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

// Updated testimonial data with more variety
const data = [
  {
    name: "Emily R.",
    quote:
      "I’ve bought several plants from Plantozone, and each one has arrived in perfect condition! The packaging is superb, and the plants are thriving in my living room. I especially love the variety of air-purifying plants they offer. Will definitely be ordering more!",
    image:
      "https://images.unsplash.com/vector-1748337762173-ee7f7f3c098e?q=80&w=2360&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Bangalore",
    rating: 5,
  },
  {
    name: "John D.",
    quote:
      "Absolutely love the plants I received! They were well-packaged, and the delivery was fast. Highly recommend this store for plant lovers.",
    image:
      "https://images.unsplash.com/vector-1748337762173-ee7f7f3c098e?q=80&w=2360&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Mumbai",
    rating: 4,
  },
  {
    name: "Sophia M.",
    quote:
      "Fantastic customer service and high-quality plants! I was worried about shipping, but the plants arrived healthy and beautiful.",
    image:
      "https://images.unsplash.com/vector-1748337762173-ee7f7f3c098e?q=80&w=2360&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Delhi",
    rating: 5,
  },
  {
    name: "Michael B.",
    quote:
      "I've bought from many online plant shops, but this one stands out. The quality, packaging, and variety are excellent!",
    image:
      "https://images.unsplash.com/vector-1748337762173-ee7f7f3c098e?q=80&w=2360&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Hyderabad",
    rating: 5,
  },
  {
    name: "Olivia W.",
    quote:
      "Such a wonderful experience! My plants are thriving, and I appreciate the self-watering pots included. Will definitely buy again!",
    image:
      "https://images.unsplash.com/vector-1748337762173-ee7f7f3c098e?q=80&w=2360&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Chennai",
    rating: 4,
  },
  {
    name: "Amit S.",
    quote:
      "The best online plant store! The plants are lush and healthy, and the support team is very responsive.",
    image:
      "https://images.unsplash.com/vector-1748337762173-ee7f7f3c098e?q=80&w=2360&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Pune",
    rating: 5,
  },
  {
    name: "Priya K.",
    quote:
      "Loved the eco-friendly packaging and the care instructions. My balcony looks amazing now!",
    image:
      "https://images.unsplash.com/vector-1748337762173-ee7f7f3c098e?q=80&w=2360&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    location: "Kolkata",
    rating: 5,
  },
];

const TestimonialSwiper = () => {
  return (
    <Section className={"bg-lightGray py-12 md:py-20"}>
      <div className="w-full flex flex-col items-center px-5 ">
        <SectionTitle title="We Care About Our Customers" />
        <p className="text-gray-600 text-center max-w-2xl mt-2 mb-8">
          Hear from our happy customers who have transformed their spaces with
          Plantozone's healthy, beautiful plants and exceptional service.
        </p>
      </div>

      <div className="w-full max-w-7xl mx-auto py-12 md:mt-[50px] mt-[0]">
        <Swiper
          slidesPerView={1}
          spaceBetween={30}
          freeMode={true}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          modules={[FreeMode, Keyboard, Mousewheel, Autoplay, Pagination]}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          className="mySwiper h-auto w-full"
        >
          {data?.map((item, id) => (
            <SwiperSlide key={id} className="px-3">
              <div className="bg-white rounded-2xl shadow-xl border border-lightGreen/20 p-8 flex flex-col items-center h-[410px] transition-all duration-300 hover:shadow-2xl">
                <img
                  src={
                    item.image ||
                    "https://images.unsplash.com/vector-1748337762173-ee7f7f3c098e?q=80&w=2360&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  }
                  alt={item.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-lightGreen mb-4 shadow"
                />
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(item.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">
                      ★
                    </span>
                  ))}
                  {[...Array(5 - item.rating)].map((_, i) => (
                    <span key={i} className="text-gray-300 text-lg">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-gray-700 text-base text-center mb-4 italic">
                  "{item.quote}"
                </p>
                <div className="font-semibold text-primary">{item.name}</div>
                <div className="text-xs text-lightGreen font-medium">
                  {item.location}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </Section>
  );
};

export default TestimonialSwiper;
