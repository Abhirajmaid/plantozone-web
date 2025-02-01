import React from "react";
import { Footer, Navbar } from "@/src/components";

export const metadata = {
  title: "Shop Plants",
  description:
    "Browse our wide selection of indoor and outdoor plants. Shop for houseplants, succulents, air-purifying plants, and more at Plantozone.",
  keywords:
    "buy plants, indoor plants, outdoor plants, houseplants, succulents, air-purifying plants, garden plants, online plant store",
  author: "Plantozone",
  publisher: "Plantozone",
  robots: "index, follow",
  openGraph: {
    title: "Shop Plants | Plantozone",
    description:
      "Shop the best plants online. Discover the perfect indoor and outdoor plants for your home or garden at Plantozone.",
    url: "https://www.plantozone.com/shop",
    site_name: "Plantozone",
    type: "website",
    images: [
      {
        url: "/images/shop-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Plantozone Shop - Plants for Every Home",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@plantozone",
    title: "Shop Plants | Plantozone",
    description:
      "Find the perfect plant for your home at Plantozone. Shop for indoor plants, outdoor plants, succulents, and more.",
    image: "/images/shop-twitter-card.jpg",
  },
};

const shopLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

export default shopLayout;
