import { Features, Hero, HeroAbout, Stats, Timeline } from "@/src/components";
import React from "react";

export const metadata = {
  title: "About Us",
  description:
    "Learn about Plantozone's mission, values, and passion for bringing nature indoors. Discover how we provide the best plants, care advice, and gardening tips.",
  keywords:
    "about plantozone, plant company, indoor plants, gardening tips, plant care, our story, plant shop, sustainable gardening",
  author: "Plantozone",
  publisher: "Plantozone",
  robots: "index, follow",
  openGraph: {
    title: "About Us | Plantozone",
    description:
      "Get to know Plantozone, our story, and our commitment to delivering the best plants and gardening resources for your home and garden.",
    url: "https://www.plantozone.com/about",
    site_name: "Plantozone",
    type: "website",
    images: [
      {
        url: "/images/about-us-og-image.jpg", // Ensure you have a relevant image for the About Us page
        width: 1200,
        height: 630,
        alt: "About Us - Plantozone",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@plantozone",
    title: "About Us | Plantozone",
    description:
      "Learn about Plantozone, a company dedicated to bringing the best plants and expert gardening advice to your home.",
    image: "/images/about-us-twitter-card.jpg", // Image for Twitter sharing
  },
};

const page = () => {
  return (
    <div>
      <HeroAbout />
      <Stats />
      <Features />
      <Timeline />
      {/* <Team /> */}
    </div>
  );
};

export default page;
