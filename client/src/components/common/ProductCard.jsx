"use client";
import React from "react";
import { Button } from "../ui/button";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";

const ProductCard = ({ data }) => {
  return (
    <div className="w-full h-auto mb-5 bg-white rounded-lg space-y-1 flex flex-col justify-between">
      <Link href={`/product/${data?.id}`}>
        {data?.attributes?.images?.data != null ? (
          <Image
            width={500}
            height={500}
            src={data?.attributes?.images?.data[0]?.attributes?.url}
            alt="plantozone"
            className="w-full max-h-[420px] rounded-lg overflow-hidden object-cover border-2 border-gray-400"
          />
        ) : (
          <div></div>
        )}
      </Link>
      <div className="p-2 flex justify-between items-center">
        <Link href={`/product/1`}>
          <h3 className="text-base font-semibold text-gray-800">
            {data?.attributes?.title}
          </h3>
        </Link>
        <p className="text-gray-500 text-sm">↕ 20-24cm</p>
      </div>

      <div className="  p-2 border-2 border-mediumGray rounded-md flex items-center justify-between">
        <span className="text-base font-semibold text-gray-800">
          <span className="font-normal text-sm">From</span> ₹{" "}
          {data?.attributes?.price}
        </span>
        <span className="flex items-center gap-3">
          <Button>
            <Icon
              icon="icon-park-outline:shopping-cart-add"
              width="1.3em"
              height="1.3em"
            />
          </Button>
          <Button>Buy Now</Button>
        </span>
      </div>
    </div>
  );
};

export default ProductCard;
