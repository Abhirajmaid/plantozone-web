"use client";
import React, { useState, useRef, useMemo, useEffect } from "react";
import { Button } from "../ui/button";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SHAPES = ["Hexagonal", "Round"];

function buildSizeOptions(attrs) {
  if (!attrs) return [];
  const opts = [];
  const add = (size, val) => {
    const p = parseFloat(val);
    if (val != null && !isNaN(p) && p >= 0) opts.push({ size, price: p });
  };
  add("Small", attrs.priceSmall);
  add("Medium", attrs.priceMedium);
  add("Large", attrs.priceLarge);
  return opts;
}

function isOfferActive(attrs) {
  if (!attrs?.discountPercent || parseFloat(attrs.discountPercent) <= 0) return false;
  const start = attrs.offerStart ? new Date(attrs.offerStart) : null;
  const end = attrs.offerEnd ? new Date(attrs.offerEnd) : null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  if (!start && !end) return true;
  if (start) start.setHours(0, 0, 0, 0);
  if (end) end.setHours(23, 59, 59, 999);
  if (start && now < start) return false;
  if (end && now > end) return false;
  return true;
}

const DEFAULT_IMAGE = "/images/plant.png";

const ProductCard = ({ data, onAddToCart }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedShape, setSelectedShape] = useState("");
  const [imgError, setImgError] = useState(false);
  const addBtnRef = useRef(null);

  const attrs = data?.attributes || {};
  const sizeOptions = useMemo(() => buildSizeOptions(attrs), [attrs.priceSmall, attrs.priceMedium, attrs.priceLarge]);
  const offerActive = isOfferActive(attrs);
  const discountPercent = parseFloat(attrs.discountPercent) || 0;

  const handleAddToCartClick = () => {
    if (sizeOptions.length === 0) {
      toast.info("Price on request", { position: "top-right" });
      return;
    }
    setSelectedSize(sizeOptions[0].size);
    setSelectedShape("");
    setShowPopup(true);
  };

  const getEffectivePrice = (basePrice) => {
    if (offerActive && discountPercent > 0) return Math.round(basePrice * (1 - discountPercent / 100));
    return Math.round(basePrice);
  };

  const handleConfirm = () => {
    if (!selectedSize || !selectedShape) {
      toast.error("Please select size and shape.", { position: "top-right" });
      return;
    }
    const opt = sizeOptions.find((o) => o.size === selectedSize);
    const basePrice = opt?.price ?? 0;
    const effectivePrice = getEffectivePrice(basePrice);
    if (onAddToCart) {
      onAddToCart({ size: selectedSize, shape: selectedShape, price: effectivePrice });
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
  const rawUrl = imgArr?.[0]?.attributes?.url;
  const hasValidUrl = rawUrl != null && String(rawUrl).trim() !== "";
  const imgUrl = hasValidUrl ? rawUrl : DEFAULT_IMAGE;
  const displaySrc = imgError ? DEFAULT_IMAGE : imgUrl;

  useEffect(() => setImgError(false), [imgUrl]);

  // Check if image is external (Strapi URL)
  const isExternalImage = displaySrc.startsWith("http");

  // Get category from categories relation (Strapi); fallback when unset
  const category =
    data?.attributes?.categories?.data?.[0]?.attributes?.title ||
    data?.attributes?.categories?.data?.[0]?.attributes?.name ||
    data?.attributes?.category ||
    "Plant";
  const rating = data?.attributes?.rating ?? 4.9;

  // Display price: first size; with discount when offer active
  const firstBase = sizeOptions[0]?.price ?? 0;
  const displayPrice = getEffectivePrice(firstBase);
  const showStrikethrough = offerActive && discountPercent > 0 && firstBase > 0;

  // Position popup absolutely near the Add to Cart button
  return (
    <div className="w-full bg-white transition-shadow duration-300 overflow-hidden relative">
      {/* Discount Tags: 20% off (always) + extra offer when discount % is set in CMS */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        <div className="bg-green-600 text-white px-2 py-1 rounded-md text-xs font-semibold">
          20% off
        </div>
        {(() => {
          const p = parseFloat(data?.attributes?.discountPercent);
          if (p > 0 && !isNaN(p)) {
            return (
              <div className="bg-green-600 text-white px-2 py-1 rounded-md text-xs font-semibold">
                Extra {Math.round(p)}% off
              </div>
            );
          }
          return null;
        })()}
      </div>
      {/* Popup: dynamic sizes from CMS, shapes Hexagonal/Round */}
      {showPopup && (
        <div className="absolute z-50 right-0 top-0 bg-white border border-green-600 shadow-2xl rounded-xl p-5 min-w-[230px]">
          <div className="mb-3">
            <div className="font-semibold mb-2 text-green-700 text-sm tracking-wide uppercase">
              Select Size
            </div>
            <div className="flex flex-wrap gap-3">
              {sizeOptions.map(({ size, price }) => (
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
                  {size} — ₹{Math.round(price).toLocaleString("en-IN")}
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
            src={displaySrc}
            alt={data?.attributes?.title || "plantozone"}
            className="w-full h-[300px] rounded-xl object-cover bg-gray-50"
            unoptimized={isExternalImage}
            onError={() => setImgError(true)}
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
          <Link href={`/product/${data?.id}`}>
            <h3 className="text-base font-semibold text-gray-800 line-clamp-2 hover:text-green-600 transition-colors">
              {data?.attributes?.title}
            </h3>
          </Link>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {sizeOptions.length > 0 ? (
                <>
                  <span className="text-lg font-bold text-gray-800">
                    {sizeOptions.length > 1 ? "From " : ""}₹{displayPrice.toLocaleString("en-IN")}
                  </span>
                  {showStrikethrough && (
                    <span className="text-base text-gray-400 line-through">₹{Math.round(firstBase).toLocaleString("en-IN")}</span>
                  )}
                </>
              ) : (
                <span className="text-base font-medium text-gray-500">Price on request</span>
              )}
            </div>
            <Button
              ref={addBtnRef}
              onClick={handleAddToCartClick}
              disabled={sizeOptions.length === 0}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
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
