// app/layout.js

import "./globals.css"; // Import global styles (Tailwind CSS)
import { Poppins, Playfair_Display } from "next/font/google"; // Import Google Fonts
import { Providers } from "./provider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Script from "next/script";

// Body text: Poppins. Headings: Playfair Display. CSS variables used in globals.css for consistency.
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

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
        url: "/images/og-image.png", // A sample image for Open Graph
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
    image: "/images/og-image.png", // Image for Twitter card
  },
};

export default function RootLayout({ children }) {
  return (
    <>
      <Providers>
        <html lang="en">
          <body className={`${poppins.variable} ${playfair.variable}`}>
            {/* Google tag (gtag.js) */}
            <Script
              src="https://www.googletagmanager.com/gtag/js?id=G-YX3P9HKCQK"
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-YX3P9HKCQK');
              `}
            </Script>
            <main>{children}</main>
            <ToastContainer position="top-right" />
          </body>
        </html>
      </Providers>
    </>
  );
}
