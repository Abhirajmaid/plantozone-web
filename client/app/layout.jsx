// app/layout.js

import "./globals.css"; // Import global styles (Tailwind CSS)
import { Playfair, Montserrat } from "next/font/google"; // Import Google Fonts
import { Providers } from "./provider";

// Import the common components

const playfair = Playfair({ subsets: ["latin"] });
const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata = {
  title: {
    default: "Plantozone | Your Plant Haven",
    template: "%s | Plantozone",
  },
  description:
    "Discover a wide variety of indoor and outdoor plants at Plantozone. From air-purifying plants to rare, exotic species, find the perfect plant for your home and garden.",
  keywords:
    "indoor plants, outdoor plants, air-purifying plants, rare plants, exotic plants, gardening, plant shop, buy plants online, houseplants, plant care",
  author: "Plantozone",
  publisher: "Plantozone",
  robots: "index, follow",
  openGraph: {
    title: "Plantozone | Your Plant Haven",
    description:
      "Explore a curated selection of beautiful, easy-to-care-for plants at Plantozone. Transform your home with our lush greenery.",
    url: "https://www.plantozone.com",
    site_name: "Plantozone",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg", // A sample image for Open Graph
        width: 1200,
        height: 630,
        alt: "Plantozone - Your Plant Haven",
      },
    ],
  },
  twitter: {
    card: "summary_large_image", // Image preview on Twitter
    site: "@plantozone", // Your Twitter handle
    title: "Plantozone | Your Plant Haven",
    description:
      "Discover beautiful plants at Plantozone, your go-to online store for indoor and outdoor greenery.",
    image: "/images/twitter-card.jpg", // Image for Twitter card
  },
};

export default function RootLayout({ children }) {
  return (
    <>
      <Providers>
        <html lang="en">
          <body className={`${playfair.className} ${montserrat.className}`}>
            <main>{children}</main>
          </body>
        </html>
      </Providers>
    </>
  );
}
