import { Features, Hero, HeroAbout, Stats, Timeline } from "@/src/components";
import React from "react";

const page = () => {
  return (
    <div>
      <HeroAbout />
      <Stats />
      <Features />
      <Timeline />
      {/* <Team /> */}
    </div>
  );
};

export default page;
