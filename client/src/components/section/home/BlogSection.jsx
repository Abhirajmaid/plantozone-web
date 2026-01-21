"use client";
import { Container } from "../../layout/Container";
import { Section } from "../../layout/Section";
import { SectionTitle } from "@/src/components";
import { useEffect, useState } from "react";
import blogsAction from "@/src/lib/action/blogs.action";
import Link from "next/link";

const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    blogsAction
      .getBlogs()
      .then((resp) => {
        const all = resp?.data?.data || [];
        // Filter out incomplete blogs - only include blogs with title, description, date, and slug
        const completeBlogs = all.filter((blog) => {
          const attrs = blog?.attributes || {};
          return (
            attrs?.title &&
            attrs?.title.trim() !== "" &&
            attrs?.title.toLowerCase() !== "duymmy" && // Filter out placeholder titles
            attrs?.description &&
            attrs?.description.trim() !== "" &&
            attrs?.date &&
            attrs?.slug
          );
        });
        setBlogs(completeBlogs.slice(0, 3));
      })
      .catch((error) => {
        setBlogs([]);
      });
  }, []);

  // Format date to match the single blog page format
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

  // Calculate read time (simple estimation: ~200 words per minute)
  const calculateReadTime = (description) => {
    if (!description) return "5 min read";
    const wordCount = description.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);
    return `${readTime} min read`;
  };

  return (
    <Section className="bg-gray-50 py-16">
      <Container>
        <div className="max-w-7xl mx-auto">
          <SectionTitle 
            subtitle="Related News & Blogs"
            title="Latest Related News & Blogs"
            className="mb-12"
            titleClassName="text-3xl md:text-4xl font-bold"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogs.map((blog, idx) => {
              const attributes = blog?.attributes || {};
              // Handle image URL - check if it's already a full URL
              const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "https://dashboard.plantozone.com";
              let imageUrl = "/images/plant.png";
              if (attributes?.image?.data?.attributes?.url) {
                const url = attributes.image.data.attributes.url;
                if (url.startsWith('http://') || url.startsWith('https://')) {
                  imageUrl = url;
                } else {
                  imageUrl = `${STRAPI_BASE_URL}${url}`;
                }
              }
              const authorName = attributes?.author?.data?.attributes?.name || "Jenny Alexander";
              const category = attributes?.category || "Indoor Plant";
              const dateStr = formatDate(attributes?.date);
              const readTime = calculateReadTime(attributes?.description);

              // Truncate description to a few lines (excerpt)
              const getExcerpt = (text, maxLength = 120) => {
                if (!text) return "";
                if (text.length <= maxLength) return text;
                return text.substring(0, maxLength).trim() + "...";
              };

              return (
                <div key={blog?.id || idx} className="rounded-2xl overflow-hidden">
                  <div className="relative">
                    <img 
                      src={imageUrl} 
                      alt={attributes?.title || "Blog post"}
                      className="w-full h-48 object-cover rounded-2xl"
                    />
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-yellow-400 text-gray-800 px-3 py-1 rounded-full text-sm font-bold">
                        {category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 pl-0">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm text-gray-600">{authorName}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-sm text-gray-600">{dateStr}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-sm text-gray-600">{readTime}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                      {attributes?.title}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                      {getExcerpt(attributes?.description)}
                    </p>
                    <Link href={`/blog/${attributes?.slug}`} className="text-green-600 hover:text-green-700 font-medium">
                      Read More
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default BlogSection;
