"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
} from "@/src/components/ui/dialog";

export default function AboutUsVideoSection() {
  const [open, setOpen] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!open) return;
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
  }, [open]);

  return (
    <>
      <div className="relative order-2 lg:order-1">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="relative w-full max-w-[300px] sm:max-w-[400px] md:max-w-[450px] lg:max-w-[550px] h-[300px] sm:h-[400px] md:h-[450px] lg:h-[550px] mx-auto block rounded-full overflow-hidden bg-gray-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 group"
          aria-label="Play video"
        >
          <Image
            src="/images/abou-us.jpeg"
            alt="Plantozone – community and plant gifting"
            width={550}
            height={550}
            className="w-full h-full object-cover"
          />
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white/90 group-hover:bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <svg
                className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-green-600 ml-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
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
    </>
  );
}
