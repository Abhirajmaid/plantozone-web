"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

import { TestimonialCard } from "..";

const TestimonialSwiper = () => {
  return (
    <div className="w-full max-w-6xl mx-auto py-12">
      {/* <Swiper
        spaceBetween={30}
        slidesPerView={1}
        pagination={{ clickable: true }}
        loop={true}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        modules={[Pagination]} // Ensure Pagination module is registered
      >
        <SwiperSlide>
          <TestimonialCard
            name="Emily R."
            quote="I’ve bought several plants from this site, and each one has arrived in perfect condition! The packaging is superb, and the plants are thriving in my living room. I especially love the variety of air-purifying plants they offer. Will definitely be ordering more!"
            image="/images/plant.png" // replace with actual image path
          />
        </SwiperSlide>

        <SwiperSlide>
          <TestimonialCard
            name="Daniel M."
            quote="I’ve bought several plants from this site, and each one has arrived in perfect condition! The packaging is superb, and the plants are thriving in my living room. I especially love the variety of air-purifying plants they offer. Will definitely be ordering more!"
            image="/images/plant.png" // replace with actual image path
          />
        </SwiperSlide>

        <SwiperSlide>
          <TestimonialCard
            name="Emily R."
            quote="I’ve bought several plants from this site, and each one has arrived in perfect condition! The packaging is superb, and the plants are thriving in my living room. I especially love the variety of air-purifying plants they offer. Will definitely be ordering more!"
            image="/images/plant.png" // replace with actual image path
          />
        </SwiperSlide>
      </Swiper> */}
      <TestimonialCard
        name="Emily R."
        quote="I’ve bought several plants from this site, and each one has arrived in perfect condition! The packaging is superb, and the plants are thriving in my living room. I especially love the variety of air-purifying plants they offer. Will definitely be ordering more!"
        image="/images/plant.png"
      />
    </div>
  );
};

export default TestimonialSwiper;
