"use client";
import React, { useState, useEffect } from "react";
import { Section } from "../../layout/Section";
import { Container } from "../../layout/Container";
import { PrimaryButton } from "@/src/components";
import Link from "next/link";
import Image from "next/image";

const SpecialOffer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 4,
    hours: 14,
    minutes: 48,
    seconds: 18
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Section className="bg-gray-50 py-12 md:py-16">
      <Container>
        <div className="flex flex-col lg:flex-row items-stretch gap-8 lg:gap-12">
          {/* Left: Promotional Area */}
          <div className="flex-1 w-full lg:w-1/2 bg-white rounded-2xl p-8 md:p-12 relative overflow-hidden h-[360px] md:h-[420px] lg:h-[460px]">
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src="/images/air_purifying.jpg"
                alt="Nature's Special Offer Background"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Overlay for text readability */}
              <div className="absolute inset-0 bg-white/70"></div>
            </div>
            
            {/* Subtle Leaf Pattern Background */}
            <div className="absolute inset-0 opacity-[0.02]" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
            }}></div>

            {/* Decorative Monstera Leaf - Top Left */}
            <div className="absolute top-4 left-4 opacity-20">
              <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 10 C40 10, 30 15, 25 20 C20 25, 15 35, 15 45 C15 55, 20 65, 30 75 C35 80, 40 85, 50 90 C60 85, 65 80, 70 75 C80 65, 85 55, 85 45 C85 35, 80 25, 75 20 C70 15, 60 10, 50 10 Z" fill="#0b9c09"/>
                <path d="M50 10 C45 10, 35 12, 28 18 C25 21, 18 28, 18 40 C18 50, 22 58, 28 65 C32 69, 38 73, 50 78 C62 73, 68 69, 72 65 C78 58, 82 50, 82 40 C82 28, 75 21, 72 18 C65 12, 55 10, 50 10 Z" fill="#0b9c09" opacity="0.6"/>
              </svg>
            </div>

            {/* Decorative Monstera Leaf - Bottom Right */}
            <div className="absolute bottom-4 right-4 opacity-20">
              <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 10 C40 10, 30 15, 25 20 C20 25, 15 35, 15 45 C15 55, 20 65, 30 75 C35 80, 40 85, 50 90 C60 85, 65 80, 70 75 C80 65, 85 55, 85 45 C85 35, 80 25, 75 20 C70 15, 60 10, 50 10 Z" fill="#0b9c09"/>
                <path d="M50 10 C45 10, 35 12, 28 18 C25 21, 18 28, 18 40 C18 50, 22 58, 28 65 C32 69, 38 73, 50 78 C62 73, 68 69, 72 65 C78 58, 82 50, 82 40 C82 28, 75 21, 72 18 C65 12, 55 10, 50 10 Z" fill="#0b9c09" opacity="0.6"/>
              </svg>
            </div>

            <div className="relative z-10">
              {/* Title */}
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                Nature's <span className="text-primary">Special Offer</span>
              </h2>
              
              {/* Subtitle */}
              <p className="text-base md:text-lg text-gray-700 mb-8 mt-2">
                Get 50% off - Limited Time Offer!
              </p>
              
              {/* Countdown Timer */}
              <div className="flex items-center justify-start gap-3 md:gap-4 mb-8">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                    {timeLeft.days.toString().padStart(2, '0')}
                  </div>
                  <div className="text-xs md:text-sm text-gray-600 mt-1">Days</div>
                </div>
                <div className="text-2xl md:text-3xl text-gray-400">:</div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                    {timeLeft.hours.toString().padStart(2, '0')}
                  </div>
                  <div className="text-xs md:text-sm text-gray-600 mt-1">Hours</div>
                </div>
                <div className="text-2xl md:text-3xl text-gray-400">:</div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                    {timeLeft.minutes.toString().padStart(2, '0')}
                  </div>
                  <div className="text-xs md:text-sm text-gray-600 mt-1">Minutes</div>
                </div>
                <div className="text-2xl md:text-3xl text-gray-400">:</div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                    {timeLeft.seconds.toString().padStart(2, '0')}
                  </div>
                  <div className="text-xs md:text-sm text-gray-600 mt-1">Secounds</div>
                </div>
              </div>

              {/* CTA Button */}
              <PrimaryButton href="/shop" className="w-fit">Shop Now</PrimaryButton>
            </div>
          </div>

          {/* Right: Two Horizontal Image Cards */}
          <div className="flex-1 w-full lg:w-1/2 flex flex-row gap-4 items-stretch">
            {/* Left Card */}
            <div className="relative rounded-2xl overflow-hidden shadow-lg bg-gray-100 flex-1 h-[360px] md:h-[420px] lg:h-[460px]">
              <Image
                src="/images/plant.png"
                alt="Greenhouse Care"
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />
            </div>

            {/* Right Card */}
            <div className="relative rounded-2xl overflow-hidden shadow-lg bg-gray-100 flex-1 h-[360px] md:h-[420px] lg:h-[460px]">
              <Image
                src="/images/plant.png"
                alt="Plant Care"
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default SpecialOffer;
