"use client";
import React, { useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { Section } from "../layout/Section";

const VideoSec = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const handlePlayVideo = () => {
    console.log(videoRef);
    setIsPlaying(true); // Video plays successfully
  };

  return (
    <Section>
      {/* Thumbnail or video */}
      {!isPlaying ? (
        <div className="relative w-full">
          {/* Thumbnail image (replace with your actual image) */}
          <img
            src="/images/video.png" // Replace with your uploaded image path
            alt="Video Thumbnail"
            className="w-full h-[700px] object-cover"
          />

          {/* Play button overlay */}
          <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-40">
            <button
              onClick={handlePlayVideo}
              className="bg-black rounded-full flex items-center justify-center bg-opacity-20 backdrop-blur-sm transition-transform transform h-[90px] hover:scale-110 w-[90px] border border-mediumGray/40"
            >
              <Icon icon="ph:play-fill" className="text-white w-8 h-8" />
            </button>
          </div>
        </div>
      ) : (
        <video
          ref={videoRef}
          className="w-full h-[700px] object-cover"
          controls
          autoPlay={true}
        >
          <source src="/plant.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </Section>
  );
};

export default VideoSec;
