"use client";

import React, { useState, useRef, useEffect } from "react";
import { Container } from "@/src/components/layout/Container";
import { Section } from "@/src/components/layout/Section";
import StatsBar from "@/src/components/common/StatsBar";

const AboutUsSection = () => {
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!showVideo) return;
    const video = videoRef.current;
    if (!video) {
      const t = setTimeout(() => {
        videoRef.current
          ?.play()
          .catch((e) => console.warn("Video play failed:", e));
      }, 200);
      return () => clearTimeout(t);
    }
    const playVideo = () =>
      video.play().catch((e) => console.warn("Video play failed:", e));
    if (video.readyState >= 3) {
      playVideo();
    } else {
      video.addEventListener("canplay", playVideo, { once: true });
      return () => video.removeEventListener("canplay", playVideo);
    }
  }, [showVideo]);

  return (
    <Section className="bg-white py-8 md:py-12 max-w-[90vw] mx-auto lg:py-20">
      <Container>
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-center">
            {/* Left Column - Content */}
            <div className="space-y-6">
              <div>
                <h2 className="text-4xl md:text-6xl font-semibold text-green-800 mb-6">
                  Bringing Nature Closer to Your Doorstep
                </h2>
                <p className="text-gray-600 leading-relaxed text-base">
                  At Plantozone, we are passionate about bringing the beauty of
                  nature into your home. We offer a wide selection of premium
                  indoor and outdoor plants, expert care guidance, and
                  everything you need to create your perfect green space. Our
                  mission is to make plant care easy and enjoyable for everyone.
                </p>
              </div>
            </div>

            {/* Right Column - Statistics */}
            <div className="flex flex-col gap-8 items-center justify-center lg:justify-end">
              <div className="w-full max-w-xl">
                <StatsBar />
              </div>
              <div className="w-full max-w-xl">
                <StatsBar />
              </div>
              <div className="w-full max-w-xl">
                <StatsBar />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default AboutUsSection;
