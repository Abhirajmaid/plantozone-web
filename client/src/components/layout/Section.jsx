import cx from "clsx";

export const Section = ({ children, className }) => {
  return (
    // Reduced default vertical spacing to tighten up layout across sections
    <section className={cx("overflow-hidden py-6 sm:py-8", className)}>
      {children}
    </section>
  );
};
