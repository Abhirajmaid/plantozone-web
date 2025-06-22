"use client";
import { Section } from "../../layout/Section";

const PageBanner = () => {
  return (
    <Section>
      <div className="relative min-h-[200px] sm:min-h-[300px] md:h-96 mt-[80px] overflow-hidden flex items-center justify-center">
        {/* Vibrant Moving Gradient Background */}
        <div className="absolute inset-0 animate-gradient-move bg-gradient-to-r from-[#16a34a] via-[#a3e635] via-40% to-[#0ea5e9] bg-[length:300%_300%] blur-[1.5px]"></div>
        {/* Optional Overlay */}
        <div className="absolute inset-0 bg-black/10 md:bg-black/20"></div>
        {/* Centered Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full w-full">
          <h1 className="text-white text-3xl md:text-5xl font-bold drop-shadow-lg text-center">
            Welcome to Plantozone
          </h1>
          <p className="mt-3 text-white/90 text-lg md:text-2xl font-medium drop-shadow text-center max-w-2xl">
            Your trusted partner for green living, healthy plants, and a happier
            home.
          </p>
        </div>
      </div>
      <style jsx global>{`
        @keyframes gradient-move {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient-move {
          animation: gradient-move 8s ease-in-out infinite;
        }
      `}</style>
    </Section>
  );
};

export default PageBanner;
