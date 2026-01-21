"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { addToWishlist } from "@/src/lib/utils/wishlistUtils";
import { addToCart } from "@/src/lib/utils/cartUtils";
import { toast } from "react-toastify";

const DealCard = ({
  id,
  title,
  category = "Indoor Plant",
  currentPrice,
  originalPrice,
  discount,
  rating = 5.0,
  image,
  slug,
}) => {
  const handleAddToWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToWishlist({
      product: id,
      title: title,
      price: currentPrice,
      size: "Small",
      shape: "Round",
      quantity: 1,
      image: image,
    });
    toast.success("Added to wishlist!");
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      product: id,
      title: title,
      price: currentPrice,
      size: "Small",
      shape: "Round",
      quantity: 1,
      image: image,
    });
    toast.success("Added to cart!");
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <Link href={slug || `/product/${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 w-full flex h-[220px]">
        {/* Left Section - Image Area */}
        <div className="relative w-1/2 flex-shrink-0 h-[220px]">
          <Image
            src={image || "/images/plant.png"}
            alt={title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-contain object-center"
          />
          
          {/* Discount Badge - Top Left */}
          <div className="absolute top-4 left-4 bg-[#0b9c09] text-white px-3 py-1.5 rounded-full text-sm font-semibold">
            {discount || "30% off"}
          </div>

          {/* Interaction Icons - Right Side */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleAddToWishlist}
              className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-md border border-gray-200"
            >
              <Icon icon="mdi:heart-outline" className="w-5 h-5 text-gray-700" />
            </button>
            <button
              className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-md border border-gray-200"
            >
              <Icon icon="mdi:fullscreen" className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={handleAddToCart}
              className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-md border border-gray-200"
            >
              <Icon icon="mdi:cart-outline" className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Right Section - Product Information */}
        <div className="w-1/2 flex flex-col justify-center p-4 h-full overflow-hidden">
          {/* Category & Rating */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">{category}</span>
            <div className="flex items-center gap-1">
              <Icon icon="material-symbols:star" className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium text-gray-700">{rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {title}
          </h3>

          {/* Pricing */}
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl font-bold text-gray-900">₹{formatPrice(currentPrice)}</span>
            <span className="text-lg text-gray-400 line-through">₹{formatPrice(originalPrice)}</span>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-500 mb-2 line-clamp-2">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit
          </p>

          {/* Shop Now Button */}
          <div className="flex items-center text-[#0b9c09] font-medium text-sm hover:text-green-700 transition-colors cursor-pointer">
            <span>Shop Now</span>
            <Icon icon="mdi:arrow-right" className="w-5 h-5 ml-1" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DealCard;
