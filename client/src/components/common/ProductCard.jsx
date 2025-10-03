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
    <div className="w-full h-auto mb-5 bg-white rounded-lg space-y-1 flex flex-col justify-between relative">
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
      <Link href={`/product/${data?.id}`}>
        <Image
          width={500}
          height={220}
          src={imgUrl}
          alt="plantozone"
          className="w-full h-[350px] rounded-lg overflow-hidden object-cover border-2 border-gray-400"
        />
      </Link>
      <div className="p-2 flex justify-between items-center">
        <Link href={`/product/${data?.id}`}>
          <h3 className="text-[18px] font-semibold text-gray-800 line-clamp-2">
            {data?.attributes?.title}
          </h3>
        </Link>
        {/* <p className="text-gray-500 text-sm">↕ 20-24cm</p> */}
      </div>

      <div className="p-2 border-2 border-mediumGray rounded-md flex items-center justify-between">
        <span className="text-base font-semibold text-gray-800">
          <span className="font-normal text-sm">From</span> ₹ {getPrice()}
        </span>
        <span className="flex items-center gap-3">
          <Button ref={addBtnRef} onClick={handleAddToCartClick}>
            <Icon
              icon="icon-park-outline:shopping-cart-add"
              width="1.3em"
              height="1.3em"
            />
          </Button>
          {/* <Button asChild>
            <Link href={`/product/${data?.id}`}>Buy Now</Link>
          </Button> */}
        </span>
      </div>
    </div>
  );
};

export default ProductCard;
