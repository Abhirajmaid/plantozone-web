"use client";
import React, { useEffect, useState } from "react";
import { ProductCard, SectionTitle } from "../..";
import { Section } from "../../layout/Section";
import { Container } from "../../layout/Container";
import plantsAction from "@/src/lib/action/plants.action";
// import { products } from "@/src/lib/data/data";

const PlantingCat = () => {
  const [data, setData] = useState();

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
        warn(error);
      });
  };
  return (
    <Section>
      <Container>
        <div className="flex items-center gap-5 w-full justify-center">
          <SectionTitle title="Indoors" />
          <span className="text-section">/</span>
          <SectionTitle title="Outdoors" />
        </div>
        <div className="mt-[50px] grid grid-cols-4 gap-10">
          {data?.slice(0, 4)?.map((item, id) => {
            return (
              <div key={id}>
                <ProductCard data={item} />
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
};

export default PlantingCat;
