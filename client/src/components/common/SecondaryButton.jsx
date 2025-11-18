import React from "react";
import Link from "next/link";

const SecondaryButton = ({ href, children = "Shop Now", withArrow = true, className = "", ...props }) => {
  const classes = `bg-darkGreen text-white px-8 py-3 rounded-full font-semibold inline-flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 hover:brightness-110 shadow-md ${className}`;
  const content = (
    <>
      <span>{children}</span>
      {withArrow && (
        <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      )}
    </>
  );
  if (href) {
    return (
      <Link href={href} className={`group ${classes}`} {...props}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" className={`group ${classes}`} {...props}>
      {content}
    </button>
  );
};

export default SecondaryButton;


