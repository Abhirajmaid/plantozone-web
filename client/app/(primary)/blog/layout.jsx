import React from "react";

export const metadata = {
  title: "Blog",
  description:
    "Read Plantozone's blog for expert advice on plant care, gardening tips, and information about the latest plant trends.",
  keywords:
    "plant care tips, gardening advice, plant care, houseplants, indoor plants, outdoor plants, plant blog, gardening blog, plant care articles",
  author: "Plantozone",
  publisher: "Plantozone",
  robots: "index, follow",
  openGraph: {
    title: "Blog | Plantozone",
    description:
      "Explore our plant care blog for helpful articles, expert gardening tips, and plant care advice.",
    url: "https://www.plantozone.com/blog",
    site_name: "Plantozone",
    type: "website",
    images: [
      {
        url: "/images/blog-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Plantozone Blog - Gardening & Plant Care Tips",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@plantozone",
    title: "Blog | Plantozone",
    description:
      "Find expert advice on plant care and gardening in the Plantozone blog. Learn more about plants and gardening.",
    image: "/images/blog-twitter-card.jpg",
  },
};

const layout = ({ children }) => {
  return <>{children}</>;
};

export default layout;
