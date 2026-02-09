import Image from "next/image";
import Link from "next/link";

// Logo component: uses provided image (defaults to logo.png).
// Accepts optional img, width and height props to control size.
const Logo = ({ img, width = 500, height = 500 }) => {
  return (
    <>
      <Link href="/" className="w-full h-full">
        <Image
          src={img ? img : `/images/logo.png`}
          alt="plantozone"
          width={width}
          height={height}
          quality={100}
          priority
          className="h-auto w-auto"
        />
      </Link>
    </>
  );
};

export default Logo;
