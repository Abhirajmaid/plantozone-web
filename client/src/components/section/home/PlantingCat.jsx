"use client";
import React, { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Loader, ProductCard, SectionTitle } from "../..";
import { Section } from "../../layout/Section";
import { Container } from "../../layout/Container";
import plantsAction from "@/src/lib/action/plants.action";

const PlantingCat = () => {
  const [data, setData] = useState([]);
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, align: "start" });

  useEffect(() => {
    getPlantList();
  }, []);

  const getPlantList = () => {
    plantsAction
      .getPlants()
      .then((resp) => {
        setData(resp.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Next & Prev Buttons
  const scrollPrev = useCallback(() => embla && embla.scrollPrev(), [embla]);
  const scrollNext = useCallback(() => embla && embla.scrollNext(), [embla]);

  return (
    <Section>
      <Container>
        {/* Section Title */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5 w-full">
          <SectionTitle title="Indoors" />
          <span className="text-section">/</span>
          <SectionTitle title="Outdoors" />
        </div>

        {/* Carousel */}
        <div className="relative mt-10">
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex gap-5">
              {data.length > 0 ? (
                data.slice(0, 8).map((item, id) => (
                  <div
                    key={id}
                    className="flex-shrink-0 w-[250px] sm:w-[300px]"
                  >
                    <ProductCard data={item} />
                  </div>
                ))
              ) : (
                <div className="flex justify-center items-center h-40 w-full">
                  <Loader />
                </div>
              )}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/50 p-2 rounded-full shadow-md hover:bg-white transition"
          >
            ◀
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/50 p-2 rounded-full shadow-md hover:bg-white transition"
          >
            ▶
          </button>
        </div>
      </Container>
    </Section>
  );
};

export default PlantingCat;
