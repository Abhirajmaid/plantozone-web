import React from "react";

const HeroAbout = () => {
  return (
    <div
      className="bg-cover bg-center h-screen"
      style={{ backgroundImage: "url('/path-to-image.jpg')" }}
    >
      <div className="flex items-center justify-center h-full bg-black bg-opacity-50">
        <h1 className="text-white text-5xl font-bold">About Us</h1>
      </div>
    </div>
  );
};

export default HeroAbout;
