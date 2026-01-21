import cx from "clsx";

export const Section = ({ children, className }) => {
  return (
    <section className={cx("overflow-hidden py-10 sm:py-14 w-full max-w-full", className)}>
      {children}
    </section>
  );
};
