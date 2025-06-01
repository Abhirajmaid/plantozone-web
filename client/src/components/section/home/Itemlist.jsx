"use client";
import React, { useState } from "react";
import { ProductCard } from "../..";
import { Button } from "../../ui/button";

const ItemList = ({ data }) => {
  const [visibleCount, setVisibleCount] = useState(9);

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 9);
  };

  return (
    <div className="w-full md:w-[95%]">
      {/* Grid Layout for Better Responsiveness */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4 md:px-6">
        {data?.slice(0, visibleCount).map((item, id) => (
          <ProductCard key={id} data={item} />
        ))}
      </div>

      {/* Load More Button */}
      {visibleCount < data?.length && (
        <div className="w-full flex justify-center mt-6">
          <Button
            onClick={handleLoadMore}
            className="w-[50%] sm:w-[40%] md:w-[25%] text-base"
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
};

export default ItemList;
