"use client";
import React, { useEffect, useState } from "react";
import { Section } from "../../layout/Section";
import { Container } from "../../layout/Container";
import { ProductCard, SectionTitle } from "../..";
import { Button } from "../../ui/button";
import Link from "next/link";
import plantsAction from "@/src/lib/action/plants.action";
import {
  addToCart as addToCartUtil,
  getCartItems,
} from "@/src/lib/utils/cartUtils";

const NO_PREVIEW_IMG = "/no-preview.png"; // Ensure this exists in public

const NewArrivals = () => {
  const [data, setData] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    getPlantList();
  }, []);

  const getPlantList = async () => {
    try {
      const resp = await plantsAction.getPlants();
      setData(resp.data.data);
    } catch (error) {
      console.error("Error fetching plants:", error);
    }
  };

  // Handler for adding to cart (like cart page)
  const handleAddToCart = (item, { size, shape, price }) => {
    const attrs = item.attributes;
    const img = attrs?.images?.data?.[0]?.attributes?.url || NO_PREVIEW_IMG;
    addToCartUtil({
      product: item.id,
      title: attrs.title,
      price: price,
      size: size,
      shape: shape,
      quantity: 1,
      image: img,
    });
    setCartItems(getCartItems());
  };

  // Carousel functions
  const itemsPerSlide = 3;
  const totalSlides = Math.ceil(data.length / itemsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (slideIndex) => {
    setCurrentSlide(slideIndex);
  };

  // Touch/swipe handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
  };

  const handleMouseUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const endX = e.pageX;
    const diff = startX - endX;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
  };

  const handleTouchEnd = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const endX = e.changedTouches[0].pageX;
    const diff = startX - endX;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };

  return (
    <Section>
      <Container>
        {/* Carousel Container */}
        <div className="relative mt-4">
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute -left-12 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors"
            disabled={totalSlides <= 1}
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute -right-12 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors"
            disabled={totalSlides <= 1}
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Carousel Content */}
          <div
            className="overflow-hidden select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => setIsDragging(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{
                transform: `translateX(-${currentSlide * 100}%)`,
              }}
            >
              {Array.from({ length: totalSlides }, (_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
                    {data
                      ?.slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide)
                      ?.map((item, id) => (
                        <div key={id}>
                          <ProductCard
                            data={item}
                            onAddToCart={(opts) => handleAddToCart(item, opts)}
                            showAddToCart
                          />
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Swipe Indicators */}
          {totalSlides > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ length: totalSlides }, (_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide
                      ? 'bg-green-600'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Load More Button */}
        <div className="w-full flex justify-center mt-8">
          <Link href="/shop">
            <Button className="text-[20px] p-5 px-7 font-medium">
              Load More
            </Button>
          </Link>
        </div>
      </Container>
    </Section>
  );
};

export default NewArrivals;
