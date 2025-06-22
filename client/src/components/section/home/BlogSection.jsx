"use client";
import Image from "next/image";
import { SectionTitle } from "../..";
import { Container } from "../../layout/Container";
import { Section } from "../../layout/Section";
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
        setBlogs(all.slice(0, 3));
      })
      .catch((error) => {
        setBlogs([]);
      });
  }, []);

  return (
    <Section>
      <Container>
        <div className="w-full flex flex-col items-center mb-8">
          <span className="text-lg md:text-lg mb-1 font-medium">
            News & Blogs
          </span>
          <SectionTitle
            title={
              <>
                Our Latest <span className="text-lightGreen">News & Blogs</span>
              </>
            }
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogs.map((blog, idx) => (
            <Link
              key={blog?.id || idx}
              href={`/blog/${blog?.attributes?.slug || "#"}`}
              className="bg-white rounded-2xl shadow-lg border border-lightGreen/20 flex flex-col overflow-hidden hover:shadow-2xl transition"
            >
              <div className="relative">
                <Image
                  src={
                    blog?.attributes?.image?.data?.attributes?.url ||
                    "/images/plant.png"
                  }
                  alt={blog?.attributes?.title}
                  width={400}
                  height={250}
                  className="w-full h-[180px] object-cover"
                />
                <span className="absolute left-4 top-4 bg-yellow-400 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                  {blog?.attributes?.tag || "Blog"}
                </span>
              </div>
              <div className="flex-1 flex flex-col px-5 pt-4 pb-5">
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                  <span>
                    {blog?.attributes?.author?.data?.attributes?.name ||
                      "Plantozone"}
                  </span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full" />
                  <span>
                    {blog?.attributes?.date
                      ? new Date(blog?.attributes?.date).toLocaleDateString()
                      : ""}
                  </span>
                </div>
                <h3 className="text-base md:text-lg font-semibold mb-2 text-primary">
                  {blog?.attributes?.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                  {blog?.attributes?.description}
                </p>
                <span className="text-lightGreen text-sm font-medium mt-auto hover:underline">
                  Read More
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default BlogSection;
