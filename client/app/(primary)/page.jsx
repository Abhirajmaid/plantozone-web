import {
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
    </>
  );
}
