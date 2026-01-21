"use client";
import { useState, useEffect } from "react";
import { Container } from "../../layout/Container";
import { Section } from "../../layout/Section";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import plantsAction from "@/src/lib/action/plants.action";

const NO_PREVIEW_IMG = "/images/plant.png";
const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "https://dashboard.plantozone.com";

const Hero = () => {
  const [allPlants, setAllPlants] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch plants from backend
  useEffect(() => {
    getPlantList();
  }, []);

  const getPlantList = async () => {
    try {
      setLoading(true);
      const resp = await plantsAction.getPlants();
      const plants = resp.data.data;
      
      // Map backend data to hero format (take first 4-5 plants)
      const mappedPlants = plants.slice(0, 4).map((plant) => {
        const attrs = plant.attributes || {};
        
        // Handle image URL - prepend Strapi base URL if relative
        let imageUrl = NO_PREVIEW_IMG;
        const strapiImageUrl = attrs?.images?.data?.[0]?.attributes?.url;
        if (strapiImageUrl) {
          imageUrl = strapiImageUrl.startsWith('http') 
            ? strapiImageUrl 
            : `${STRAPI_BASE_URL}${strapiImageUrl}`;
        }
        
        return {
          id: plant.id,
          name: attrs.title || "Plant Name",
          description: attrs.description || "Beautiful plant for your home.",
          image: imageUrl,
          category: attrs.category || "Indoor Plant",
          rating: attrs.rating || 4.5
        };
      });

      setAllPlants(mappedPlants);
      setSelectedPlant(mappedPlants[0]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching plants:", error);
      setError("Failed to load plants");
      setLoading(false);
    }
  };

  // Auto-play carousel - change plant every 5 seconds
  useEffect(() => {
    if (allPlants.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % allPlants.length;
        setSelectedPlant(allPlants[nextIndex]);
        return nextIndex;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [allPlants]);

  // Handle manual plant selection
  const handlePlantClick = (plant, index) => {
    setSelectedPlant(plant);
    setCurrentIndex(index);
  };

  // Show loading state
  if (loading) {
    return (
      <Section className="relative overflow-hidden bg-gradient-to-br from-emerald-50/30 via-white to-green-50/20 min-h-screen">
        <Container className="relative z-10 py-8 lg:py-12 h-full px-4">
          <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading plants...</p>
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  // Show error state
  if (error || allPlants.length === 0) {
    return (
      <Section className="relative overflow-hidden bg-gradient-to-br from-emerald-50/30 via-white to-green-50/20 min-h-screen">
        <Container className="relative z-10 py-8 lg:py-12 h-full px-4">
          <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error || "No plants available"}</p>
              <button 
                onClick={getPlantList}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section className="relative overflow-hidden bg-gradient-to-br from-emerald-50/30 via-white to-green-50/20 min-h-[auto] md:min-h-screen pt-20 md:pt-40">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 md:top-20 right-5 md:right-20 w-48 md:w-72 h-48 md:h-72 bg-green-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 md:bottom-20 left-5 md:left-20 w-64 md:w-96 h-64 md:h-96 bg-emerald-100/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-gradient-to-br from-green-100/10 to-emerald-50/10 rounded-full blur-3xl"></div>
      </div>

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2316a34a' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <div className="relative z-10 pb-4 md:pb-8 lg:pb-12 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 w-full">
        <div className="grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 xl:gap-16 items-center w-full">
          {/* Left: Featured Plant - Shows below content on mobile, left side on desktop */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center order-2 lg:order-1"
          >
            <Link 
              href="/shop"
              className="bg-white/80 backdrop-blur-sm rounded-lg md:rounded-xl lg:rounded-[2rem] xl:rounded-[2.5rem] 2xl:rounded-[3rem] shadow-lg md:shadow-xl lg:shadow-2xl xl:shadow-3xl overflow-hidden w-full relative border border-green-100/50 hover:shadow-green-200/50 hover:shadow-3xl transition-all duration-500 h-[400px] md:h-[500px] lg:h-[600px] xl:h-[600px] 2xl:h-[700px] block cursor-pointer"
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
                  {/* Full Size Plant Image */}
                  <div className="relative w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 group overflow-hidden">
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="relative w-full h-full"
                    >
                      <Image
                        src={selectedPlant.image}
                        alt={selectedPlant.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 600px, 700px"
                        className="object-cover"
                        priority
                      />
                    </motion.div>

                    {/* Gradient Overlay from Bottom */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
                    
                    {/* Hover Buttons */}
                    <div className="absolute top-1.5 md:top-2 lg:top-4 xl:top-5 2xl:top-6 right-1.5 md:right-2 lg:right-4 xl:right-5 2xl:right-6 flex flex-col space-y-1 md:space-y-1.5 lg:space-y-2 xl:space-y-2.5 2xl:space-y-3 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                      {/* Heart Button */}
                      <button 
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14 bg-white rounded-full shadow-md lg:shadow-lg xl:shadow-xl flex items-center justify-center hover:bg-red-50 transition-colors"
                      >
                        <svg className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                      
                      {/* View Button */}
                      <button 
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14 bg-white rounded-full shadow-md lg:shadow-lg xl:shadow-xl flex items-center justify-center hover:bg-blue-50 transition-colors"
                      >
                        <svg className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </button>
                    </div>

                    {/* Featured Badge */}
                    <div className="absolute top-1.5 md:top-2 lg:top-3 xl:top-5 2xl:top-6 left-1.5 md:left-2 lg:left-3 xl:left-5 2xl:left-6 z-20">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="bg-green-600 text-white px-1.5 md:px-2 lg:px-3 xl:px-5 2xl:px-6 py-0.5 md:py-0.5 lg:py-1 xl:py-1.5 2xl:py-2 rounded text-[9px] md:text-[10px] lg:text-xs xl:text-sm 2xl:text-base font-semibold shadow-md md:shadow-lg xl:shadow-xl"
                      >
                        Featured
                      </motion.div>
                    </div>
                  
                    {/* Plant Info - Overlaid at Bottom */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                      className="absolute bottom-0 left-0 right-0 p-2 md:p-2.5 lg:p-4 xl:p-6 2xl:p-8 space-y-1 md:space-y-1.5 lg:space-y-2 xl:space-y-3 2xl:space-y-4 z-20"
                    >
                      {/* Category */}
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] md:text-[10px] lg:text-xs xl:text-sm 2xl:text-base text-white/90">{selectedPlant.category}</span>
                        <div className="flex items-center space-x-0.5 xl:space-x-1">
                          <svg className="w-2 h-2 md:w-2.5 md:h-2.5 lg:w-3 lg:h-3 xl:w-4 xl:h-4 2xl:w-5 2xl:h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-[9px] md:text-[10px] lg:text-xs xl:text-sm 2xl:text-base font-medium text-white">{selectedPlant.rating}</span>
                        </div>
                      </div>

                      {/* Name */}
                      <h2 className="text-xs md:text-sm lg:text-base xl:text-2xl 2xl:text-3xl font-bold text-white line-clamp-2 xl:line-clamp-3 drop-shadow-lg">
                        {selectedPlant.name}
                      </h2>

                      {/* Description */}
                      <p className="text-white/90 text-[9px] md:text-[10px] lg:text-xs xl:text-sm 2xl:text-base leading-normal md:leading-relaxed xl:leading-relaxed line-clamp-2 xl:line-clamp-3 drop-shadow-md">
                        {selectedPlant.description}
                      </p>

                      {/* Know More Text */}
                      <div className="inline-flex items-center gap-1 xl:gap-2 text-white hover:text-green-200 font-medium transition-colors group pt-1 md:pt-1 lg:pt-1.5 xl:pt-2 text-[9px] md:text-[10px] lg:text-xs xl:text-base 2xl:text-lg pointer-events-none">
                        <span>Know more</span>
                        <svg
                          className="w-2.5 h-2.5 md:w-3 md:h-3 lg:w-4 lg:h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6 group-hover:translate-x-1 transition-transform"
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
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </Link>
          </motion.div>

          {/* Right: Content and Top 5 Plants - Shows at top on mobile, right side on desktop */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col justify-center space-y-6 md:space-y-8 lg:space-y-10 xl:space-y-12 order-1 lg:order-2"
          >
            {/* Hero Content */}
            <div className="space-y-4 md:space-y-5 lg:space-y-6 xl:space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <span className="inline-block text-green-600 text-xs md:text-sm lg:text-base font-semibold tracking-wide uppercase px-3 md:px-4 lg:px-5 py-1 md:py-1.5 lg:py-2 bg-green-50 rounded-full">
                  Go green.
                </span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-6xl font-bold bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 bg-clip-text text-transparent leading-tight max-w-2xl"
              >
                The world of plants
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-gray-600 text-sm md:text-base lg:text-lg xl:text-xl leading-relaxed max-w-2xl"
              >
                Discover everything you need to know about your plants, treat them with kindness and they will take care of you.
              </motion.p>
            </div>

            {/* Top 5 of the Week */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="w-full"
            >
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-5 lg:mb-6 xl:mb-8">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
                    <svg className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-gray-900">Top 5 of the week</h3>
                  <p className="text-xs md:text-sm lg:text-base text-gray-500">Most popular plants this week</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-5 xl:gap-6">
                {allPlants.map((plant, index) => (
                  <motion.div
                    key={plant.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handlePlantClick(plant, index)}
                    className={`relative bg-white rounded-lg md:rounded-xl lg:rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer group ${
                      selectedPlant.id === plant.id 
                        ? 'ring-1 md:ring-2 ring-green-600 shadow-xl' 
                        : 'hover:ring-2 hover:ring-gray-200'
                    }`}
                  >
                    {/* Selected Badge */}
                    {selectedPlant.id === plant.id && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="absolute top-1 md:top-2 right-1 md:right-2 z-10 bg-green-600 text-white rounded-full p-1 md:p-1.5 shadow-lg"
                      >
                        <svg className="w-2 h-2 md:w-3 md:h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </motion.div>
                    )}

                    {/* Plant Image Container */}
                    <div className="relative w-full h-32 md:h-40 lg:h-48 xl:h-56 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                      {/* Decorative background pattern */}
                      <div className="absolute inset-0 opacity-5">
                        <div className="absolute inset-0" style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2316a34a' fill-opacity='0.1'%3E%3Cpath d='M0 0h20L0 20z'/%3E%3C/g%3E%3C/svg%3E")`,
                          backgroundSize: '20px 20px'
                        }}></div>
                      </div>
                      
                      {/* Image fills entire container */}
                      <Image
                        src={plant.image}
                        alt={plant.name}
                        fill
                        sizes="200px"
                        className="object-cover transform group-hover:scale-110 transition-transform duration-300"
                      />

                      {/* Rating Badge */}
                      <div className="absolute bottom-1 md:bottom-2 lg:bottom-3 left-1 md:left-2 lg:left-3 bg-white/90 backdrop-blur-sm rounded-full px-1.5 md:px-2.5 py-1 md:py-1.5 shadow-lg flex items-center gap-0.5 md:gap-1 z-10">
                        <svg className="w-2 h-2 md:w-3 md:h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-[10px] md:text-xs font-semibold text-gray-800">{plant.rating}</span>
                      </div>
                    </div>

                    {/* Plant Info */}
                    <div className="p-1.5 md:p-2 lg:p-3 bg-white border-t border-gray-100">
                      <h4 className="text-[10px] md:text-xs lg:text-sm font-bold text-gray-900 line-clamp-2 text-center mb-0.5 md:mb-1 group-hover:text-green-600 transition-colors">
                        {plant.name}
                      </h4>
                      <p className="text-[9px] md:text-[10px] lg:text-xs text-gray-500 text-center">{plant.category}</p>
                    </div>

                    {/* Hover overlay effect */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-green-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
                      selectedPlant.id === plant.id ? 'opacity-100' : ''
                    }`}></div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
};

export default Hero;
