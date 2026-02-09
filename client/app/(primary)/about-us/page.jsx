import React from "react";
import { Container } from "@/src/components/layout/Container";
import { Section } from "@/src/components/layout/Section";
import {
  NewsletterSection,
  ShopServiceSection,
  InfiniteCategoryMarquee,
} from "@/src/components";
import StatsBar from "@/src/components/common/StatsBar";
import AboutUsVideoSection from "@/src/components/section/about/AboutUsVideoSection";
import dynamic from "next/dynamic";
const DynamicInstagramGrid = dynamic(
  () => import("@/src/components/common/InstagramGrid"),
  { ssr: false }
);
import { testimonials } from "@/src/lib/data/testimonials";
import teamAction from "@/src/lib/action/team.action";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";

const STRAPI_BASE_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "https://dashboard.plantozone.com";
const DEFAULT_TEAM_IMAGE = "/images/plant.png";

function getTeamImageUrl(apiMember) {
  const img = apiMember?.attributes?.image?.data?.attributes?.url;
  if (!img) return DEFAULT_TEAM_IMAGE;
  return img.startsWith("http") ? img : `${STRAPI_BASE_URL}${img}`;
}

// Category Navigation Data
const categoryNavData = [
  { id: 1, name: "Indoor Plants", slug: "indoor-plants", icon: "mdi:plant" },
  { id: 2, name: "Outdoor Plants", slug: "outdoor-plants", icon: "mdi:tree" },
  {
    id: 3,
    name: "Office Desk Plants",
    slug: "office-desk-plants",
    icon: "mdi:desk-lamp",
  },
  {
    id: 4,
    name: "Pots & Accessories",
    slug: "pots-accessories",
    icon: "mdi:flower-pot",
  },
  {
    id: 5,
    name: "Gift Plants & Combos",
    slug: "gift-plants-combos",
    icon: "mdi:gift",
  },
  {
    id: 6,
    name: "Air Purifying Plants",
    slug: "air-purifying-plants",
    icon: "mdi:air-purifier",
  },
  {
    id: 7,
    name: "Flowering Plants",
    slug: "flowering-plants",
    icon: "mdi:flower",
  },
  { id: 8, name: "Herbs & Edibles", slug: "herbs-edibles", icon: "mdi:food" },
];

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
        url: "/images/about-us-og-image.jpg",
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
    image: "/images/about-us-twitter-card.jpg",
  },
};

// Hero Section with Breadcrumb
function AboutUsHero() {
  return (
    <div
      className="relative py-12 md:py-20 lg:py-24 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/breadcrumbbg.png')" }}
    >
      <div className="absolute inset-0 bg-white/70"></div>
      <Container>
        <div className="relative z-10 flex flex-col items-center text-center px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-3 md:mb-4">
            About Us
          </h1>
          <div className="flex items-center gap-2 text-sm sm:text-base text-gray-600">
            <Link href="/" className="hover:text-green-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-800 font-medium">About Us</span>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default async function AboutUsPage() {
  const teamMembers = await teamAction.getTeamMembers();

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-20">
      {/* Hero Section with Breadcrumb */}
      <AboutUsHero />

      {/* Main About Us Content */}
      <Section className="bg-white py-8 md:py-12 lg:py-16">
        <Container>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-center">
              {/* Left Column - Circular Video (click to play plant.mp4) */}
              <AboutUsVideoSection />

              {/* Right Column - Content */}
              <div className="space-y-4 md:space-y-6 order-1 lg:order-2">
                <div>
                  <p className="text-sm sm:text-base text-black font-semibold uppercase tracking-wide mb-2">
                    About Us
                  </p>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-green-800 mb-4 md:mb-6">
                    Bringing Nature Closer to Your Doorstep
                  </h2>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                    At Plantozone, we are passionate about bringing the beauty
                    of nature into your home. We offer a wide selection of
                    premium indoor and outdoor plants, expert care guidance, and
                    everything you need to create your perfect green space. Our
                    mission is to make plant care easy and enjoyable for
                    everyone.
                  </p>
                </div>

                {/* Statistics Bar – real counts from API, 98% satisfaction */}
                <StatsBar compact />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Vision and Mission Section */}
      <Section className="bg-gray-50 py-8 md:py-12 lg:py-16">
        <Container>
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {/* Our Vision Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 md:w-6 md:h-6 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                    Our Vision
                  </h3>
                </div>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  To become the leading destination for plant enthusiasts,
                  creating a greener world by making quality plants accessible
                  to everyone and fostering a community passionate about
                  sustainable living and nature.
                </p>
              </div>

              {/* Our Mission Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 md:w-6 md:h-6 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                    Our Mission
                  </h3>
                </div>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  To provide premium quality plants, expert guidance, and
                  exceptional customer service that helps people create
                  beautiful, healthy green spaces in their homes and offices
                  while promoting environmental sustainability.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Team Section */}
      <Section className="bg-white py-8 md:py-12 lg:py-16">
        <Container>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8 md:mb-12">
              <p className="text-sm sm:text-base text-black uppercase tracking-wide mb-2">
                Our Team
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 mb-4 md:mb-8">
                Meet The Passionate <br className="hidden sm:block" /> Team
                Behind Our Success
              </h2>
            </div>

            {/* Team Member Cards - from CMS (Team Member content type) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {teamMembers.length === 0 ? (
                <p className="col-span-2 lg:col-span-4 text-center text-gray-500 text-sm">
                  Add team members in the CMS under Content Manager → Team Member. Publish entries to see them here.
                </p>
              ) : (
                teamMembers.map((member) => {
                  const attrs = member.attributes || {};
                  const imageUrl = getTeamImageUrl(member);
                  const isExternalImage = imageUrl.startsWith("http");
                  return (
                    <div key={member.id} className="text-center">
                      <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 bg-gray-200 rounded-full mx-auto mb-3 md:mb-4 overflow-hidden">
                        <Image
                          src={imageUrl}
                          alt={attrs.name || "Team member"}
                          width={256}
                          height={256}
                          className="w-full h-full object-cover"
                          unoptimized={isExternalImage}
                        />
                      </div>
                      <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1">
                        {attrs.name}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-600">
                        {attrs.role}
                      </p>
                      {attrs.bio && (
                        <p className="text-xs text-gray-500 mt-2 line-clamp-3 max-w-[240px] mx-auto">
                          {attrs.bio}
                        </p>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </Container>
      </Section>

      {/* Category Navigation Bar - Infinite Marquee */}
      <InfiniteCategoryMarquee />

      {/* Testimonials Section */}
      <Section className="bg-gray-50 py-8 md:py-12 lg:py-16">
        <Container>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8 md:mb-12">
              <p className="text-sm sm:text-base text-black uppercase tracking-wide mb-2">
                Testimonial
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900">
                What Our Clients Say
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="bg-white rounded-2xl shadow-lg p-6 md:p-8 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center gap-1 mb-3 md:mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-4 h-4 md:w-5 md:h-5 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                    <span className="text-base md:text-lg font-bold text-gray-900 ml-2">
                      5.0
                    </span>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">
                    {t.title}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-4 md:mb-6">
                    {t.text}
                  </p>
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={t.image}
                        alt={t.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm md:text-base font-bold text-gray-900">
                        {t.name}
                      </h4>
                      <p className="text-xs md:text-sm text-gray-600">
                        {t.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Instagram Feed Section (client-rendered) */}
      <Section className="bg-white py-8 md:py-12 lg:py-16">
        <Container>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8 md:mb-12">
              <p className="text-sm sm:text-base text-black uppercase tracking-wide mb-2">
                Follow Us
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900">
                Follow Us On Instagram
              </h2>
            </div>
            {/* Dynamically load client component to render interactive grid */}
            {/*
              The InstagramGrid is a client component (uses state and dialog).
              Load it dynamically with no SSR so it mounts on the client.
            */}
            <div>
              <DynamicInstagramGrid />
            </div>
          </div>
        </Container>
      </Section>

      {/* Services Section */}
      <ShopServiceSection />

      {/* Newsletter Section - Exact same as cart/shop page */}
      <NewsletterSection />
    </div>
  );
}
