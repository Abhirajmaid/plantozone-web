import {
  AboutUsSection,
  BlogSection,
  CategorySec,
  Diver,
  Hero,
  NewArrivals,
  NewsletterSection,
  ShopServiceSection,
  TestimonialSwiper,
  TestimonialsSection,
  // VideoSec,
  WhyUs,
  TopSellerProducts,
  PromotionalBanners,
  // DealsOfTheDaySection,
  InfiniteCategoryMarquee,
  
} from "@/src/components";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Hero />
      <CategorySec />
      <AboutUsSection />
      <TopSellerProducts />
      {/* <SpecialOffer /> – Nature's Special Offer section + 30% OFF plants (IDs 64, 47) commented out */}
      {/* <DealsOfTheDaySection /> */}
      <PromotionalBanners />
      <InfiniteCategoryMarquee />
      <NewArrivals />
      <ShopServiceSection />
      <WhyUs />
      {/* <VideoSec /> */}
      <div className="w-full h-[100px]">
        <Diver />
      </div>
      <TestimonialsSection />
      <BlogSection />
      <NewsletterSection />
      <InfiniteCategoryMarquee />
      <Image
        src="/images/plantozone.svg"
        alt="platozone"
        width={1000}
        height={1000}
        className="w-full h-auto"
      />
    </>
  );
}
