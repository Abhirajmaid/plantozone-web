"use client";
import Image from "next/image";
import Link from "next/link";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";

const BlogCard = ({ title, description, image, author, date, slug }) => {
  return (
    <Link href={`/blog/${slug}`}>
      <Card className="group relative overflow-hidden transition-colors hover:border-[#0B9C09] h-full flex flex-col">
        <div className="aspect-[4/3] overflow-hidden flex-shrink-0">
          {image && (
            <Image
              src={image}
              alt={title || "Blog post image"}
              width={600}
              height={400}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
          )}
        </div>
        <CardHeader className="p-4 flex-shrink-0">
          <h3 className="line-clamp-2 text-xl font-semibold min-h-[3.5rem]">
            {title || "Untitled Post"}
          </h3>
        </CardHeader>
        <CardContent className="p-4 pt-0 flex-1 flex flex-col">
          <p className="line-clamp-2 mb-4 text-sm text-muted-foreground min-h-[2.5rem]">
            {description || "No description available"}
          </p>
          <div className="flex items-center gap-2 mt-auto">
            <Avatar className="h-8 w-8 flex-shrink-0">
              {author?.image && (
                <AvatarImage src={author.image} alt={author.name || "Author"} />
              )}
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
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {author?.name || "Plantozone"}
              </span>
              <span className="text-xs text-muted-foreground">
                {date || "No date"}
              </span>
            </div>
          </div>
        </CardContent>
        {/* Hover arrow indicator */}
        <div className="pointer-events-none absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="h-10 w-10 rounded-full bg-[#0B9C09] text-white shadow-lg flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="h-5 w-5"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="M13 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default BlogCard;
