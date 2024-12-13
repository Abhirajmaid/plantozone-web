"use client";
import React, { useEffect, useState } from "react";
import { Section } from "../../layout/Section";
import { Container } from "../../layout/Container";
import { ProductCard, SectionTitle } from "../..";
import { Button } from "../../ui/button";
import Link from "next/link";
import plantsAction from "@/src/lib/action/plants.action";
// import { products } from "@/src/lib/data/data";

const NewArrivals = () => {
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
        <div className="w-full flex justify-center">
          <SectionTitle title="New Arrivals" />
        </div>
        <div className="grid grid-cols-4 row-span-2 gap-x-10 gap-y-5 mt-[50px]">
          {data?.slice(0, 8)?.map((item, id) => {
            return (
              <div key={id}>
                <ProductCard data={item} />
              </div>
            );
          })}
        </div>
        <div className="w-full flex justify-center">
          <Link href="/shop">
            <Button className="text-[24px] p-6 px-8 font-normal">
              Load More
            </Button>
          </Link>
        </div>
      </Container>
    </Section>
  );
};

export default NewArrivals;
