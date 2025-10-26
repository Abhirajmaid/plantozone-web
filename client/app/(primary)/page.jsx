import {
  BlogSection,
  CategorySec,
  Diver,
  Hero,
  InfiniteMarquee,
  NewArrivals,
  NewsletterSection,
  PlantingCat,
  ServicesSection,
  TestimonialSwiper,
  VideoSec,
  WhyUs,
  TopSellerProducts,
  SpecialOffer,
  BottomCategoryNav,
} from "@/src/components";
import AboutUsSection from "@/src/components/section/home/AboutUsSection";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Hero />
      <InfiniteMarquee txt="PLANTOZONE" deg="0" />
      <PlantingCat />
      <CategorySec />
      <AboutUsSection />
      <TopSellerProducts />
      <SpecialOffer />
      <InfiniteMarquee txt="PLANTOZONE" deg="0" />
      <NewArrivals />
      <ServicesSection />
      <WhyUs />
      <VideoSec />
      <div className="w-full h-[100px]">
        <Diver />
      </div>
      <TestimonialSwiper />
      <BlogSection />
      <NewsletterSection />
      <BottomCategoryNav />
      <Image
        src="/images/plantozone.svg"
        alt="platozone"
        width={1000}
        height={1000}
        className="w-full h-auto"
      />
      <InfiniteMarquee txt="PLANTOZONE" deg="0" />
    </>
  );
}
