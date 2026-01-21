"use client";
import React, { useEffect, useState } from "react";
import { Section } from "../../layout/Section";
import { Container } from "../../layout/Container";
import { PrimaryButton, SectionTitle } from "@/src/components";
import Link from "next/link";
import { InfiniteCategoryMarquee } from "@/src/components";
import blogsAction from "@/src/lib/action/blogs.action";
import BlogCard from "@/src/components/section/blogs/BlogCard";

const NewsBlogsSection = () => {
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
      .catch(() => setBlogs([]));
  }, []);

  return (
    <>
      <Section className="bg-white py-12 md:py-16">
        <Container>
          {/* Section Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 md:mb-12 gap-4">
            <div className="flex-1">
              <SectionTitle 
                subtitle="News & Blogs"
                title={<>Our Latest <span className="text-primary">News & Blogs</span></>}
                className="text-left"
                titleClassName="text-2xl md:text-3xl lg:text-4xl font-bold"
                subtitleClassName="font-medium"
              />
            </div>
            <PrimaryButton href="/blog">View All Blogs</PrimaryButton>
          </div>

          {/* Blog Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch">
            {blogs.map((blog, idx) => {
              const attributes = blog?.attributes || {};
              const imageUrl = attributes?.image?.data?.attributes?.url || "/images/plant.png";
              const authorName = attributes?.author?.data?.attributes?.name || "Plantozone";
              const authorImage = attributes?.author?.data?.attributes?.image?.data?.attributes?.url;
              // Format date properly - handle both date strings and timestamps
              let dateStr = "";
              if (attributes?.date) {
                try {
                  const dateObj = new Date(attributes.date);
                  if (!isNaN(dateObj.getTime())) {
                    dateStr = dateObj.toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'numeric', 
                      day: 'numeric' 
                    });
                  }
                } catch (e) {
                  dateStr = "";
                }
              }

              return (
                <BlogCard
                  key={blog?.id || idx}
                  title={attributes?.title}
                  description={attributes?.description}
                  image={imageUrl}
                  author={{ name: authorName, image: authorImage }}
                  date={dateStr}
                  slug={attributes?.slug}
                />
              );
            })}
          </div>
        </Container>
      </Section>

      {/* Infinite Marquee at Bottom */}
      <InfiniteCategoryMarquee />
    </>
  );
};

export default NewsBlogsSection;


