"use client";

import React, { useEffect, useState } from "react";
import { Container } from "../../layout/Container";
import { Section } from "../../layout/Section";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import plantsAction from "@/src/lib/action/plants.action";
import { addToWishlist } from "@/src/lib/utils/wishlistUtils";
import { Dialog, DialogContent } from "../../ui/dialog";
import { SectionTitle } from "../..";

const STRAPI_BASE_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "https://dashboard.plantozone.com";
const FALLBACK_IMG = "/images/plant.png";

const TopFivePlants = () => {
  const [plants, setPlants] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showZoomModal, setShowZoomModal] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      try {
        setLoading(true);
        const resp = await plantsAction.getPlants();
        const data = resp.data.data || [];
        const mapped = data.slice(0, 4).map((p) => {
          const attrs = p.attributes || {};
          let img = FALLBACK_IMG;
          const url = attrs?.images?.data?.[0]?.attributes?.url;
          if (url)
            img = url.startsWith("http") ? url : `${STRAPI_BASE_URL}${url}`;
          return {
            id: p.id,
            name: attrs.title || "Plant",
            description: attrs.description || "",
            category: attrs.category || "",
            rating: attrs.rating || 0,
            image: img,
          };
        });
        if (!mounted) return;
        setPlants(mapped);
        // set default selected plant immediately to avoid null during render
        setSelectedPlant(mapped.length > 0 ? mapped[0] : null);
        setCurrentIndex(0);
        setLoading(false);
      } catch (err) {
        console.error(err);
        if (!mounted) return;
        setError("Failed to load plants");
        setLoading(false);
      }
    };
    fetch();
    return () => {
      mounted = false;
    };
  }, []);

  // When loaded, set default selected plant
  useEffect(() => {
    if (!loading && plants.length > 0) {
      setSelectedPlant((prev) => prev || plants[0]);
      setCurrentIndex(0);
    }
  }, [loading, plants]);

  // If there's an error or no plants, don't render the section
  if (error || plants.length === 0) {
    return null;
  }

  const handlePlantClick = (plant, idx) => {
    setSelectedPlant(plant);
    setCurrentIndex(idx);
  };

  const handleAddToWishlist = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (!selectedPlant) return;
    addToWishlist({
      product: selectedPlant.id,
      title: selectedPlant.name,
      price: 0,
      size: "Small",
      shape: "Default",
      quantity: 1,
      image: selectedPlant.image,
    });
    toast.success("Added to wishlist!", { position: "top-right" });
  };

  const handleZoomClick = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setShowZoomModal(true);
  };

  return (
    <Section className="relative overflow-hidden bg-gradient-to-br from-emerald-50/20 to-white">
      {/* Decorative blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-8 right-8 w-40 h-40 bg-green-100/40 rounded-full blur-3xl"></div>
        <div className="absolute bottom-8 left-6 w-56 h-56 bg-emerald-100/30 rounded-full blur-3xl"></div>
      </div>

      <Container>
        {loading ? (
          // Title + centered spinner + skeleton below (shows spinner like CategorySec)
          <div className="relative z-10 py-14 md:py-20 min-h-auto">
            <SectionTitle
              subtitle="Top Picks"
              title="Top Plants"
              className="mb-6"
              subtitleClassName="text-gray-500"
            />

            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch mt-4">
              <div className="rounded-2xl shimmer-bg w-full h-[420px]"></div>
              <div className="space-y-4">
                <div className="h-6 w-40 shimmer-bg rounded"></div>
                <div className="h-4 w-80 shimmer-bg rounded"></div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="h-44 shimmer-bg rounded-lg"></div>
                  <div className="h-44 shimmer-bg rounded-lg"></div>
                  <div className="h-44 shimmer-bg rounded-lg"></div>
                  <div className="h-44 shimmer-bg rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative z-10 py-6 md:py-8 lg:py-10 min-h-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-stretch min-h-full">
              {/* Left: Featured plant (large) — hero-style with controls */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="order-2 lg:order-1 flex items-center justify-center h-full"
              >
                <Link
                  href={`/product/${selectedPlant.id}`}
                  className="bg-white/80 backdrop-blur-sm rounded-lg md:rounded-xl lg:rounded-[2rem] shadow-lg md:shadow-xl lg:shadow-2xl overflow-hidden w-full h-full relative border border-green-100/50 hover:shadow-green-200/50 hover:shadow-3xl transition-all duration-500 block cursor-pointer"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedPlant.id}
                      initial={{ opacity: 0, x: -100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      className="relative w-full h-full"
                    >
                      <div className="relative w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 group overflow-hidden">
                        <motion.div
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.5 }}
                          className="relative w-full h-full"
                        >
                          <Image
                            src={selectedPlant.image}
                            alt={selectedPlant.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                            className="object-cover"
                            priority
                            unoptimized={selectedPlant.image?.startsWith(
                              "http",
                            )}
                          />
                        </motion.div>
                      </div>

                      {/* Gradient Overlay from Bottom */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>

                      {/* Action Buttons (always visible) */}
                      <div className="absolute top-3 right-3 flex flex-col space-y-3 z-20 [&_button]:pointer-events-auto">
                        <button
                          type="button"
                          onClick={handleAddToWishlist}
                          className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-red-50 transition-colors"
                          aria-label="Add to wishlist"
                        >
                          <svg
                            className="w-4 h-4 text-gray-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                        </button>

                        <button
                          type="button"
                          onClick={handleZoomClick}
                          className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-blue-50 transition-colors"
                          aria-label="Zoom image"
                        >
                          <svg
                            className="w-4 h-4 text-gray-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                        </button>
                      </div>

                      {/* Featured Badge */}
                      <div className="absolute top-3 left-3 z-20">
                        <div className="bg-green-600 text-white px-3 py-1 rounded text-sm font-semibold">
                          Featured
                        </div>
                      </div>

                      {/* Plant Info Overlaid */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                        <div className="text-white/90 text-sm">
                          {selectedPlant.category}
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-white drop-shadow-lg">
                          {selectedPlant.name}
                        </h3>
                        <p className="text-white/90 mt-2 max-w-xl line-clamp-3">
                          {selectedPlant.description}
                        </p>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="text-white/90 font-semibold">
                            {selectedPlant.rating} ⭐
                          </div>
                          <Link
                            href={`/product/${selectedPlant.id}`}
                            className="inline-flex items-center gap-2 text-white font-medium hover:underline"
                          >
                            <span>Know more</span>
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                              />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </Link>
              </motion.div>

              {/* Right: Title + Top 5 grid */}

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="order-1 lg:order-2"
              >
                <div className="mb-6">
                  <SectionTitle
                    title="Top Plants"
                    className="mb-3 text-left md:text-left"
                    subtitleClassName="text-gray-500"
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-gray-600 mb-0 max-w-lg">
                      Our most loved plants this week — handpicked for you.
                      Click any item to preview it on the left.
                    </p>
                    <Link
                      href="/shop"
                      className="text-sm text-green-600 font-medium hover:underline"
                    >
                      View all
                    </Link>
                  </div>
                </div>

            <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                  {plants.map((plant, idx) => (
                    <motion.div
                      key={plant.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.06 }}
                      whileHover={{ y: -5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handlePlantClick(plant, idx)}
                      className={`relative bg-white rounded-lg md:rounded-xl lg:rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer group ${
                        selectedPlant.id === plant.id
                          ? "ring-1 md:ring-2 ring-green-600 shadow-xl"
                          : "hover:ring-2 hover:ring-gray-200"
                      }`}
                    >
                      {/* Selected Badge */}
                      {selectedPlant.id === plant.id && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 15,
                          }}
                          className="absolute top-1 right-1 z-10 bg-green-600 text-white rounded-full p-1 shadow-lg"
                        >
                          <svg
                            className="w-3 h-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </motion.div>
                      )}

                      {/* Plant Image full with overlayed name */}
                      <div className="relative w-full h-44 md:h-52 lg:h-60 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                        <Image
                          src={plant.image}
                          alt={plant.name}
                          fill
                          sizes="200px"
                          className="object-cover transform group-hover:scale-110 transition-transform duration-300"
                        />

                        {/* Subtle dark overlay for text contrast */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200"></div>

                        {/* Plant name on top of image */}
                        <div className="absolute inset-x-0 top-3 flex items-center justify-center z-10 pointer-events-none">
                          <div className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-900 shadow">
                            {plant.name}
                          </div>
                        </div>

                        {/* Rating Badge (bottom-left) */}
                        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 shadow-lg flex items-center gap-1 z-10">
                          <svg
                            className="w-3 h-3 text-yellow-400 fill-current"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-[10px] md:text-xs font-semibold text-gray-800">
                            {plant.rating}
                          </span>
                        </div>
                      </div>

                      {/* Hover overlay effect */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-t from-green-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${selectedPlant.id === plant.id ? "opacity-100" : ""}`}
                      ></div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </Container>

      {/* Zoom Modal */}
      {selectedPlant && (
        <Dialog open={showZoomModal} onOpenChange={setShowZoomModal}>
          <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-0 shadow-none">
            <div className="relative w-full max-h-[85vh] flex items-center justify-center">
              <Image
                src={selectedPlant.image}
                alt={selectedPlant.name}
                width={800}
                height={600}
                className="max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-lg"
                unoptimized={selectedPlant.image?.startsWith("http")}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
      {/* Shimmer CSS for skeleton */}
      <style jsx>{`
        .shimmer-bg {
          background: linear-gradient(
            90deg,
            rgba(229, 231, 235, 1) 0%,
            rgba(243, 244, 246, 1) 40%,
            rgba(229, 231, 235, 1) 100%
          );
          background-size: 200% 100%;
          animation: shimmer 1.4s linear infinite;
        }
        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </Section>
  );
};

export default TopFivePlants;
