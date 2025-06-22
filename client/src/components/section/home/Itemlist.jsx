"use client";
import React, { useState } from "react";
import { ProductCard } from "../..";
import { Button } from "../../ui/button";
import {
  addToCart as addToCartUtil,
  getCartItems,
} from "@/src/lib/utils/cartUtils";

const NO_PREVIEW_IMG = "/no-preview.png"; // Place this image in your public folder

const ItemList = ({ data }) => {
  const pageSize = 12;
  const [page, setPage] = useState(1);
  const [cartItems, setCartItems] = useState([]);

  const totalPages = Math.ceil((data?.length || 0) / pageSize);
  const paginatedData = data?.slice((page - 1) * pageSize, page * pageSize);

  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));

  // Helper to inject default image if missing
  const getCardData = (item) => {
    const imgArr = item?.attributes?.images?.data;
    if (!imgArr || !imgArr[0]?.attributes?.url) {
      return {
        ...item,
        attributes: {
          ...item.attributes,
          images: {
            data: [
              {
                id: "no-preview",
                attributes: {
                  url: NO_PREVIEW_IMG,
                },
              },
            ],
          },
        },
      };
    }
    return item;
  };

  // Handler for adding to cart (like cart page)
  const handleAddToCart = (item, { size, shape, price }) => {
    const attrs = item.attributes;
    const img = attrs?.images?.data?.[0]?.attributes?.url || NO_PREVIEW_IMG;
    addToCartUtil({
      product: item.id,
      title: attrs.title,
      price: price,
      size: size,
      shape: shape,
      quantity: 1,
      image: img,
    });
    setCartItems(getCartItems());
  };

  return (
    <div className="w-full md:w-full">
      {/* Grid Layout for Better Responsiveness */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-4 md:px-6">
        {paginatedData.map((item, id) => (
          <ProductCard
            key={id}
            data={getCardData(item)}
            onAddToCart={(opts) => handleAddToCart(getCardData(item), opts)}
            showAddToCart
          />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="w-full flex justify-center mt-6 gap-2">
          <Button
            onClick={handlePrev}
            disabled={page === 1}
            className="text-base"
          >
            Previous
          </Button>
          <span className="flex items-center px-4">
            Page {page} of {totalPages}
          </span>
          <Button
            onClick={handleNext}
            disabled={page === totalPages}
            className="text-base"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default ItemList;
