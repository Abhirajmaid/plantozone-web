import { Container } from "../../layout/Container";
import { Section } from "../../layout/Section";
import { PrimaryButton, SecondaryButton } from "@/src/components";
import Link from "next/link";
import Image from "next/image";

const Hero = () => {
  return (
    <Section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 min-h-[80vh] flex items-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23374151' fill-opacity='0.1'%3E%3Cpath d='M50 0L60 40L100 50L60 60L50 100L40 60L0 50L40 40L50 0Z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-200/20 to-teal-200/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-slate-200/30 to-gray-300/30 rounded-full blur-2xl"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-br from-blue-100/15 to-indigo-100/15 rounded-full blur-xl"></div>

      {/* Sparkle Elements */}
      <div className="absolute top-20 right-20 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
      <div className="absolute top-32 right-32 w-1 h-1 bg-yellow-300 rounded-full animate-pulse"></div>
      <div className="absolute bottom-32 left-20 w-1 h-1 bg-yellow-400 rounded-full animate-ping"></div>
      <div className="absolute bottom-20 left-32 w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>

      <Container className="relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Content */}
          <div className="flex-1 max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <div className="w-6 h-6 flex items-center justify-center rounded-full bg-green-500/90 text-white">
                {/* leaf */}
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><path d="M5 21c6.627 0 12-5.373 12-12V4a1 1 0 0 0-1-1h-5C4.477 3 1 6.477 1 11v1a9 9 0 0 0 9 9h1a1 1 0 0 0 1-1v-1c0-3.866 3.134-7 7-7h1a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1h-1C12.82 9 9 12.82 9 17v1H8a7 7 0 0 1-7-7v-1c0-3.314 2.686-6 6-6h4v2c0 5.523-4.477 10-10 10v2Z"/></svg>
              </div>
              The Best Online Plant Shop
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              The Ultimate <span className="text-green-700">Plant</span>
              {" "}Shopping Destination
            </h1>

            {/* Description */}
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <PrimaryButton href="/shop">Shop Now</PrimaryButton>
              <SecondaryButton href="/shop">View All Products</SecondaryButton>
            </div>
          </div>

          {/* Right Content - Image with decorative circle */}
          <div className="flex-1 max-w-lg relative">
            <div className="w-[22rem] h-[22rem] sm:w-[26rem] sm:h-[26rem] bg-gradient-to-b from-emerald-100 to-emerald-200 rounded-full shadow-2xl mx-auto relative">
              <div className="absolute inset-3 rounded-full overflow-hidden shadow-xl">
                <Image
                  src="/images/plant.png"
                  alt="Hero visual"
                  fill
                  sizes="(max-width: 768px) 18rem, 26rem"
                  className="object-cover object-center"
                  priority
                />
              </div>

              {/* Floating badges */}
              <div className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white border border-green-500/60 rounded-full px-4 py-2 shadow-lg">
                <div className="flex items-center gap-2 text-sm font-medium text-green-700">
                  <span className="w-6 h-6 rounded-full bg-green-500 text-white grid place-items-center">
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><path d="M3 12h3l3 7 4-14 3 7h4"/></svg>
                  </span>
                  Fast Delivery
                </div>
              </div>

              <div className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white border border-green-500/60 rounded-full px-4 py-2 shadow-lg">
                <div className="flex items-center gap-2 text-sm font-medium text-green-700">
                  <span className="w-6 h-6 rounded-full bg-green-500 text-white grid place-items-center">
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm1 14h-2v-2h2Zm0-4h-2V6h2Z"/></svg>
                  </span>
                  Secure Payment
                </div>
              </div>
            </div>

            {/* Additional sparkle elements */}
            <div className="absolute top-8 right-8 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
            <div className="absolute bottom-8 left-8 w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
            <div className="absolute top-1/2 -left-4 w-1 h-1 bg-yellow-400 rounded-full animate-ping"></div>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default Hero;
