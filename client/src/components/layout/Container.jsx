import cx from "clsx";

export const Container = ({ children, className }) => {
  return (
    <div className={cx("container mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>{children}</div>
  );
};
