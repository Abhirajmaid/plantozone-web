"use client";
import React, { useState, useRef } from "react";
import { Button } from "../ui/button";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SIZES = ["6 Inch", "8 Inch"];
const SHAPES = ["Hex", "Round"];

const ProductCard = ({ data, onAddToCart }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedSize, setSelectedSize] = useState("6 Inch");
  const [selectedShape, setSelectedShape] = useState("");
  const addBtnRef = useRef(null);

  const handleAddToCartClick = () => {
    setShowPopup(true);
  };

  const handleConfirm = () => {
    if (!selectedSize || !selectedShape) {
      toast.error("Please select size and shape.", { position: "top-right" });
      return;
    }
    const price = selectedSize === "8 Inch" ? 850 : 650;
    if (onAddToCart) {
      onAddToCart({
        size: selectedSize,
        shape: selectedShape,
        price: price,
      });
    }
    setShowPopup(false);
    setSelectedSize("");
    setSelectedShape("");
    toast.success("Product added to cart!", {
      position: "top-right",
      autoClose: 2000,
      icon: <Icon icon="mdi:check-circle" width="1.5em" height="1.5em" />,
    });
  };

  const handleCancel = () => {
    setShowPopup(false);
    setSelectedSize("");
    setSelectedShape("");
  };

  const imgArr = data?.attributes?.images?.data;
  const imgUrl =
    imgArr && imgArr[0]?.attributes?.url
      ? imgArr[0].attributes.url
      : "/images/default-featured-image.png.jpg";

  // Price logic
  const getPrice = () => {
    if (selectedSize === "8 Inch") return 850;
    return 650;
  };

  // Position popup absolutely near the Add to Cart button
  return (
    <div className="w-full bg-white transition-shadow duration-300 overflow-hidden relative">
      {/* Discount Tag */}
      <div className="absolute top-3 left-3 z-10">
        <div className="bg-green-600 text-white px-2 py-1 rounded-md text-xs font-semibold">
          20% off
        </div>
      </div>
      {/* Popup for size and shape selection */}
      {showPopup && (
        <div className="absolute z-50 right-0 top-0 bg-white border border-green-600 shadow-2xl rounded-xl p-5 min-w-[230px]">
          <div className="mb-3">
            <div className="font-semibold mb-2 text-green-700 text-sm tracking-wide uppercase">
              Select Size
            </div>
            <div className="flex gap-3">
              {SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded-lg border-2 transition-all duration-150 text-sm font-medium
                    ${
                      selectedSize === size
                        ? "bg-green-600 text-white border-green-600 shadow"
                        : "bg-white text-green-700 border-green-300 hover:bg-green-50"
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-3">
            <div className="font-semibold mb-2 text-green-700 text-sm tracking-wide uppercase">
              Select Shape
            </div>
            <div className="flex gap-3">
              {SHAPES.map((shape) => (
                <button
                  key={shape}
                  type="button"
                  onClick={() => setSelectedShape(shape)}
                  className={`px-4 py-2 rounded-lg border-2 transition-all duration-150 text-sm font-medium
                    ${
                      selectedShape === shape
                        ? "bg-green-600 text-white border-green-600 shadow"
                        : "bg-white text-green-700 border-green-300 hover:bg-green-50"
                    }`}
                >
                  {shape}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 mt-4 justify-start">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 bg-gray-50 hover:bg-gray-100 text-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold text-sm hover:bg-green-700"
            >
              Confirm
            </button>
          </div>
        </div>
      )}
      {/* Image Section - Full Width */}
      <div className="relative group">
        <Link href={`/product/${data?.id}`}>
          <Image
            width={500}
            height={400}
            src={imgUrl}
            alt="plantozone"
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
          <span className="text-sm text-gray-500">Indoor Plant</span>
          <div className="flex items-center space-x-1">
            <Icon icon="material-symbols:star" className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-gray-800">4.9</span>
          </div>
        </div>

        {/* Plant Name and Price Together */}
        <div className="space-y-2">
          <Link href={`/product/${data?.id}`}>
            <h3 className="text-base font-semibold text-gray-800 line-clamp-2 hover:text-green-600 transition-colors">
              {data?.attributes?.title}
            </h3>
          </Link>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-gray-800">₹{getPrice()}</span>
              <span className="text-xl text-gray-400 line-through">₹{Math.round(getPrice() * 1.5)}</span>
            </div>
            <Button 
              ref={addBtnRef} 
              onClick={handleAddToCartClick} 
              className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors"
            >
              <Icon
                icon="icon-park-outline:shopping-cart-add"
                width="1.2em"
                height="1.2em"
              />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
