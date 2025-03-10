"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { BlogCard, Loader, SectionTitle } from "@/src/components";
import { Section } from "@/src/components/layout/Section";
import { Container } from "@/src/components/layout/Container";
import blogsAction from "@/src/lib/action/blogs.action";

export default function BlogPage() {
  const [featuredPost, setFeaturedPost] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getBlogsList();
  }, []);

  const getBlogsList = () => {
    blogsAction
      .getBlogs()
      .then((resp) => {
        setPosts(resp.data.data);
        setFeaturedPost(resp.data.data[0]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  if (!featuredPost)
    return (
      <div className="min-h-[70vh] flex justify-center items-center pt-[100px]">
        <Loader />
      </div>
    );

  return (
    <Section>
      <Container className="pt-[100px]">
        {/* Featured Post */}
        <Link
          href={`/blog/${featuredPost?.attributes?.slug}`}
          className="group relative mb-16 block overflow-hidden rounded-xl"
        >
          <div className="relative aspect-[21/9] w-full md:aspect-[21/9]">
            <Image
              src={featuredPost?.attributes?.image?.data?.attributes?.url}
              alt={featuredPost?.attributes?.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <span className="mb-2 inline-block rounded bg-[#0B9C09] px-2 py-1 text-sm font-medium">
              Featured
            </span>
            <h1 className="mb-2 text-2xl sm:text-3xl md:text-4xl font-bold lg:text-title">
              {featuredPost?.attributes?.title}
            </h1>
            <p className="mb-4 max-w-2xl text-base sm:text-lg text-gray-200">
              {featuredPost?.attributes?.description}
            </p>
            <div className="flex items-center gap-2">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={
                    featuredPost?.attributes?.author?.data?.attributes?.image
                      ?.data?.attributes?.url
                  }
                  alt={featuredPost?.attributes?.author?.data?.attributes?.name}
                />
                <AvatarFallback>
                  <div>
                    <Image
                      src="/images/logo_color.png"
                      width={300}
                      height={300}
                      className="w-full h-full rounded-full bg-white border border-lightGray"
                    />
                  </div>
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">
                  {featuredPost?.attributes?.author?.data?.attributes?.name}
                </div>
                <div className="text-sm text-gray-300">
                  {new Date(
                    featuredPost?.attributes?.date
                  ).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Recent Posts */}
        <section>
          <SectionTitle title="Blogs" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-[30px]">
            {posts?.map((post) => (
              <BlogCard
                key={post?.id}
                title={post?.attributes?.title}
                description={post?.attributes?.description}
                image={post?.attributes?.image?.data?.attributes?.url}
                author={{
                  name: post?.attributes?.author?.data?.attributes?.name,
                  image:
                    post?.attributes?.author?.data?.attributes?.image?.data
                      ?.attributes?.url,
                }}
                date={new Date(post?.attributes?.date)?.toLocaleDateString()}
                slug={post?.attributes?.slug}
              />
            ))}
          </div>
        </section>
      </Container>
    </Section>
  );
}
