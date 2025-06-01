"use client";
import React, { useEffect, useState } from "react";
import { Section } from "../../layout/Section";
import { Container } from "../../layout/Container";
import { ProductCard, SectionTitle } from "../..";
import { Button } from "../../ui/button";
import Link from "next/link";
import { ScrollMenu } from "react-horizontal-scrolling-menu";
import "react-horizontal-scrolling-menu/dist/styles.css";
import plantsAction from "@/src/lib/action/plants.action";

const NewArrivals = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    getPlantList();
  }, []);

  const getPlantList = async () => {
    try {
      const resp = await plantsAction.getPlants();
      setData(resp.data.data);
    } catch (error) {
      console.error("Error fetching plants:", error);
    }
  };

  return (
    <Section>
      <Container>
        {/* Title */}
        <div className="w-full flex justify-center mb-6">
          <SectionTitle title="New Arrivals" />
        </div>

        {/* Responsive Layout: Horizontal Scroll for Mobile, Grid for Desktop */}
        <div className="md:hidden">
          <ScrollMenu>
            <div className="flex gap-6 overflow-x-auto scrollbar-hide">
              {data?.slice(0, 8)?.map((item, id) => (
                <div key={id} className="min-w-[250px] max-w-[300px]">
                  <ProductCard data={item} />
                </div>
              ))}
            </div>
          </ScrollMenu>
        </div>

        {/* Desktop Grid Layout */}
        <div className="hidden md:grid grid-cols-3 gap-x-10 gap-y-5 mt-[50px]">
          {data?.slice(0, 8)?.map((item, id) => (
            <div key={id}>
              <ProductCard data={item} />
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="w-full flex justify-center mt-8">
          <Link href="/shop">
            <Button className="text-[20px] p-5 px-7 font-medium">
              Load More
            </Button>
          </Link>
        </div>
      </Container>
    </Section>
  );
};

export default NewArrivals;
