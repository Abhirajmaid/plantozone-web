"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { customerMedia as fallbackMedia } from "@/src/lib/data/customerMedia";

const NAV_PREV = "customer-media-gallery-prev";
const NAV_NEXT = "customer-media-gallery-next";

function MediaSlide({ item }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-neutral-200 p-4 text-center text-sm text-gray-600">
        {item.alt || item.caption || "Image unavailable"}
      </div>
    );
  }

  if (item.type === "video") {
    return (
      <video
        src={item.src}
        className="absolute inset-0 w-full h-full object-cover"
        playsInline
        muted
        loop
        autoPlay
        preload="metadata"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <Image
      src={item.src}
      alt={item.alt || item.caption || item.name || "Customer moment"}
      fill
      className="object-cover object-center"
      sizes="(max-width: 640px) 40vw, 22vw"
      unoptimized
      onError={() => setFailed(true)}
    />
  );
}

export default function CustomerMediaGallerySection({ className = "" }) {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const swiperRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/customer-media", { cache: "no-store" });
        const json = await res.json();
        const list = json.data?.length ? json.data : fallbackMedia;
        if (!cancelled) setSlides(list);
      } catch {
        if (!cancelled) setSlides(fallbackMedia);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!loading && slides.length === 0) {
    return null;
  }

  return (
    <section
      className={`w-full bg-[#fff8ef] py-10 md:py-12 ${className}`}
      aria-label="Customer gallery"
    >
      <div className="w-full relative">
        {loading ? (
          <div className="flex gap-4 overflow-hidden px-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="shrink-0 w-[28vw] max-w-[220px] aspect-[9/16] rounded-xl bg-neutral-200 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <>
            <button
              type="button"
              aria-label="Previous"
              className={`${NAV_PREV} absolute left-3 top-1/2 z-20 -translate-y-1/2 bg-green-600 text-white p-2 rounded-full shadow hover:bg-green-700 transition`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next"
              className={`${NAV_NEXT} absolute right-3 top-1/2 z-20 -translate-y-1/2 bg-green-600 text-white p-2 rounded-full shadow hover:bg-green-700 transition`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            <Swiper
              modules={[Navigation, Autoplay]}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              spaceBetween={16}
              loop={slides.length > 2}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              navigation={{
                prevEl: `.${NAV_PREV}`,
                nextEl: `.${NAV_NEXT}`,
              }}
              breakpoints={{
                320: { slidesPerView: 1.3 },
                640: { slidesPerView: 2.2 },
                768: { slidesPerView: 3.2 },
                1024: { slidesPerView: 4.2 },
              }}
              className="py-6"
            >
              {slides.map((item) => (
                <SwiperSlide key={item.id}>
                  <div className="rounded-xl shadow overflow-hidden bg-transparent mx-2">
                    <div className="relative w-full aspect-[9/16]">
                      <MediaSlide item={item} />
                      {item.caption && (
                        <div className="absolute left-3 right-3 bottom-3 z-10 bg-black/40 text-white text-sm px-3 py-1 rounded-md backdrop-blur-sm">
                          <p className="line-clamp-2">{item.caption}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </>
        )}
      </div>
    </section>
  );
}
