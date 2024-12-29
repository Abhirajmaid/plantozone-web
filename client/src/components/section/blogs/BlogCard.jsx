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
      <Card className="group overflow-hidden transition-colors hover:border-[#0B9C09]">
        <div className="aspect-[4/3] overflow-hidden">
          {image && (
            <Image
              src={image}
              alt={title || "Blog post image"}
              width={600}
              height={400}
              className="object-cover -translate-y-1/4 transition-transform duration-300 group-hover:scale-105"
            />
          )}
        </div>
        <CardHeader className="p-4">
          <h3 className="line-clamp-2 text-xl font-semibold">
            {title || "Untitled Post"}
          </h3>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="line-clamp-2 mb-4 text-sm text-muted-foreground">
            {description || "No description available"}
          </p>
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
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
      </Card>
    </Link>
  );
};

export default BlogCard;
