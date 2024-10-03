import Image from "next/image";
import Link from "next/link";

const Logo = ({ img }) => {
  return (
    <>
      <Link href="/">
        <Image
          src={img ? img : `/images/logo_color.png`}
          alt="vedant construction"
          width={500}
          height={500}
          className="h-auto w-full"
        />
      </Link>
    </>
  );
};

export default Logo;
