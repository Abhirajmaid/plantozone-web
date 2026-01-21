"use client";
import React from "react";
import Image from "next/image";
import { PrimaryButton, SecondaryButton } from "@/src/components";

const PromoBannerCard = ({
  titlePrimary = "Freshly Green",
  titleSecondary = "Plants",
  description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
  discountLabel = "Flat 20% Discount",
  image = "/images/plant1.png",
  href = "/shop",
  bg = "bg-white",
  buttonVariant = "primary",
  size = "large" // large | small
}) => {
  const isPrimary = buttonVariant === "primary";
  const CardButton = isPrimary ? PrimaryButton : SecondaryButton;
  const minHeight = size === "large" ? "min-h-[340px] md:min-h-[400px] lg:min-h-[440px]" : "min-h-[160px] md:min-h-[180px] lg:min-h-[200px]";
  const maxWidth = size === "large" ? "max-w-[750px]" : "max-w-[620px]"; // increased width for large banners

  return (
    <div className={`relative ${bg} rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ${maxWidth}`}>
      <div className={`relative p-6 md:p-8 lg:p-10 ${minHeight} flex items-center`}>
        {/* Right side image overlay */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 md:w-2/5 opacity-100">
          <Image src={image} alt={titlePrimary} fill sizes="(max-width: 768px) 50vw, 40vw" className="object-cover object-center" />
        </div>

        <div className="relative z-10 max-w-xl">
          <div className="bg-secondary text-gray-800 px-4 py-2 rounded-full text-sm font-bold w-fit mb-4">
            {discountLabel}
          </div>

          <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3 leading-tight">
            <span className="block">{titlePrimary}</span>
            <span className="block">{titleSecondary}</span>
          </h3>

          <p className="text-xs md:text-sm text-gray-600 mb-6 w-[60%]">
            {description}
          </p>

          <CardButton href={href}>Shop Now</CardButton>
        </div>
      </div>
    </div>
  );
};

export default PromoBannerCard;


