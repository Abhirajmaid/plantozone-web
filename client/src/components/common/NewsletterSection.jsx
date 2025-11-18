"use client";
import React from "react";

const NewsletterSection = () => {
  return (
    <>
      {/* Newsletter Section */}
      <div className="bg-gray-100 py-16 mb-16 rounded-2xl mx-6">
        <div className="container mx-auto w-[90%] px-4">
          <div className="text-center">
            <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
              OUR NEWSLETTER
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Subscribe to Our Newsletter to Get Updates on Our Latest Offers
            </h2>
            <p className="text-gray-600 mb-8">
              Get 25% off on your first order just by subscribing to our newsletter
            </p>
            
            <form className="max-w-md mx-auto">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter Email Address"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
                <button
                  type="submit"
                  className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewsletterSection;
