"use client";
import React, { useEffect, useState } from "react";
import { Section } from "../../layout/Section";
import { Container } from "../../layout/Container";
import { SectionTitle } from "../..";
import { Button } from "../../ui/button";
import Link from "next/link";
import Image from "next/image";
import plantsAction from "@/src/lib/action/plants.action";
import {
  addToCart as addToCartUtil,
  getCartItems,
} from "@/src/lib/utils/cartUtils";

const NO_PREVIEW_IMG = "/no-preview.png";

// Mock data for top seller products with countdown timers
const mockTopSellers = [
  {
    id: 1,
    title: "Monstera deliciosa",
    category: "Indoor Plant",
    currentPrice: 12.50,
    originalPrice: 26.00,
    discount: "50% off",
    rating: 4.9,
    image: "/images/plant.png",
    countdown: { days: 5, hours: 12, minutes: 30, seconds: 25 }
  },
  {
    id: 2,
    title: "Watermelon Peperomia",
    category: "Indoor Plant",
    currentPrice: 20.00,
    originalPrice: 25.00,
    discount: "20% off",
    rating: 4.9,
    image: "/images/plant.png",
    countdown: { days: 3, hours: 8, minutes: 45, seconds: 12 }
  },
  {
    id: 3,
    title: "Pepper Face Plant",
    category: "Indoor Plant",
    currentPrice: 12.00,
    originalPrice: 16.00,
    discount: "20% off",
    rating: 4.9,
    image: "/images/plant.png",
    countdown: { days: 2, hours: 6, minutes: 15, seconds: 8 }
  },
  {
    id: 4,
    title: "Snake Plant",
    category: "Indoor Plant",
    currentPrice: 20.00,
    originalPrice: 25.00,
    discount: "20% off",
    rating: 4.9,
    image: "/images/plant.png",
    countdown: { days: 4, hours: 10, minutes: 20, seconds: 35 }
  }
];

const CountdownTimer = ({ days, hours, minutes, seconds }) => {
  return (
    <div className="bg-yellow-400 text-gray-800 px-3 py-2 rounded-lg text-sm font-bold">
      <div className="flex items-center gap-1">
        <span>{days.toString().padStart(2, '0')} Days</span>
        <span>:</span>
        <span>{hours.toString().padStart(2, '0')} Hours</span>
        <span>:</span>
        <span>{minutes.toString().padStart(2, '0')} Mins</span>
        <span>:</span>
        <span>{seconds.toString().padStart(2, '0')} Sec</span>
      </div>
    </div>
  );
};

const ProductCard = ({ product, onAddToCart }) => {
  const [timeLeft, setTimeLeft] = useState(product.countdown);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Product Image */}
      <div className="relative">
        <Image
          src={product.image}
          alt={product.title}
          width={300}
          height={250}
          className="w-full h-48 object-cover"
        />
        
        {/* Discount Badge */}
        <div className="absolute top-3 left-3 bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-bold">
          {product.discount}
        </div>

        {/* Action Icons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors">
            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </button>
          <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </button>
          <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors">
            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4">
        {/* Countdown Timer */}
        <CountdownTimer {...timeLeft} />

        {/* Category */}
        <div className="text-sm text-gray-500 mt-2">{product.category}</div>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-1">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-gray-600">{product.rating}</span>
        </div>

        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 mt-2">{product.title}</h3>

        {/* Price */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-lg font-bold text-gray-900">${product.currentPrice}</span>
          <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
        </div>
      </div>
    </div>
  );
};

const TopSellerProducts = () => {
  const [data, setData] = useState([]);
  const [cartItems, setCartItems] = useState([]);

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

  return (
    <Section className="bg-white">
      <Container>
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
          <div className="text-center sm:text-left">
            <span className="text-lg text-gray-500 mb-2 font-medium">Our Products</span>
            <SectionTitle
              title={
                <>
                  Our Top Seller <span className="text-green-600">Products</span>
                </>
              }
            />
          </div>
          <Link href="/shop">
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105">
              View All Products
            </Button>
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockTopSellers.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default TopSellerProducts;
