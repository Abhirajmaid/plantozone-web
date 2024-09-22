import Image from "next/image";

const Logo = ({ img }) => {
  return (
    <>
      <Image
        src={img ? img : `/images/logo_color.png`}
        alt="vedant construction"
        width={500}
        height={500}
        className="h-auto w-full"
      />
    </>
  );
};

export default Logo;
