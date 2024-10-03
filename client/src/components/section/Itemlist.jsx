"use client";
import React, { useState } from "react";
import { ProductCard } from "..";
import { products } from "@/src/lib/data/data";
import { Button } from "../ui/button";

const ItemList = () => {
  const [visibleCount, setVisibleCount] = useState(9);

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 9);
  };

  return (
    <div className="w-full md:w-[75%]">
      <div className="flex flex-wrap gap-6 items-center justify-between md:px-4 px-4 ">
        {products?.slice(0, visibleCount).map((item, id) => {
          return (
            <div key={id} className="w-[330px]">
              <ProductCard data={item} />
            </div>
          );
        })}
      </div>
      {visibleCount < products.length && (
        <div className="w-full flex justify-center mt-6">
          <Button onClick={handleLoadMore} className="w-[25%] text-base">
            Load More
          </Button>
        </div>
      )}
    </div>
  );
};

export default ItemList;
