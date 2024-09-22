import Image from "next/image";
import React from "react";

const Diver = () => {
  return (
    <>
      <Image
        src="/images/divider.svg"
        width={500}
        height={200}
        alt="plantozone"
        className="w-full h-full"
      />
    </>
  );
};

export default Diver;
