"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Section } from "@/src/components/layout/Section";
import { Container } from "@/src/components/layout/Container";
import blogsAction from "@/src/lib/action/blogs.action";
import { Loader, SectionTitle } from "@/src/components";

export default function BlogSinglePage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    blogsAction
      .getBlogs({ filters: { slug } })
      .then((resp) => {
        const found = resp?.data?.data?.[0];
        setBlog(found);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading)
    return (
      <div className="min-h-[60vh] flex justify-center items-center pt-[100px]">
        <Loader />
      </div>
    );

  if (!blog)
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center pt-[100px]">
        <SectionTitle title="Blog Not Found" />
        <Link href="/blog" className="mt-6 text-lightGreen underline">
          Back to Blogs
        </Link>
      </div>
    );

  const attrs = blog.attributes;
  const author = attrs?.author?.data?.attributes;
  const imageUrl = attrs?.image?.data?.attributes?.url || "/images/plant.png";
  const authorImg =
    author?.image?.data?.attributes?.url || "/images/logo_color.png";

  return (
    <Section>
      <Container className="pt-[100px]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Image
              src={imageUrl}
              alt={attrs?.title}
              width={900}
              height={400}
              className="w-full h-[300px] md:h-[400px] object-cover rounded-xl shadow"
            />
          </div>
          <div className="mb-4 flex items-center gap-3">
            <Image
              src={authorImg}
              alt={author?.name}
              width={40}
              height={40}
              className="rounded-full w-10 h-10 object-cover border border-lightGreen"
            />
            <div>
              <div className="font-medium text-primary">{author?.name}</div>
              <div className="text-xs text-gray-500">
                {attrs?.date ? new Date(attrs.date).toLocaleDateString() : ""}
              </div>
            </div>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-primary mb-4">
            {attrs?.title}
          </h1>
          <p className="text-gray-600 text-lg mb-6">{attrs?.description}</p>
          <div
            className="prose prose-green max-w-none"
            dangerouslySetInnerHTML={{
              __html: attrs?.content || "",
            }}
          />
          <div className="mt-10">
            <Link
              href="/blog"
              className="inline-block text-lightGreen font-medium hover:underline"
            >
              ← Back to Blogs
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
