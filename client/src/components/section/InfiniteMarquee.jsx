"use client";
import React from "react";
import Marquee from "react-fast-marquee";

const InfiniteMarquee = ({ txt, deg }) => {
  return (
    <>
      <section className="py-0 overflow-hidden">
        <div className={`md:w-[120%] w-[100%] ${deg} bg-primary text-white`}>
          <Marquee>
            <div
              className=" flex gap-x-[115px] text-transparent justify-between md:text-[85px] font-black text-[40px] items-center tracking-widest"
              style={{ WebkitTextStroke: "2px white" }}
            >
              <span>{txt}</span>
              <span>{txt}</span>
              <span>{txt}</span>
              <span>{txt}</span>
              <span>{txt}</span>
              <span>{txt}</span>
              <span>{txt}</span>
              <span>{txt}</span>
              <span className="mr-[115px]">{txt}</span>
            </div>
          </Marquee>
        </div>
      </section>
    </>
  );
};

export default InfiniteMarquee;
