import React from "react";
import { Container } from "@/src/components/layout/Container";
import { Section } from "@/src/components/layout/Section";
import Image from "next/image";

const AboutUsSection = () => {
  return (
    <Section className="bg-white py-8 md:py-12 lg:py-16">
      <Container>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-center">
            
            {/* Left Column - Circular Video Image */}
            <div className="relative">
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-[450px] lg:h-[450px] mx-auto">
                <div className="w-full h-full bg-gray-200 rounded-full overflow-hidden">
                  <Image
                    src="/images/plant.png"
                    alt="About Us Video"
                    width={400}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-green-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              </div>
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

              {/* Statistics Bar */}
              <div className="bg-green-800 rounded-2xl p-6">
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-3xl text-secondary font-bold text-white mb-1">20+</div>
                    <div className="text-green-200 text-sm">Collections</div>
                  </div>
                  <div>
                    <div className="text-3xl text-secondary font-bold text-white mb-1">6000+</div>
                    <div className="text-green-200 text-sm">Products</div>
                  </div>
                  <div>
                    <div className="text-3xl text-secondary font-bold text-white mb-1">99%</div>
                    <div className="text-green-200 text-sm">Satisfied Customers</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default AboutUsSection;

