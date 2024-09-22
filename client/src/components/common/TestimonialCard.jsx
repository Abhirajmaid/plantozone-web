"use client";
import { Icon } from "@iconify/react";
import Image from "next/image";

const TestimonialCard = ({ name, quote, image }) => {
  return (
    <div className="relative p-5 border-2 border-mediumGray rounded-lg flex flex-col gap-5 ">
      <Icon icon="oui:quote" />
      <Image
        src={image}
        alt="plantozone"
        width={200}
        height={200}
        className="w-20 h-20 left-8 -translate-y-1/2 rounded-full absolute top-0"
      />
      <p>{quote}</p>
      <hr />
      <span>{name}</span>
    </div>
  );
};

export default TestimonialCard;
