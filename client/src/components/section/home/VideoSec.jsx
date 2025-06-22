"use client";
import React, { useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { Section } from "../../layout/Section";

const VideoSec = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const handlePlayVideo = () => {
    setIsPlaying(true);
  };

  return (
    <Section>
      <div className="flex flex-col items-center justify-center w-full py-10">
        <div className="relative w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-lightGreen/30 mx-auto">
          {!isPlaying ? (
            <>
              <img
                src="/images/video.png"
                alt="Video Thumbnail"
                className="w-full h-[350px] md:h-[500px] object-cover transition-all duration-300"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-black/60 via-black/30 to-transparent">
                <button
                  onClick={handlePlayVideo}
                  className="bg-lightGreen/80 hover:bg-lightGreen text-white rounded-full flex items-center justify-center transition-transform transform hover:scale-110 h-[70px] w-[70px] shadow-lg border-4 border-white/40"
                >
                  <Icon icon="ph:play-fill" className="w-10 h-10" />
                </button>
                <span className="mt-4 text-white text-lg font-semibold drop-shadow-lg">
                  Watch Our Story
                </span>
              </div>
            </>
          ) : (
            <video
              ref={videoRef}
              className="w-full h-[350px] md:h-[500px] object-cover rounded-3xl"
              controls
              autoPlay
            >
              <source src="/plant.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
        <div className="mt-8 max-w-2xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">
            Discover Plantozone
          </h2>
          <p className="text-gray-600 text-base md:text-lg">
            Explore our journey and passion for bringing greenery into your
            life. Watch the video to learn more about our mission and how we
            nurture every plant with care.
          </p>
        </div>
      </div>
    </Section>
  );
};

export default VideoSec;
