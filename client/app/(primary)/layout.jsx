import React from "react";
import { Footer, Navbar } from "@/src/components";

const shopLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

export default shopLayout;
