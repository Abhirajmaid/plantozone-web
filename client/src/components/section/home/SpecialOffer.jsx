"use client";
import React, { useState, useEffect } from "react";
import { Section } from "../../layout/Section";
import { Container } from "../../layout/Container";
import { Button } from "../../ui/button";
import Link from "next/link";

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
    <Section className="bg-gray-100">
      <Container>
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Special Offer Banner */}
          <div className="flex-1 bg-gray-200 rounded-2xl p-8 relative overflow-hidden">
            {/* Decorative Monstera Leaves */}
            <div className="absolute top-4 left-4 text-green-600 opacity-20">
              <svg width="60" height="60" viewBox="0 0 100 100" fill="currentColor">
                <path d="M50 10 L60 30 L80 40 L60 50 L50 70 L40 50 L20 40 L40 30 Z" />
              </svg>
            </div>
            <div className="absolute bottom-4 right-4 text-green-600 opacity-20">
              <svg width="40" height="40" viewBox="0 0 100 100" fill="currentColor">
                <path d="M50 10 L60 30 L80 40 L60 50 L50 70 L40 50 L20 40 L40 30 Z" />
              </svg>
            </div>

            <div className="relative z-10 text-center">
              <h2 className="text-3xl font-bold text-green-600 mb-2">Nature's Special Offer</h2>
              <p className="text-lg text-gray-600 mb-6">Get 50% off - Limited Time Offer!</p>
              
              {/* Countdown Timer */}
              <div className="flex justify-center items-center gap-4 mb-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-800">
                    {timeLeft.days.toString().padStart(2, '0')}
                  </div>
                  <div className="text-sm text-gray-600">Days</div>
                </div>
                <div className="text-2xl text-gray-400">:</div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-800">
                    {timeLeft.hours.toString().padStart(2, '0')}
                  </div>
                  <div className="text-sm text-gray-600">Hours</div>
                </div>
                <div className="text-2xl text-gray-400">:</div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-800">
                    {timeLeft.minutes.toString().padStart(2, '0')}
                  </div>
                  <div className="text-sm text-gray-600">Minutes</div>
                </div>
                <div className="text-2xl text-gray-400">:</div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-800">
                    {timeLeft.seconds.toString().padStart(2, '0')}
                  </div>
                  <div className="text-sm text-gray-600">Seconds</div>
                </div>
              </div>

              {/* CTA Button */}
              <Link href="/shop">
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-4 text-lg font-semibold rounded-lg flex items-center gap-2 transition-all duration-300 hover:scale-105">
                  Shop Now
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              </Link>
            </div>
          </div>

          {/* Lifestyle Images */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Left Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-lg">
              <div className="aspect-[3/4] bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🌱</div>
                  <div className="text-green-600 font-semibold">Greenhouse Care</div>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-lg">
              <div className="aspect-[3/4] bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🌿</div>
                  <div className="text-green-600 font-semibold">Plant Care</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default SpecialOffer;
