"use client";
import React from "react";
import { Container } from "@/src/components/layout/Container";
import { Section } from "@/src/components/layout/Section";
import { NewsletterSection, ShopServiceSection } from "@/src/components";
import Link from "next/link";

// Related Blogs Data
const relatedBlogsData = [
  {
    id: 1,
    title: "How to Style Plants in Every Room of Your Home",
    slug: "style-plants-every-room",
    excerpt: "Discover creative ways to incorporate plants into every space of your home, from living rooms to bathrooms.",
    image: "/images/plant.png",
    category: "Indoor Plant",
    author: "Jenny Alexander",
    date: "08 October 2024",
    readTime: "6 min read"
  },
  {
    id: 2,
    title: "Essential Plant Care Tips for Beginners",
    slug: "plant-care-tips-beginners",
    excerpt: "Learn the fundamental principles of plant care that every beginner should know to keep their plants thriving.",
    image: "/images/plant.png",
    category: "Plant Care",
    author: "Jenny Alexander",
    date: "05 October 2024",
    readTime: "8 min read"
  },
  {
    id: 3,
    title: "Creating a Sustainable Indoor Garden",
    slug: "sustainable-indoor-garden",
    excerpt: "Build an eco-friendly indoor garden using sustainable practices and environmentally conscious plant choices.",
    image: "/images/plant.png",
    category: "Sustainability",
    author: "Jenny Alexander",
    date: "02 October 2024",
    readTime: "7 min read"
  },
  {
    id: 4,
    title: "The Complete Guide to Air-Purifying Plants",
    slug: "air-purifying-plants-guide",
    excerpt: "Explore the best air-purifying plants for your home and learn how they can improve your indoor air quality.",
    image: "/images/air_purifying.jpg",
    category: "Air Purifying",
    author: "Sarah Green",
    date: "01 October 2024",
    readTime: "9 min read"
  },
  {
    id: 5,
    title: "Seasonal Plant Care: Adapting Your Garden",
    slug: "seasonal-plant-care-guide",
    excerpt: "Learn how to adjust your plant care routine throughout the seasons for optimal plant health year-round.",
    image: "/images/plant.png",
    category: "Plant Care",
    author: "Mike Thompson",
    date: "28 September 2024",
    readTime: "10 min read"
  },
  {
    id: 6,
    title: "Propagation Techniques: Growing New Plants",
    slug: "plant-propagation-techniques",
    excerpt: "Master different plant propagation methods to expand your collection and share plants with friends.",
    image: "/images/plant.png",
    category: "Plant Care",
    author: "Emma Wilson",
    date: "25 September 2024",
    readTime: "12 min read"
  }
];

// Hero Section with Breadcrumb
function BlogDetailHero() {
  return (
    <div 
      className="relative py-20 md:py-24 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/breadcrumbbg.png')" }}
    >
      <div className="absolute inset-0 bg-white/70"></div>
      <Container>
        <div className="relative z-10 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Blog Details
          </h1>
          <div className="flex items-center gap-2 text-gray-600">
            <Link href="/" className="hover:text-green-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-800 font-medium">Blog Details</span>
          </div>
        </div>
      </Container>
    </div>
  );
}

const BlogDetailPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section with Breadcrumb */}
      <BlogDetailHero />

      {/* Main Content */}
      <Section className="bg-white py-16 lg:overflow-visible">
        <Container>
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8">
              
              {/* Main Blog Content - Left Column (2/3 width) */}
              <div className="lg:w-2/3">
                
                {/* Blog Hero Image */}
                <div className="mb-8">
                  <div className="relative overflow-hidden rounded-2xl">
                    <img 
                      src="/images/plant.png" 
                      alt="Creating Your Own Indoor Jungle"
                      className="w-full h-96 object-cover"
                    />
                  </div>
                </div>

                {/* Blog Category Tag */}
                <div className="mb-4">
                  <span className="inline-block bg-yellow-400 text-gray-800 px-4 py-2 rounded-full text-sm font-medium">
                    Indoor Plant
                  </span>
                </div>

                {/* Blog Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                  Creating Your Own Indoor Jungle: A Step-by-Step Guide for Plant Lovers
                </h1>

                {/* Author Info */}
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 font-semibold text-sm">JA</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Written by Jenny Alexander</p>
                      <p className="text-sm text-gray-600">14 October 2024 | 12 min Read</p>
                    </div>
                  </div>
                </div>

                {/* Share Buttons */}
                <div className="flex items-start gap-6 mb-8">
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">SHARE</span>
                    <div className="flex flex-col gap-2">
                      <button className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                        </svg>
                      </button>
                      <button className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center text-white hover:bg-blue-900 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                        </svg>
                      </button>
                      <button className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center text-white hover:bg-pink-700 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                        </svg>
                      </button>
                      <button className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-700 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 8.16c-.169 1.858-.896 3.46-2.189 4.66-1.293 1.2-2.87 1.858-4.379 1.858-1.509 0-3.086-.658-4.379-1.858-1.293-1.2-2.02-2.802-2.189-4.66-.169-1.858.169-3.46 1.293-4.66 1.124-1.2 2.701-1.858 4.379-1.858s3.255.658 4.379 1.858c1.124 1.2 1.462 2.802 1.293 4.66z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  {/* Article Content */}
                  <div className="flex-1">
                    <div className="prose prose-lg max-w-none">
                      <div className="text-gray-600 leading-relaxed">
                        <p className="text-xl mb-6">
                          <span className="text-6xl font-bold text-green-600 float-left mr-3 leading-none">L</span>
                          orem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                        
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Benefits of surrounding yourself with plants</h2>
                        <p className="mb-6">
                          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Identifying the best locations for your plants</h2>
                        <p className="mb-6">
                          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                        </p>

                        {/* Article Image */}
                        <div className="my-8">
                          <img 
                            src="/images/plant.png" 
                            alt="Woman potting a plant"
                            className="w-full h-64 object-cover rounded-2xl"
                          />
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Incorporate Plant Stands and Shelves</h2>
                        <p className="mb-6">
                          Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                        </p>

                        {/* Also Read Box */}
                        <div className="bg-green-800 rounded-2xl p-6 my-8">
                          <h3 className="text-white font-bold mb-3">Also Read:</h3>
                          <ul className="text-white">
                            <li className="flex items-center gap-2">
                              <span className="w-2 h-2 bg-white rounded-full"></span>
                              <span>How to Care for Your Plants During Different Seasons</span>
                            </li>
                          </ul>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Main Focus Points for Your Indoor Jungle</h2>
                        <p className="mb-8">
                          At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi.
                        </p>

                        {/* Numbered Points */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                          <div className="bg-gray-50 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-3">
                              <span className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-gray-800 font-bold text-sm">01</span>
                              <h3 className="font-bold text-gray-900">Air Quality</h3>
                            </div>
                            <p className="text-sm text-gray-600">Plants naturally purify the air by removing toxins and releasing oxygen.</p>
                          </div>
                          <div className="bg-gray-50 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-3">
                              <span className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-gray-800 font-bold text-sm">02</span>
                              <h3 className="font-bold text-gray-900">Aesthetic Appeal</h3>
                            </div>
                            <p className="text-sm text-gray-600">Plants add natural beauty and create a calming atmosphere.</p>
                          </div>
                          <div className="bg-gray-50 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-3">
                              <span className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-gray-800 font-bold text-sm">03</span>
                              <h3 className="font-bold text-gray-900">Humidity Control</h3>
                            </div>
                            <p className="text-sm text-gray-600">Plants help maintain optimal humidity levels in your home.</p>
                          </div>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Key benefits of creating an indoor jungle</h2>
                        <div className="space-y-4 mb-8">
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <p className="text-gray-600">Improved air quality and reduced stress levels</p>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <p className="text-gray-600">Enhanced productivity and focus in your workspace</p>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <p className="text-gray-600">Natural humidity regulation and temperature control</p>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <p className="text-gray-600">Beautiful, Instagram-worthy home decor</p>
                          </div>
                        </div>

                        {/* Author Bio */}
                        <div className="bg-green-800 rounded-2xl p-6 mt-8">
                          <div className="flex items-start gap-4">
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-gray-600 font-semibold">JA</span>
                            </div>
                            <div>
                              <h3 className="text-white font-bold text-lg mb-2">Jenny Alexander</h3>
                              <p className="text-gray-200 leading-relaxed">
                                Jenny is a passionate plant enthusiast and interior designer with over 10 years of experience in creating beautiful indoor gardens. She specializes in helping people transform their homes into lush, green sanctuaries.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Sidebar - Right Column (1/3 width) */}
              <div className="lg:w-1/3 lg:sticky lg:top-36 lg:self-start">
                <div className="space-y-6">
                  
                  {/* Filter by Categories */}
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Filter by Categories</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <button className="bg-gray-100 hover:bg-green-100 text-gray-700 hover:text-green-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                        Indoor Plants
                      </button>
                      <button className="bg-gray-100 hover:bg-green-100 text-gray-700 hover:text-green-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                        Outdoor Plants
                      </button>
                      <button className="bg-gray-100 hover:bg-green-100 text-gray-700 hover:text-green-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                        Plant Care & Accessories
                      </button>
                      <button className="bg-gray-100 hover:bg-green-100 text-gray-700 hover:text-green-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                        Seeds
                      </button>
                      <button className="bg-gray-100 hover:bg-green-100 text-gray-700 hover:text-green-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                        New Arrivals
                      </button>
                      <button className="bg-gray-100 hover:bg-green-100 text-gray-700 hover:text-green-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                        Flowering Plants
                      </button>
                      <button className="bg-gray-100 hover:bg-green-100 text-gray-700 hover:text-green-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                        Gifts & Bundles
                      </button>
                      <button className="bg-gray-100 hover:bg-green-100 text-gray-700 hover:text-green-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                        Air-Purifying Plants
                      </button>
                    </div>
                  </div>

                  {/* Table of Content */}
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Table of Content</h3>
                    <div className="space-y-2">
                      <a href="#benefits" className="block text-sm text-gray-600 hover:text-green-600 transition-colors py-1">
                        Benefits of surrounding yourself with plants
                      </a>
                      <a href="#locations" className="block text-sm text-gray-600 hover:text-green-600 transition-colors py-1">
                        Identifying the best locations for your plants
                      </a>
                      <a href="#stands" className="block text-sm text-gray-600 hover:text-green-600 transition-colors py-1">
                        Incorporate Plant Stands and Shelves
                      </a>
                      <a href="#focus" className="block text-sm text-gray-600 hover:text-green-600 transition-colors py-1">
                        Main Focus Points for Your Indoor Jungle
                      </a>
                      <a href="#key-benefits" className="block text-sm text-gray-600 hover:text-green-600 transition-colors py-1">
                        Key benefits of creating an indoor jungle
                      </a>
                    </div>
                  </div>

                  {/* Summer Sale Advertisement */}
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="relative">
                      <img 
                        src="/images/plant.png" 
                        alt="Summer Sale"
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-yellow-400 text-gray-800 px-3 py-1 rounded-full text-sm font-bold">
                          Summer Sale
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                        <h3 className="text-white font-bold text-lg mb-3">
                          25% Off on Best-Selling Indoor Plants!
                        </h3>
                        <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 px-6 py-2 rounded-lg font-semibold transition-colors">
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

      {/* Related News & Blogs Section */}
      <Section className="bg-gray-50 py-16">
        <Container>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">Related News & Blogs</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Latest Related News & Blogs
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedBlogsData.slice(0, 3).map((blog) => (
                <div key={blog.id} className="rounded-2xl  overflow-hidden ">
                  <div className="relative">
                    <img 
                      src={blog.image} 
                      alt={blog.title}
                      className="w-full h-48 object-cover rounded-2xl"
                    />
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-yellow-400 text-gray-800 px-3 py-1 rounded-full text-sm font-bold">
                        {blog.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 pl-0">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm text-gray-600">{blog.author}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-sm text-gray-600">{blog.date}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-sm text-gray-600">{blog.readTime}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                      {blog.excerpt}
                    </p>
                    <Link href={`/blog/${blog.slug}`} className="text-green-600 hover:text-green-700 font-medium">
                      Read More
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Services Section */}
      <ShopServiceSection />

      {/* Newsletter Section - Exact same as cart/shop page */}
      <NewsletterSection />
    </div>
  );
};

export default BlogDetailPage;