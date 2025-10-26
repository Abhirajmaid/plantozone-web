"use client";
import React from "react";
import { Container } from "@/src/components/layout/Container";
import { Section } from "@/src/components/layout/Section";
import { NewsletterSection } from "@/src/components";
import { Icon } from "@iconify/react";
import Link from "next/link";

// Hero Section with Breadcrumb
function BlogHero() {
    return (
    <div 
      className="relative py-20 md:py-24 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/breadcrumbbg.png')" }}
    >
      <div className="absolute inset-0 bg-white/70"></div>
      <Container>
        <div className="relative z-10 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Our Blog
          </h1>
          <div className="flex items-center gap-2 text-gray-600">
            <Link href="/" className="hover:text-green-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-800 font-medium">Our Blog</span>
          </div>
        </div>
      </Container>
      </div>
    );
}

const BlogPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section with Breadcrumb */}
      <BlogHero />

      {/* Main Content */}
      <Section className="bg-white py-16">
        <Container>
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-12 text-center">
              Our Latest News & Blogs
            </h2>
            
            {/* Blog Posts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Blog Posts */}
              <div className="lg:col-span-2 space-y-8">
                {/* Blog Post 1 */}
                <article className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="relative">
                    <img 
                      src="/images/plant.png" 
                      alt="Creating Your Own Indoor Jungle"
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-medium">
                        Indoor Plant
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <span className="font-medium">Jenny Alexander</span>
                      <span className="mx-2">•</span>
                      <span>14 October 2024</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                      Creating Your Own Indoor Jungle: A Step-by-Step Guide for Plant Lovers
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
                    </p>
                    <Link href="/blog/creating-indoor-jungle" className="text-blue-600 hover:text-blue-800 font-medium underline">
                      Read More
                    </Link>
                  </div>
                </article>

                {/* Blog Post 2 */}
                <article className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="relative">
                    <img 
                      src="/images/plant.png" 
                      alt="Mastering the Art of Watering"
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-medium">
                        Plant Care
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <span className="font-medium">Jenny Alexander</span>
                      <span className="mx-2">•</span>
                      <span>13 October 2024</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                      Mastering the Art of Watering: How to Keep Your Plants Happy and Thriving
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
                    </p>
                    <Link href="/blog/mastering-watering" className="text-blue-600 hover:text-blue-800 font-medium underline">
                      Read More
                    </Link>
                  </div>
                </article>

                {/* Blog Post 3 */}
                <article className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="relative">
                    <img 
                      src="/images/plant.png" 
                      alt="Understanding Light Requirements"
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-medium">
                        Indoor Plant
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <span className="font-medium">Jenny Alexander</span>
                      <span className="mx-2">•</span>
                      <span>12 October 2024</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                      Understanding Light Requirements: How to Position Your Plants for Optimal Growth
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
                    </p>
                    <Link href="/blog/light-requirements" className="text-blue-600 hover:text-blue-800 font-medium underline">
                      Read More
                    </Link>
          </div>
                </article>

                {/* Blog Post 4 */}
                <article className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="relative">
                    <img 
                      src="/images/plant.png" 
                      alt="Creating a Plant Care Schedule"
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-medium">
                        Indoor Plant
            </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <span className="font-medium">Jenny Alexander</span>
                      <span className="mx-2">•</span>
                      <span>11 October 2024</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                      Creating a Plant Care Schedule: How to Organize Your Watering, Feeding, and Pruning
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
                    </p>
                    <Link href="/blog/plant-care-schedule" className="text-blue-600 hover:text-blue-800 font-medium underline">
                      Read More
                    </Link>
          </div>
                </article>

                {/* Blog Post 5 */}
                <article className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="relative">
                    <img 
                      src="/images/plant.png" 
                      alt="Transforming Small Spaces with Plants"
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-medium">
                        Indoor Plant
            </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <span className="font-medium">Jenny Alexander</span>
                      <span className="mx-2">•</span>
                      <span>10 October 2024</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                      Transforming Small Spaces with Plants: Creative Ideas for Urban Gardening
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
                    </p>
                    <Link href="/blog/small-spaces-gardening" className="text-blue-600 hover:text-blue-800 font-medium underline">
                      Read More
                    </Link>
                  </div>
                </article>

                {/* Pagination */}
                <div className="flex items-center justify-center space-x-2 mt-12">
                  <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button className="w-10 h-10 bg-green-500 text-white rounded-full font-medium">1</button>
                  <button className="w-10 h-10 text-gray-600 hover:bg-gray-100 rounded-full font-medium">2</button>
                  <button className="w-10 h-10 text-gray-600 hover:bg-gray-100 rounded-full font-medium">3</button>
                  <span className="text-gray-400">...</span>
                  <button className="w-10 h-10 text-gray-600 hover:bg-gray-100 rounded-full font-medium">10</button>
                  <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Right Column - Sidebar */}
              <div className="lg:col-span-1 space-y-8">
                {/* Search Section */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Search</h3>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search"
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Popular Category Section */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Popular Category</h3>
                  <ul className="space-y-3">
                    <li>
                      <Link href="/blog/category/indoor-plants" className="text-gray-700 hover:text-green-600 transition-colors">
                        Indoor Plants
                      </Link>
                    </li>
                    <li>
                      <Link href="/blog/category/outdoor-plants" className="text-gray-700 hover:text-green-600 transition-colors">
                        Outdoor Plants
                      </Link>
                    </li>
                    <li>
                      <Link href="/blog/category/flowering-plants" className="text-gray-700 hover:text-green-600 transition-colors">
                        Flowering Plants
                      </Link>
                    </li>
                    <li>
                      <Link href="/blog/category/air-purifying-plants" className="text-gray-700 hover:text-green-600 transition-colors">
                        Air-purifying Plants
                      </Link>
                    </li>
                    <li>
                      <Link href="/blog/category/herbs-edibles" className="text-gray-700 hover:text-green-600 transition-colors">
                        Herbs & Edibles
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Recent Post Section */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Post</h3>
                  <div className="space-y-4">
                    {/* Recent Post 1 */}
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <img 
                          src="/images/plant.png" 
                          alt="How to Choose the Perfect Indoor Plant"
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link href="/blog/choosing-perfect-indoor-plant" className="text-sm font-medium text-gray-900 hover:text-green-600 transition-colors line-clamp-2">
                          How to Choose the Perfect Indoor Plant for Your Space
                        </Link>
                        <p className="text-xs text-gray-500 mt-1">09 October 2024</p>
                      </div>
                    </div>

                    {/* Recent Post 2 */}
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <img 
                          src="/images/plant.png" 
                          alt="Best Plants for Small Apartments"
                          className="w-16 h-16 object-cover rounded-lg"
                    />
                  </div>
                      <div className="flex-1 min-w-0">
                        <Link href="/blog/plants-small-apartments" className="text-sm font-medium text-gray-900 hover:text-green-600 transition-colors line-clamp-2">
                          Best Plants for Small Apartments and Tight Sp...
                        </Link>
                        <p className="text-xs text-gray-500 mt-1">08 October 2024</p>
                      </div>
                    </div>

                    {/* Recent Post 3 */}
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <img 
                          src="/images/plant.png" 
                          alt="Choosing the Right Plants For Your Home"
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                </div>
                      <div className="flex-1 min-w-0">
                        <Link href="/blog/choosing-right-plants-home" className="text-sm font-medium text-gray-900 hover:text-green-600 transition-colors line-clamp-2">
                          Choosing the Right Plants For Your Home: A Room-...
                        </Link>
                        <p className="text-xs text-gray-500 mt-1">07 October 2024</p>
                </div>
              </div>
            </div>
          </div>

                {/* Advertisement Banner */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="relative">
                    <img 
                      src="/images/plant.png" 
                      alt="Summer Sale Advertisement"
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-center p-6">
                      <div className="text-white">
                        <p className="text-sm font-medium mb-2">Summer Sale</p>
                        <h4 className="text-xl font-bold mb-4">25% Off on Best-Selling Indoor Plants!</h4>
                        <button className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors">
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Services Section */}
      <Section className="bg-white py-16">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
            <div className="flex items-center space-x-4 text-center">
              <div className="relative flex-shrink-0">
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-yellow-400 rounded-full"></div>
                <div className="relative z-10 w-12 h-12 flex items-center justify-center">
                  <Icon icon="material-symbols:local-shipping-outline" className="w-8 h-8 text-green-700" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Free Shipping</h3>
                <p className="text-sm text-gray-600">Free shipping for order above ₹2000</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-center">
              <div className="relative flex-shrink-0">
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-yellow-400 rounded-full"></div>
                <div className="relative z-10 w-12 h-12 flex items-center justify-center">
                  <Icon icon="material-symbols:account-balance-wallet-outline" className="w-8 h-8 text-green-700" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Flexible Payment</h3>
                <p className="text-sm text-gray-600">Multiple secure payment options</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-center">
              <div className="relative flex-shrink-0">
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-yellow-400 rounded-full"></div>
                <div className="relative z-10 w-12 h-12 flex items-center justify-center">
                  <Icon icon="material-symbols:headphones" className="w-8 h-8 text-green-700" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">24×7 Support</h3>
                <p className="text-sm text-gray-600">We support online all days.</p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Newsletter Section */}
      <NewsletterSection />
    </div>
  );
};

export default BlogPage;