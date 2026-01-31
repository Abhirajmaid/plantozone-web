"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addToWishlist } from "@/src/lib/utils/wishlistUtils";
import { addToCart } from "@/src/lib/utils/cartUtils";
import { Dialog, DialogContent } from "../ui/dialog";

const PlantGridCard = ({
  id,
  href = "#",
  imageUrl = "/images/plant.png",
  discountLabel = "20% off",
  discountPercent,
  category = "Indoor Plant",
  rating = 4.9,
  title = "",
  price = 650,
  originalPrice = 975,
  onAddToCart,
}) => {
  const [showZoomModal, setShowZoomModal] = useState(false);
  const p = typeof discountPercent === "number" ? discountPercent : parseFloat(discountPercent);
  const showExtra = !isNaN(p) && p > 0;

  const priceNum = typeof price === "string" ? parseFloat(price.replace(/,/g, "")) : Number(price);
  const isExternalImage = String(imageUrl).startsWith("http");

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToWishlist({
      product: id ?? title,
      title: title,
      price: priceNum,
      size: "Small",
      shape: "Round",
      quantity: 1,
      image: imageUrl,
    });
    toast.success("Added to wishlist!", { position: "top-right" });
  };

  const handleZoomClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowZoomModal(true);
  };

  const handleAddToCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart();
    } else {
      addToCart({
        product: id ?? title,
        title: title,
        price: priceNum,
        size: "Small",
        shape: "Round",
        quantity: 1,
        image: imageUrl,
      });
      toast.success("Added to cart!", { position: "top-right" });
    }
  };

  return (
    <div className="w-full transition-shadow duration-300 overflow-hidden relative">
      {/* Discount Tags: 20% off (always) + extra when discount % set */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        <div className="bg-green-600 text-white px-2 py-1 rounded-md text-xs font-semibold">
          {discountLabel}
        </div>
        {showExtra && (
          <div className="bg-green-600 text-white px-2 py-1 rounded-md text-xs font-semibold">
            Extra {Math.round(p)}% off
          </div>
        )}
      </div>

      {/* Image Section - Full Width: clicking image opens product details */}
      <div className="relative group">
        <Link href={href} className="block cursor-pointer">
          <Image
            width={500}
            height={400}
            src={imageUrl}
            alt={title}
            className="w-full h-[300px] rounded-xl object-cover bg-gray-50"
          />
        </Link>
        
        {/* Hover Buttons - pointer-events-none on container so image link works; auto on buttons so they are clickable */}
        <div className="absolute top-3 right-3 z-20 flex flex-col space-y-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 pointer-events-none [&_button]:pointer-events-auto">
          {/* Wishlist Button */}
          <button
            type="button"
            onClick={handleAddToWishlist}
            className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-red-50 transition-colors"
            aria-label="Add to wishlist"
          >
            <Icon icon="material-symbols:favorite-outline" className="w-5 h-5 text-gray-600" />
          </button>
          
          {/* Zoom Button */}
          <button
            type="button"
            onClick={handleZoomClick}
            className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-50 transition-colors"
            aria-label="Zoom image"
          >
            <Icon icon="material-symbols:zoom-in" className="w-5 h-5 text-gray-600" />
          </button>
          
          {/* Cart Button */}
          <button
            type="button"
            onClick={handleAddToCartClick}
            className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-50 transition-colors"
            aria-label="Add to cart"
          >
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
              onClick={handleAddToCartClick}
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

      {/* Zoom Modal */}
      <Dialog open={showZoomModal} onOpenChange={setShowZoomModal}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-0 shadow-none">
          <div className="relative w-full max-h-[85vh] flex items-center justify-center">
            <Image
              width={800}
              height={600}
              src={imageUrl}
              alt={title}
              className="max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-lg"
              unoptimized={isExternalImage}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlantGridCard;
