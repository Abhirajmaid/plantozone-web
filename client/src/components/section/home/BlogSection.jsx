"use client";
import { Container } from "../../layout/Container";
import { Section } from "../../layout/Section";
import { useEffect, useState } from "react";
import blogsAction from "@/src/lib/action/blogs.action";
import BlogCard from "@/src/components/section/blogs/BlogCard";

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

  return (
    <Section>
      <Container>
        <div className="w-full flex flex-col items-center mb-12 text-center">
          <p className="text-base text-black uppercase tracking-wide mb-2">News & Blogs</p>
          <h2 className="text-4xl md:text-5xl font-semibold text-gray-900">
            Our Latest News & Blogs
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
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
  );
};

export default BlogSection;
