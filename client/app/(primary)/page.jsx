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
  TopFivePlants,
  PromotionalBanners,
  // DealsOfTheDaySection,
  InfiniteCategoryMarquee,
} from "@/src/components";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Hero />
      <InfiniteCategoryMarquee />
      <>
        {/* Mobile: use Frame 23411.png, Desktop: mission.png */}
        <Image
          src="/images/Frame 23411.png"
          alt="plantozone-mobile"
          width={1200}
          height={800}
          className="block sm:hidden w-full h-auto"
        />
        <Image
          src="/images/mission.png"
          alt="platozone"
          width={3000}
          height={3000}
          className="hidden sm:block w-full h-auto"
        />
      </>
      <InfiniteCategoryMarquee />
      <AboutUsSection />
      <CategorySec />
      <TopFivePlants />
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
      <>
        <Image
          src="/images/Frame 23411.png"
          alt="platozone-mobile"
          width={1200}
          height={800}
          className="block sm:hidden w-full h-auto"
        />
        <Image
          src="/images/mission.png"
          alt="platozone"
          width={3000}
          height={3000}
          className="hidden sm:block w-full h-auto"
        />
      </>
    </>
  );
}
