import React from "react";

const SectionTitle = ({ subtitle, title, className = "", subtitleClassName = "", titleClassName = "" }) => {
  return (
    <div className={`text-center ${className}`}>
      {subtitle && (
        <p className={`text-sm md:text-base text-gray-500 uppercase tracking-wide mb-2 ${subtitleClassName}`}>
          {subtitle}
        </p>
      )}
      {title && (
        <h2 className={`text-3xl md:text-5xl font-semibold text-gray-900 ${titleClassName}`}>
          {title}
        </h2>
      )}
    </div>
  );
};

export default SectionTitle;
