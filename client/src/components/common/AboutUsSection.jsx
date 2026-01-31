"use client";

import React, { useState, useRef, useEffect } from "react";
import { Container } from "@/src/components/layout/Container";
import { Section } from "@/src/components/layout/Section";
import Image from "next/image";
import StatsBar from "@/src/components/common/StatsBar";
import { Dialog, DialogContent } from "@/src/components/ui/dialog";

const AboutUsSection = () => {
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!showVideo) return;
    const video = videoRef.current;
    if (!video) {
      const t = setTimeout(() => {
        videoRef.current?.play().catch((e) => console.warn("Video play failed:", e));
      }, 200);
      return () => clearTimeout(t);
    }
    const playVideo = () => video.play().catch((e) => console.warn("Video play failed:", e));
    if (video.readyState >= 3) {
      playVideo();
    } else {
      video.addEventListener("canplay", playVideo, { once: true });
      return () => video.removeEventListener("canplay", playVideo);
    }
  }, [showVideo]);

  return (
    <Section className="bg-white py-8 md:py-12 lg:py-16">
      <Container>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-center">
            
            {/* Left Column - Circular Video Image (clickable) */}
            <div className="relative flex justify-center">
              <button
                type="button"
                onClick={() => setShowVideo(true)}
                className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-[450px] lg:h-[450px] mx-auto rounded-full overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 group"
                aria-label="Play video"
              >
                <div className="w-full h-full bg-gray-200 rounded-full overflow-hidden">
                  <Image
                    src="/images/abou-us.jpeg"
                    alt="Plantozone – community and plant gifting"
                    width={450}
                    height={450}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-green-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              </button>
            </div>

            {/* Right Column - Content */}
            <div className="space-y-6">
              <div>
                <p className="text-base text-black font-semibold uppercase tracking-wide mb-2">About Us</p>
                <h2 className="text-4xl md:text-4xl font-semibold text-green-800 mb-6">
                  Bringing Nature Closer to Your Doorstep
                </h2>
                <p className="text-gray-600 leading-relaxed text-base">
                  At Plantozone, we are passionate about bringing the beauty of nature into your home. We offer a wide selection of premium indoor and outdoor plants, expert care guidance, and everything you need to create your perfect green space. Our mission is to make plant care easy and enjoyable for everyone.
                </p>
              </div>

              {/* Statistics Bar – real counts from API, 98% satisfaction */}
              <StatsBar />

            </div>
          </div>
        </div>
      </Container>

      {/* Video Modal */}
      <Dialog open={showVideo} onOpenChange={setShowVideo}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black border-0 gap-0">
          <video
            ref={videoRef}
            src="/plant.mp4"
            controls
            autoPlay
            playsInline
            preload="auto"
            muted
            className="w-full aspect-video"
          >
            Your browser does not support the video tag.
          </video>
        </DialogContent>
      </Dialog>
    </Section>
  );
};

export default AboutUsSection;

