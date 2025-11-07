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
  // WhyUs,
  TopSellerProducts,
  SpecialOffer,
  PromotionalBanners,
  DealsOfTheDaySection,
  InfiniteCategoryMarquee,
  // TodayDealsPromo,
} from "@/src/components";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Hero />
      <CategorySec />
      <AboutUsSection />
      <TopSellerProducts />
      <SpecialOffer />
      {/* <TodayDealsPromo /> */}
      <DealsOfTheDaySection />
      <PromotionalBanners />
      <InfiniteCategoryMarquee />
      <NewArrivals />
      <ShopServiceSection />
      {/* <WhyUs /> */}
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
