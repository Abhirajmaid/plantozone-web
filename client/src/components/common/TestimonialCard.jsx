"use client";
import { Icon } from "@iconify/react";
import Image from "next/image";

const TestimonialCard = ({ data }) => {
  return (
    <div className="relative p-5 border-2 border-mediumGray rounded-lg flex flex-col gap-5 ">
      <Icon
        icon="icomoon-free:quotes-left"
        className="w-16 h-16 -mb-5 mt-5  opacity-40"
      />
      <Image
        src={data.image}
        alt="plantozone"
        width={200}
        height={200}
        className="w-20 h-20 left-14 -translate-y-1/2 rounded-full absolute top-0"
      />
      <p>{data.quote}</p>
      <hr />
      <span>{data.name}</span>
    </div>
  );
};

export default TestimonialCard;
