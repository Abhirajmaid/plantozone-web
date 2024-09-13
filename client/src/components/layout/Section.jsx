import cx from "clsx";

export const Section = ({ children, className }) => {
  return (
    <section className={cx("overflow-hidden py-16 sm:py-24", className)}>
      {children}
    </section>
  );
};
