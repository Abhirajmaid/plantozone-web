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
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import plantsAction from "@/src/lib/action/plants.action";
import { addToWishlist } from "@/src/lib/utils/wishlistUtils";
import { Dialog, DialogContent } from "../../ui/dialog";
import { customerMedia } from "@/src/lib/data/customerMedia";

const NO_PREVIEW_IMG = "/images/plant.png";
const STRAPI_BASE_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "https://dashboard.plantozone.com";

const Hero = () => {
  const [allPlants, setAllPlants] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const marqueeRef = useRef(null);
  const frameCounterRef = useRef(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showZoomModal, setShowZoomModal] = useState(false);

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

  // Marquee auto-scroll for customer media (infinite)
  useEffect(() => {
    const el = marqueeRef.current;
    if (!el) return;

    let rafId = null;
    let last = performance.now();
    const pxPerSecond = 60; // speed (px/s)

    const step = (now) => {
      if (!el) return;
      const dt = Math.max(0, now - last);
      last = now;
      // run only if content is wider than container and page is visible
      if (el.scrollWidth > el.clientWidth + 2 && !document.hidden) {
        el.scrollLeft += (pxPerSecond * dt) / 1000;
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft -= el.scrollWidth / 2;
        }
      }
      rafId = requestAnimationFrame(step);
    };

    const start = () => {
      if (!rafId) {
        last = performance.now();
        rafId = requestAnimationFrame(step);
      }
    };
    const stop = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    const onEnter = () => stop();
    const onLeave = () => start();

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("touchstart", onEnter, { passive: true });
    el.addEventListener("touchend", onLeave, { passive: true });

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const ro = new ResizeObserver(() => {
      if (el.scrollWidth > el.clientWidth + 2) start();
    });
    ro.observe(el);

    // initial start
    start();

    // expose simple controls for debugging
    // eslint-disable-next-line no-param-reassign
    el.startMarquee = start;
    // eslint-disable-next-line no-param-reassign
    el.stopMarquee = stop;

    return () => {
      stop();
      ro.disconnect();
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("touchstart", onEnter);
      el.removeEventListener("touchend", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      try {
        // cleanup debug props
        // eslint-disable-next-line no-param-reassign
        delete el.startMarquee;
        // eslint-disable-next-line no-param-reassign
        delete el.stopMarquee;
      } catch (e) {}
    };
  }, [customerMedia]);

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

        {/* Marquee of customer media (infinite scroll) */}
        <div className="w-full mt-8">
          <div
            className="w-full overflow-x-auto hero-marquee"
            ref={marqueeRef}
            style={{ whiteSpace: "nowrap" }}
            aria-label="Customer media carousel"
          >
            <div className="flex gap-4 min-w-max px-4 py-6">
              {[...customerMedia, ...customerMedia, ...customerMedia].map(
                (m, idx) => (
                  <div
                    key={m.id + "-" + idx}
                    className="rounded-xl shadow overflow-hidden flex-shrink-0 w-[220px] sm:w-[240px] md:w-[280px] bg-transparent"
                  >
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
                ),
              )}
            </div>
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
      {/* Hide scrollbars for marquee */}
      <style jsx>{`
        .hero-marquee {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
        .hero-marquee::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
      `}</style>
    </Section>
  );
};

export default Hero;
