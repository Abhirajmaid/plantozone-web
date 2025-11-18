import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center px-4 py-20">
        <div className="max-w-2xl w-full text-center">
          {/* 404 Number - Clean and Modern */}
          <div className="mb-12">
            <h1 
              className="text-[120px] sm:text-[140px] md:text-[160px] lg:text-[180px] font-black leading-none text-gray-900 select-none"
              style={{
                fontFamily: 'system-ui, -apple-system, sans-serif',
                letterSpacing: '-0.05em',
                textShadow: '0px 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              404
            </h1>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Oops! Page not Found
          </h2>

          {/* Description */}
          <p className="text-lg sm:text-xl text-gray-600 mb-12 max-w-xl mx-auto leading-relaxed">
            The page you are looking for cannot be found. Take a break before trying again
          </p>

          {/* Call to Action Button */}
          <div className="mb-16">
            <Link href="/">
              <Button 
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold text-lg px-8 py-4 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                size="lg"
              >
                Go To Home Page
              </Button>
            </Link>
          </div>

          {/* Additional helpful links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <Link 
              href="/shop" 
              className="hover:text-gray-900 transition-colors duration-300 font-medium"
            >
              Browse Shop
            </Link>
            <span className="text-gray-300">•</span>
            <Link 
              href="/contact-us" 
              className="hover:text-gray-900 transition-colors duration-300 font-medium"
            >
              Contact Us
            </Link>
            <span className="text-gray-300">•</span>
            <Link 
              href="/faq" 
              className="hover:text-gray-900 transition-colors duration-300 font-medium"
            >
              FAQ
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
