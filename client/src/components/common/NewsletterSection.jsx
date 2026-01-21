"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // TODO: Replace with actual API call to subscribe email
      // await subscribeToNewsletter(email);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      toast.success("Successfully subscribed to newsletter!", {
        position: "top-right",
        autoClose: 3000,
        icon: (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        ),
      });
      
      setEmail("");
    } catch (error) {
      toast.error("Failed to subscribe. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Newsletter Section */}
      <div className="bg-gray-100 py-8 md:py-12 lg:py-16 mb-4 md:mb-12 lg:mb-16 rounded-2xl mx-4 sm:mx-6">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wide mb-2">
              OUR NEWSLETTER
            </p>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 md:mb-4 px-2">
              Subscribe to Our Newsletter to Get Updates on Our Latest Offers
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-6 md:mb-8 px-2">
              Get 25% off on your first order just by subscribing to our newsletter
            </p>
            
            <form onSubmit={handleSubmit} className="max-w-md mx-auto px-2">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Email Address"
                  className="flex-1 w-full sm:w-auto px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-base"
                  required
                  disabled={isSubmitting}
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-300 disabled:cursor-not-allowed text-black px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap"
                >
                  {isSubmitting ? "Subscribing..." : "Subscribe"}
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
