"use client";
import React, { useState, useEffect } from "react";
import { Section } from "../../layout/Section";
import { Container } from "../../layout/Container";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Image from "next/image";

// Testimonial data
const testimonials = [
  {
    id: 1,
    title: "Gorgeous Plants!",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
    name: "Leslie Alexander",
    role: "Plant Lover",
    rating: 5.0,
    image: "/images/plant.png"
  },
  {
    id: 2,
    title: "Amazing Plants!",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
    name: "Leslie Alexander",
    role: "Plant Passionate",
    rating: 5.0,
    image: "/images/plant.png"
  },
  {
    id: 3,
    title: "Beautiful Plants!",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
    name: "Emily Johnson",
    role: "Plant Enthusiast",
    rating: 5.0,
    image: "/images/plant.png"
  }
];

const TestimonialCard = ({ testimonial }) => {
  return (
    <div className="bg-white rounded-xl p-6 md:p-8 shadow-lg h-full">
      {/* Rating */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="w-5 h-5 text-secondary fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="text-base font-medium text-gray-700">{testimonial.rating}</span>
      </div>

      {/* Review Title */}
      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
        {testimonial.title}
      </h3>

      {/* Review Text */}
      <div className="relative mb-6">
        <p className="text-sm md:text-base text-gray-500 leading-relaxed relative z-10">
          {testimonial.text}
        </p>
        {/* Large Quotation Mark in Background */}
        <div className="absolute top-0 left-0 text-8xl md:text-9xl text-gray-100 font-serif -z-0" style={{ lineHeight: '1' }}>
          "
        </div>
      </div>

      {/* Reviewer Info */}
      <div className="flex items-center gap-3 mt-6">
        <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={testimonial.image}
            alt={testimonial.name}
            fill
            sizes="48px"
            className="object-cover"
          />
        </div>
        <div>
          <div className="font-bold text-gray-900">{testimonial.name}</div>
          <div className="text-sm text-gray-500">{testimonial.role}</div>
        </div>
      </div>
    </div>
  );
};

const TestimonialsSection = () => {
  return (
    <Section className="bg-gray-100 py-12 md:py-16">
      <Container>
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-base text-black uppercase tracking-wide mb-2">Testimonial</p>
          <h2 className="text-4xl md:text-5xl font-semibold text-gray-900">
            What Our Clients Say
          </h2>
        </div>

        {/* Testimonial Carousel */}
        <div className="max-w-6xl mx-auto">
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
                slidesPerView: 2,
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
            className="testimonials-swiper"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <TestimonialCard testimonial={testimonial} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Custom Pagination Styles */}
        <style jsx global>{`
          .testimonials-swiper .swiper-pagination {
            position: relative;
            margin-top: 2rem;
          }
          .testimonials-swiper .swiper-pagination-bullet {
            width: 40px;
            height: 6px;
            border-radius: 3px;
            background: #e5e7eb;
            opacity: 1;
            transition: all 0.3s;
          }
          .testimonials-swiper .swiper-pagination-bullet-active {
            background: #0b9c09;
            width: 60px;
          }
        `}</style>
      </Container>
    </Section>
  );
};

export default TestimonialsSection;


