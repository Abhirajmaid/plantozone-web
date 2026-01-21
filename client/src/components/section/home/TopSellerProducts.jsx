"use client";
import React, { useEffect, useState, useRef } from "react";
import { Section } from "../../layout/Section";
import { Container } from "../../layout/Container";
import { ProductCard, SectionTitle } from "@/src/components";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import {
  addToCart as addToCartUtil,
  getCartItems,
} from "@/src/lib/utils/cartUtils";
import plantsAction from "@/src/lib/action/plants.action";

const NO_PREVIEW_IMG = "/images/plant.png";
const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "https://dashboard.plantozone.com";

const TopSellerProducts = () => {
  const [swiper, setSwiper] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [topSellers, setTopSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    fetchTopSellers();
  }, []);

  useEffect(() => {
    if (swiper && swiper.params) {
      swiper.params.navigation.prevEl = prevRef.current;
      swiper.params.navigation.nextEl = nextRef.current;
      swiper.navigation.init();
      swiper.navigation.update();
    }
  }, [swiper]);

  const fetchTopSellers = async () => {
    try {
      setLoading(true);
      const resp = await plantsAction.getPlants();
      const plants = resp.data.data || [];
      
      // Process and map plants data
      const processedPlants = plants.map((plant) => {
        const attrs = plant.attributes || {};
        
        // Handle image URL - prepend Strapi base URL if relative
        let imageUrl = NO_PREVIEW_IMG;
        const strapiImageUrl = attrs?.images?.data?.[0]?.attributes?.url;
        if (strapiImageUrl) {
          imageUrl = strapiImageUrl.startsWith('http') 
            ? strapiImageUrl 
            : `${STRAPI_BASE_URL}${strapiImageUrl}`;
        }
        
        // Return plant data in expected format
        return {
          id: plant.id,
          attributes: {
            ...attrs,
            images: {
              data: [{
                attributes: {
                  url: imageUrl
                }
              }]
            }
          }
        };
      });
      
      // Sort by rating (highest first) and take top 8-12 products
      const sortedByRating = processedPlants
        .sort((a, b) => (b.attributes?.rating || 0) - (a.attributes?.rating || 0))
        .slice(0, 12);
      
      setTopSellers(sortedByRating);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching top seller products:", error);
      setError("Failed to load products");
      setLoading(false);
    }
  };

  // Handler for adding to cart (same as NewArrivals)
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
    <Section className="bg-white py-12 md:py-16">
      <Container>
        {/* Section Header */}
        <SectionTitle 
          subtitle="Our Products"
          title="Our Top Seller Products"
          className="mb-12"
          subtitleClassName="text-black"
        />

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchTopSellers}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : topSellers.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600">No products available at the moment.</p>
          </div>
        ) : (
          /* Swiper Carousel */
          <div className="relative">
            <Swiper
              modules={[Navigation, Autoplay]}
              onSwiper={setSwiper}
              navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }}
              spaceBetween={20}
              slidesPerView={1}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 24,
                },
                1024: {
                  slidesPerView: 4,
                  spaceBetween: 24,
                },
                1280: {
                  slidesPerView: 4,
                  spaceBetween: 30,
                },
              }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              loop={topSellers.length > 4}
              className="top-seller-swiper"
            >
              {topSellers.map((product) => (
                <SwiperSlide key={product.id}>
                  <div className="px-1">
                    <ProductCard
                      data={product}
                      onAddToCart={(opts) => handleAddToCart(product, opts)}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Navigation Buttons */}
            {topSellers.length > 4 && (
              <>
                <button 
                  ref={prevRef}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                  aria-label="Previous"
                >
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  ref={nextRef}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                  aria-label="Next"
                >
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>
        )}
      </Container>
    </Section>
  );
};

export default TopSellerProducts;
