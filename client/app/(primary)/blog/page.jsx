"use client";
import React, { useEffect, useState, Suspense } from "react";
import { Container } from "@/src/components/layout/Container";
import { Section } from "@/src/components/layout/Section";
import { NewsletterSection, ShopServiceSection, Loader } from "@/src/components";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import PrimaryButton from "@/src/components/common/PrimaryButton";
import Image from "next/image";
import blogsAction from "@/src/lib/action/blogs.action";
import categoriesAction from "@/src/lib/action/categories.action";

const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "https://dashboard.plantozone.com";
const DEFAULT_IMAGE = "/images/plant.png";

// Blog Data Structure (fallback)
const blogData = [
  {
    id: 1,
    title: "Creating Your Own Indoor Jungle: A Step-by-Step Guide for Plant Lovers",
    slug: "creating-indoor-jungle",
    excerpt: "Transform your living space into a lush indoor jungle with our comprehensive guide. Learn about plant selection, placement strategies, and maintenance tips to create your perfect green sanctuary.",
    image: "/images/plant.png",
    category: "Indoor Plant",
    author: "Jenny Alexander",
    date: "14 October 2024",
    readTime: "5 min read",
    featured: true
  },
  {
    id: 2,
    title: "Mastering the Art of Watering: How to Keep Your Plants Happy and Thriving",
    slug: "mastering-watering",
    excerpt: "Discover the secrets to proper plant watering techniques. Learn about different watering methods, signs of overwatering and underwatering, and how to create the perfect watering schedule for your plants.",
    image: "/images/plant.png",
    category: "Plant Care",
    author: "Jenny Alexander",
    date: "13 October 2024",
    readTime: "4 min read",
    featured: true
  },
  {
    id: 3,
    title: "Understanding Light Requirements: How to Position Your Plants for Optimal Growth",
    slug: "light-requirements",
    excerpt: "Learn how to identify and provide the right amount of light for your plants. From low-light tolerant species to sun-loving varieties, master the art of plant lighting for healthy growth.",
    image: "/images/plant.png",
    category: "Indoor Plant",
    author: "Jenny Alexander",
    date: "12 October 2024",
    readTime: "6 min read",
    featured: true
  },
  {
    id: 4,
    title: "Creating a Plant Care Schedule: How to Organize Your Watering, Feeding, and Pruning",
    slug: "plant-care-schedule",
    excerpt: "Stay organized with your plant care routine. Learn how to create effective schedules for watering, fertilizing, pruning, and other essential plant maintenance tasks.",
    image: "/images/plant.png",
    category: "Indoor Plant",
    author: "Jenny Alexander",
    date: "11 October 2024",
    readTime: "7 min read",
    featured: true
  },
  {
    id: 5,
    title: "Transforming Small Spaces with Plants: Creative Ideas for Urban Gardening",
    slug: "small-spaces-gardening",
    excerpt: "Maximize your small space with creative plant arrangements. Discover vertical gardening techniques, space-saving planters, and compact plant varieties perfect for urban living.",
    image: "/images/plant.png",
    category: "Indoor Plant",
    author: "Jenny Alexander",
    date: "10 October 2024",
    readTime: "5 min read",
    featured: true
  },
  {
    id: 6,
    title: "The Complete Guide to Air-Purifying Plants: Breathe Cleaner Air Naturally",
    slug: "air-purifying-plants-guide",
    excerpt: "Explore the best air-purifying plants for your home and office. Learn about their benefits, care requirements, and how they can improve your indoor air quality naturally.",
    image: "/images/air_purifying.jpg",
    category: "Air Purifying",
    author: "Sarah Green",
    date: "09 October 2024",
    readTime: "6 min read",
    featured: false
  },
  {
    id: 7,
    title: "Seasonal Plant Care: Adapting Your Garden to Weather Changes",
    slug: "seasonal-plant-care",
    excerpt: "Learn how to adjust your plant care routine throughout the seasons. From winter dormancy to summer growth spurts, keep your plants healthy year-round.",
    image: "/images/plant.png",
    category: "Plant Care",
    author: "Mike Thompson",
    date: "08 October 2024",
    readTime: "8 min read",
    featured: false
  },
  {
    id: 8,
    title: "Propagation Techniques: Growing New Plants from Cuttings",
    slug: "plant-propagation-guide",
    excerpt: "Master the art of plant propagation with our comprehensive guide. Learn different techniques for growing new plants from cuttings, seeds, and divisions.",
    image: "/images/plant.png",
    category: "Plant Care",
    author: "Emma Wilson",
    date: "07 October 2024",
    readTime: "9 min read",
    featured: false
  }
];

// Recent Posts Data
const recentPostsData = [
  {
    id: 1,
    title: "How to Choose the Perfect Indoor Plant for Your Space",
    slug: "choosing-perfect-indoor-plant",
    image: "/images/plant.png",
    date: "09 October 2024"
  },
  {
    id: 2,
    title: "Best Plants for Small Apartments and Tight Spaces",
    slug: "plants-small-apartments",
    image: "/images/plant.png",
    date: "08 October 2024"
  },
  {
    id: 3,
    title: "Choosing the Right Plants For Your Home: A Room-by-Room Guide",
    slug: "choosing-right-plants-home",
    image: "/images/plant.png",
    date: "07 October 2024"
  }
];

// Categories Data
const categoriesData = [
  { name: "Indoor Plants", slug: "indoor-plants", count: 15 },
  { name: "Outdoor Plants", slug: "outdoor-plants", count: 12 },
  { name: "Flowering Plants", slug: "flowering-plants", count: 8 },
  { name: "Air-purifying Plants", slug: "air-purifying-plants", count: 10 },
  { name: "Herbs & Edibles", slug: "herbs-edibles", count: 6 }
];

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

// Component that uses useSearchParams - needs to be wrapped in Suspense
const BlogContent = () => {
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category");
  
  const [allBlogs, setAllBlogs] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 6;

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, []);

  // Filter blogs when category changes
  useEffect(() => {
    if (selectedCategory) {
      const filtered = allBlogs.filter((blog) => {
        const category = blog?.attributes?.category || "";
        return category.toLowerCase() === selectedCategory.toLowerCase();
      });
      setBlogs(filtered);
      setCurrentPage(1); // Reset to first page when filtering
    } else {
      setBlogs(allBlogs);
    }
  }, [selectedCategory, allBlogs]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await blogsAction.getBlogs();
      const allBlogs = response?.data?.data || [];
      
      // Filter out incomplete blogs
      const completeBlogs = allBlogs.filter((blog) => {
        const attrs = blog?.attributes || {};
        return (
          attrs?.title &&
          attrs?.title.trim() !== "" &&
          attrs?.title.toLowerCase() !== "duymmy" &&
          attrs?.description &&
          attrs?.description.trim() !== "" &&
          attrs?.date &&
          attrs?.slug
        );
      });

      setAllBlogs(completeBlogs);
      // Set recent posts (latest 3)
      setRecentPosts(completeBlogs.slice(0, 3));
      // Reset to first page when blogs are fetched
      setCurrentPage(1);
      
      // Apply category filter if selected
      if (selectedCategory) {
        const filtered = completeBlogs.filter((blog) => {
          const category = blog?.attributes?.category || "";
          return category.toLowerCase() === selectedCategory.toLowerCase();
        });
        setBlogs(filtered);
      } else {
        setBlogs(completeBlogs);
      }
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError("Failed to load blogs. Please try again later.");
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const dateObj = new Date(dateString);
      if (!isNaN(dateObj.getTime())) {
        return dateObj.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        });
      }
    } catch (e) {
      return "";
    }
    return "";
  };

  // Calculate read time
  const calculateReadTime = (description) => {
    if (!description) return "5 min read";
    const wordCount = description.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);
    return `${readTime} min read`;
  };

  // Get image URL
  const getImageUrl = (imageData) => {
    if (!imageData?.data?.attributes?.url) return DEFAULT_IMAGE;
    const url = imageData.data.attributes.url;
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `${STRAPI_BASE_URL}${url}`;
  };

  // Get excerpt
  const getExcerpt = (text, maxLength = 200) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  };

  // Fetch categories from Strapi
  const fetchCategories = async () => {
    try {
      const response = await categoriesAction.getCategories();
      const categoriesData = response?.data?.data || [];
      
      // Map Strapi categories to the format needed for display
      const mappedCategories = categoriesData
        .map((cat) => {
          const title = cat.attributes?.title || "";
          const slug = cat.attributes?.slug || title.toLowerCase().replace(/\s+/g, '-');
          
          // Count plants in this category (if available)
          const plantsCount = cat.attributes?.plants?.data?.length || 0;
          
          return {
            id: cat.id,
            name: title,
            slug: slug,
            count: plantsCount
          };
        })
        .filter(cat => cat.name) // Filter out categories without names
        .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically
      
      setCategories(mappedCategories);
    } catch (err) {
      console.error("Error fetching categories:", err);
      // Don't set error state here, just log it - categories are not critical for blog page
      setCategories([]);
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(blogs.length / blogsPerPage);
  const startIndex = (currentPage - 1) * blogsPerPage;
  const endIndex = startIndex + blogsPerPage;
  const currentBlogs = blogs.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('...');
      }
      
      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      
      // Always show last page
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (loading) {
    return (
      <>
        <BlogHero />
        <div className="flex items-center justify-center py-20">
          <Loader />
        </div>
      </>
    );
  }

  return (
    <>
      {/* Hero Section with Breadcrumb */}
      <BlogHero />

      {/* Main Content */}
      <Section className="bg-white py-16 lg:overflow-visible">
        <Container>
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-green-800">
                Our Latest News & Blogs
              </h2>
              {selectedCategory && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Filtered by: <strong>{selectedCategory}</strong></span>
                  <Link 
                    href="/blog" 
                    className="text-green-600 hover:text-green-700 underline text-sm"
                  >
                    Clear filter
                  </Link>
                </div>
              )}
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8">
                {error}
              </div>
            )}

            {/* Blog Posts Grid */}
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Column - Blog Posts */}
              <div className="lg:w-2/3 space-y-8">
                {blogs.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600 text-lg">No blog posts available at the moment.</p>
                  </div>
                ) : (
                  currentBlogs.map((blog) => {
                    const attributes = blog?.attributes || {};
                    const imageUrl = getImageUrl(attributes?.image);
                    const authorName = attributes?.author?.data?.attributes?.name || "Jenny Alexander";
                    const category = attributes?.category || "Indoor Plant";
                    const dateStr = formatDate(attributes?.date);
                    const readTime = calculateReadTime(attributes?.description);
                    const excerpt = getExcerpt(attributes?.description);
                    const isExternalImage = imageUrl.startsWith('http');

                    return (
                      <article key={blog.id} className="bg-white rounded-2xl overflow-hidden transition-shadow duration-300">
                        <div className="relative">
                          <Image
                            src={imageUrl}
                            alt={attributes?.title || "Blog post"}
                            width={800}
                            height={400}
                            className="w-full h-[400px] object-cover rounded-3xl"
                            unoptimized={isExternalImage}
                          />
                          <div className="absolute bottom-4 left-4">
                            <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-medium">
                              {category}
                            </span>
                          </div>
                        </div>
                        <div className="p-6 pl-0">
                          <div className="flex items-center text-base text-gray-600 mb-3">
                            <span className="font-medium">{authorName}</span>
                            <span className="mx-2">•</span>
                            <span>{dateStr}</span>
                            <span className="mx-2">•</span>
                            <span>{readTime}</span>
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
                            {attributes?.title}
                          </h3>
                          <p className="text-gray-600 mb-4 leading-relaxed">
                            {excerpt}
                          </p>
                          <Link href={`/blog/${attributes?.slug}`} className="text-primary hover:text-primary/80 font-medium underline">
                            Read More
                          </Link>
                        </div>
                      </article>
                    );
                  })
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-2 mt-12">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`p-2 rounded-full transition-colors ${
                        currentPage === 1
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-gray-100 cursor-pointer"
                      }`}
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    {getPageNumbers().map((page, index) => {
                      if (page === '...') {
                        return (
                          <span key={`ellipsis-${index}`} className="text-gray-400 px-2">
                            ...
                          </span>
                        );
                      }
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`w-10 h-10 rounded-full font-medium transition-colors ${
                            currentPage === page
                              ? "bg-green-500 text-white"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`p-2 rounded-full transition-colors ${
                        currentPage === totalPages
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-gray-100 cursor-pointer"
                      }`}
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column - Sidebar */}
              <div className="lg:w-1/3 lg:sticky lg:top-36 lg:self-start">
                <div className="space-y-8">
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
                  {categories.length === 0 ? (
                    <p className="text-gray-500 text-sm">No categories available.</p>
                  ) : (
                    <ul className="space-y-3">
                      {categories.map((category) => (
                        <li key={category.id || category.slug}>
                          <Link 
                            href={`/shop/${category.slug}`} 
                            className="text-gray-700 hover:text-green-600 transition-colors flex justify-between items-center"
                          >
                            <span>{category.name}</span>
                            {category.count > 0 && (
                              <span className="text-sm text-gray-500">({category.count})</span>
                            )}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Recent Post Section */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Post</h3>
                  <div className="space-y-4">
                    {recentPosts.length === 0 ? (
                      <p className="text-gray-500 text-sm">No recent posts available.</p>
                    ) : (
                      recentPosts.map((post) => {
                        const attributes = post?.attributes || {};
                        const imageUrl = getImageUrl(attributes?.image);
                        const dateStr = formatDate(attributes?.date);
                        const isExternalImage = imageUrl.startsWith('http');

                        return (
                          <div key={post.id} className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              <Image
                                src={imageUrl}
                                alt={attributes?.title || "Blog post"}
                                width={64}
                                height={64}
                                className="w-16 h-16 object-cover rounded-lg"
                                unoptimized={isExternalImage}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <Link href={`/blog/${attributes?.slug}`} className="text-sm font-medium text-gray-900 hover:text-green-600 transition-colors line-clamp-2">
                                {attributes?.title}
                              </Link>
                              <p className="text-xs text-gray-500 mt-1">{dateStr}</p>
                            </div>
                          </div>
                        );
                      })
                    )}
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
                        <PrimaryButton withArrow={false} className="px-6 py-3">
                          Buy Now
                        </PrimaryButton>
                      </div>
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
      <ShopServiceSection />

      {/* Newsletter Section */}
      <NewsletterSection />
    </>
  );
};

// Main component wrapped with Suspense
const BlogPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <Suspense fallback={
        <>
          <BlogHero />
          <div className="flex items-center justify-center py-20">
            <Loader />
          </div>
        </>
      }>
        <BlogContent />
      </Suspense>
    </div>
  );
};

export default BlogPage;