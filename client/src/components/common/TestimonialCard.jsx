"use client";
import { Icon } from "@iconify/react";
import Image from "next/image";

const TestimonialCard = ({ data }) => {
  return (
    <div className="relative bg-white p-6 md:p-8 border border-mediumGray rounded-xl flex flex-col items-center gap-5 shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Quote Icon */}
      <Icon
        icon="icomoon-free:quotes-left"
        className="w-12 h-12 md:w-16 md:h-16 text-gray-400 opacity-40"
      />

      {/* User Image */}
      <div className="relative w-20 h-20 md:w-24 md:h-24">
        <Image
          src={data.image}
          alt="testimonial user"
          layout="fill"
          objectFit="cover"
          className="rounded-full border-2 border-mediumGray shadow"
        />
      </div>

      {/* Quote Text */}
      <p className="text-center text-gray-700 text-sm md:text-base leading-relaxed">
        "{data.quote}"
      </p>

      <hr className="w-10 border-gray-300" />

      {/* User Name */}
      <span className="font-semibold text-gray-800">{data.name}</span>
    </div>
  );
};

export default TestimonialCard;
