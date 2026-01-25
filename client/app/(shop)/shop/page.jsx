"use client";
import { Itemlist, Loader } from "@/src/components";
import plantsAction from "@/src/lib/action/plants.action";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function ShopPageContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const [data, setData] = useState();

  useEffect(() => {
    plantsAction
      .getPlants({ search: search || undefined })
      .then((resp) => {
        setData(resp.data.data);
      })
      .catch((error) => {
        console.warn(error);
      });
  }, [search]);

  return data ? (
    <Itemlist data={data} searchQuery={search || undefined} />
  ) : (
    <Loader />
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<Loader />}>
      <ShopPageContent />
    </Suspense>
  );
}
