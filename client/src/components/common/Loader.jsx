import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center w-full min-h-[200px]">
      <div className="w-14 h-14 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
    </div>
  );
};

export default Loader;
