"use client";
import { useState, useEffect, useRef } from "react";
import { Container } from "../../layout/Container";
import { Section } from "../../layout/Section";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import plantsAction from "@/src/lib/action/plants.action";
import adminAction from "@/src/lib/action/admin.action";
import { addToWishlist } from "@/src/lib/utils/wishlistUtils";
import { Dialog, DialogContent } from "../../ui/dialog";

const NO_PREVIEW_IMG = "/images/plant.png";
const STRAPI_BASE_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "https://dashboard.plantozone.com";

const Hero = () => {
  const [allPlants, setAllPlants] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showZoomModal, setShowZoomModal] = useState(false);
  const [customerMedia, setCustomerMedia] = useState([]);

  // Fetch plants from backend
  useEffect(() => {
    getPlantList();
    fetchCustomerMedia();
  }, []);

  const fetchCustomerMedia = async () => {
    try {
      const res = await adminAction.getCustomerMedia(null, { pageSize: 20 });
      const data = res.data.data || [];
      const mapped = data.map((item) => {
        const attrs = item.attributes || {};
        const imageData = attrs.image?.data?.[0];
        const imageUrl = imageData?.attributes?.url;
        const fullUrl = imageUrl 
          ? (imageUrl.startsWith("http") ? imageUrl : `${STRAPI_BASE_URL}${imageUrl}`)
          : "/images/plant.png";
        
        // Determine type based on mime type or file extension
        const mimeType = imageData?.attributes?.mime || "";
        const isVideo = mimeType.startsWith("video/") || fullUrl.endsWith(".mp4") || fullUrl.endsWith(".webm");
        
        return {
          id: item.id,
          type: isVideo ? "video" : "image",
          src: fullUrl,
          caption: attrs.title || attrs.description || "",
          name: attrs.customerName || "Customer",
        };
      });
      setCustomerMedia(mapped);
    } catch (err) {
      console.error("Error fetching customer media:", err);
      // Fallback to empty array
      setCustomerMedia([]);
    }
  };

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
          imageUrl = strapiImageUrl.startsWith("http")
            ? strapiImageUrl
            : `${STRAPI_BASE_URL}${strapiImageUrl}`;
        }

        return {
          id: plant.id,
          name: attrs.title || "Plant Name",
          description: attrs.description || "Beautiful plant for your home.",
          image: imageUrl,
          category: attrs.category || "Indoor Plant",
          rating: attrs.rating || 4.5,
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

  // Swiper will handle autoplay/navigation for customer media

  // Handle manual plant selection
  const handlePlantClick = (plant, index) => {
    setSelectedPlant(plant);
    setCurrentIndex(index);
  };

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedPlant) return;
    addToWishlist({
      product: selectedPlant.id,
      title: selectedPlant.name,
      price: 0,
      size: "Small",
      shape: "Round",
      quantity: 1,
      image: selectedPlant.image,
    });
    toast.success("Added to wishlist!", { position: "top-right" });
  };

  const handleZoomClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowZoomModal(true);
  };

  // Show loading state
  if (loading) {
    return (
      <Section className="relative overflow-hidden bg-gradient-to-br from-emerald-50/30 via-white to-green-50/20 min-h-screen">
        <Container className="relative z-10 py-8 lg:py-16 h-full px-4">
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
              <p className="text-red-600 mb-4">
                {error || "No plants available"}
              </p>
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
    <Section
      className="relative overflow-hidden bg-[#fff8ef] pb-16"
      style={{ minHeight: "calc(100vh - 96px)", paddingTop: "96px" }}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 right-10 w-48 h-48 bg-amber-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-emerald-100/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <Container className="text-center md:pt-[160px] pt-[100px]">
          {/* Badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center bg-amber-100 text-amber-800 px-4 py-1.5 rounded-full text-sm font-medium shadow-sm">
              Join 100,000+ happy plant parents
            </div>
          </div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-gray-900 max-w-4xl mx-auto"
          >
            Bring Nature Home with Plantozone
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-gray-600 text-base sm:text-lg md:text-xl max-w-3xl mx-auto"
          >
            Discover curated indoor and outdoor plants, expert care tips, and
            reliable delivery — everything you need to make your home greener
            and healthier.
          </motion.p>
          {/* CTAs */}
          <div className="mt-8">
            <div className="flex gap-4 items-center justify-center">
              <a
                href="/shop"
                className="inline-block px-6 py-3 rounded-full bg-green-600 text-white shadow hover:bg-green-700 transition"
              >
                Shop Plants
              </a>
              <a
                href="/about-us"
                className="inline-block px-6 py-3 rounded-full border border-green-200 text-green-700 bg-white hover:bg-green-50 transition"
              >
                Our Story
              </a>
            </div>
          </div>
        </Container>

        {/* Customer media carousel (Swiper) */}
        <div className="w-full mt-8">
          <div className="relative">
            {/* Navigation buttons */}
            <button
              aria-label="Previous"
              className="hero-swiper-prev absolute left-3 top-1/2 z-20 -translate-y-1/2 bg-green-600 text-white p-2 rounded-full shadow hover:bg-green-700 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              aria-label="Next"
              className="hero-swiper-next absolute right-3 top-1/2 z-20 -translate-y-1/2 bg-green-600 text-white p-2 rounded-full shadow hover:bg-green-700 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <Swiper
              modules={[Autoplay, Navigation, Pagination]}
              spaceBetween={16}
              loop={true}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              navigation={{ prevEl: ".hero-swiper-prev", nextEl: ".hero-swiper-next" }}
              pagination={{ clickable: true }}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              breakpoints={{
                320: { slidesPerView: 1.3 },
                640: { slidesPerView: 2.2 },
                768: { slidesPerView: 3.2 },
                1024: { slidesPerView: 4.2 },
              }}
              className="py-6"
            >
              {customerMedia.map((m, idx) => (
                <SwiperSlide
                  key={m.id + "-" + idx}
                  onContextMenu={(e) => {
                    // Right-click to advance to next slide
                    e.preventDefault();
                    try {
                      swiperRef.current?.slideNext();
                    } catch (err) {
                      // ignore
                    }
                  }}
                >
                  <div className="rounded-xl shadow overflow-hidden bg-transparent mx-2">
                    <div className="relative w-full aspect-[9/16]">
                      {m.type === "image" ? (
                        <Image
                          src={m.src}
                          alt={m.caption || m.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <video
                          src={m.src}
                          className="w-full h-full object-cover"
                          playsInline
                          muted
                          loop
                          autoPlay
                          preload="metadata"
                        />
                      )}
                      {m.caption && (
                        <div className="absolute left-3 right-3 bottom-3 bg-black/40 text-white text-sm px-3 py-1 rounded-md backdrop-blur-sm">
                          {m.caption}
                        </div>
                      )}
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>

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
      
    </Section>
  );
};

export default Hero;
