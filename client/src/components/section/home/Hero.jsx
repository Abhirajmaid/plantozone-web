import { Container } from "../../layout/Container";
import { Section } from "../../layout/Section";
import { Button } from "../../ui/button";
import Link from "next/link";

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
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              The Best Online Plant Shop
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              The Ultimate Plant{" "}
              <span className="text-green-600">Shopping Destination</span>
            </h1>

            {/* Description */}
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/shop">
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-4 text-lg font-semibold rounded-lg flex items-center gap-2 transition-all duration-300 hover:scale-105">
                  Shop Now
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              </Link>
              <Link href="/shop">
                <Button variant="outline" className="border-2 border-gray-300 text-gray-700 hover:border-gray-400 px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300">
                  View All Products
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Content - Decorative Elements */}
          <div className="flex-1 max-w-lg relative">
            {/* Main decorative circle */}
            <div className="w-80 h-80 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center shadow-2xl relative">
              {/* Plant icon or decorative element */}
              <div className="text-8xl text-green-600">🌱</div>
              
              {/* Floating badges */}
              <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 bg-white border-2 border-green-500 rounded-full px-4 py-2 shadow-lg">
                <div className="flex items-center gap-2 text-sm font-medium text-green-700">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                  Fast delivery
                </div>
              </div>
              
              <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-white border-2 border-green-500 rounded-full px-4 py-2 shadow-lg">
                <div className="flex items-center gap-2 text-sm font-medium text-green-700">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
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
