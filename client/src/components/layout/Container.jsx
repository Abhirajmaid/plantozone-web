import cx from "clsx";

export const Container = ({ children, className }) => {
  return <div className={cx("container", className)}>{children}</div>;
};
