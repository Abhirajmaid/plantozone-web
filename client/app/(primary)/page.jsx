import {
  BlogSection,
  CategorySec,
  Diver,
  Hero,
  InfiniteMarquee,
  NewArrivals,
  PlantingCat,
  TestimonialSwiper,
  VideoSec,
  WhyUs,
} from "@/src/components";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Hero />
      <InfiniteMarquee txt="PLANTOZONE" deg="0" />
      <PlantingCat />
      <CategorySec />
      <NewArrivals />
      <WhyUs />
      <VideoSec />
      <div className="w-full h-[100px]">
        <Diver />
      </div>
      <TestimonialSwiper />
      <BlogSection />
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
