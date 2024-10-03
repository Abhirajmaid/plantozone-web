"use client";
import { Itemlist } from "@/src/components";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const page = () => {
  const param = useParams();
  // const searchParams = useSearchParams();

  console.log("Category :", param.category);

  return (
    <>
      <Itemlist />
    </>
  );
};

export default page;
