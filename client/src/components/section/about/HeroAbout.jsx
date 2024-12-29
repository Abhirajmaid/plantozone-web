import React from "react";
import { Section } from "../../layout/Section";
import Image from "next/image";

const HeroAbout = () => {
  return (
    <Section>
      <div className="relative h-[60vh] min-h-[500px] w-full pt-[80px]">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/images/plantozone.svg"
            width={1000}
            height={600}
            alt="Tactical gear background"
            className="h-full w-full object-cover translate-y-[80px]"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
        {/* <div className="relative flex h-full items-center justify-center">
          <h1 className="font-playfair font-heading text-hero font-bold italic tracking-wider text-white sm:text-6xl">
            READY FOR THE MISSION
          </h1>
        </div> */}
      </div>
    </Section>
  );
};

export default HeroAbout;
