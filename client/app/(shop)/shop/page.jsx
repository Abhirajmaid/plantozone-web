"use client";
import { Itemlist } from "@/src/components";
import plantsAction from "@/src/lib/action/plants.action";
import { Loader } from "lucide-react";
import React, { useEffect, useState } from "react";

const page = () => {
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
    <>
      {data ? (
        <>
          <Itemlist data={data} />
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default page;
