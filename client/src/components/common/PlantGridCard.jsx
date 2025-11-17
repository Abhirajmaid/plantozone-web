"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";

const PlantGridCard = ({
  href = "#",
  imageUrl = "/images/plant.png",
  discountLabel = "20% off",
  category = "Indoor Plant",
  rating = 4.9,
  title = "",
  price = 650,
  originalPrice = 975,
  onAddToCart,
}) => {
  return (
    <div className="w-full transition-shadow duration-300 overflow-hidden relative">
      {/* Discount Tag */}
      <div className="absolute top-3 left-3 z-10">
        <div className="bg-green-600 text-white px-2 py-1 rounded-md text-xs font-semibold">
          {discountLabel}
        </div>
      </div>

      {/* Image Section - Full Width */}
      <div className="relative group">
        <Link href={href}>
          <Image
            width={500}
            height={400}
            src={imageUrl}
            alt={title}
            className="w-full h-[300px] rounded-xl object-cover bg-gray-50"
          />
        </Link>
        
        {/* Hover Buttons */}
        <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Heart Button */}
          <button className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-red-50 transition-colors">
            <Icon icon="material-symbols:favorite-outline" className="w-5 h-5 text-gray-600" />
          </button>
          
          {/* Enlarge Button */}
          <button className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-50 transition-colors">
            <Icon icon="material-symbols:zoom-in" className="w-5 h-5 text-gray-600" />
          </button>
          
          {/* Cart Button */}
          <button className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-50 transition-colors">
            <Icon icon="material-symbols:shopping-cart-outline" className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
      
      {/* Content Section with Gap */}
      <div className="p-4 space-y-2 pl-0">
        {/* Category and Rating */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">{category}</span>
          <div className="flex items-center space-x-1">
            <Icon icon="material-symbols:star" className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-gray-800">{rating}</span>
          </div>
        </div>

        {/* Plant Name and Price Together */}
        <div className="space-y-2">
          <Link href={href}>
            <h3 className="text-base font-semibold text-gray-800 line-clamp-2 hover:text-green-600 transition-colors">
              {title}
            </h3>
          </Link>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-base font-bold text-gray-900">₹{price}</span>
              <span className="text-sm text-gray-400 line-through">₹{originalPrice}</span>
            </div>
            <button
              type="button"
              onClick={onAddToCart}
              className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors"
              aria-label="Add to cart"
            >
              <Icon
                icon="icon-park-outline:shopping-cart-add"
                width="1.2em"
                height="1.2em"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantGridCard;
