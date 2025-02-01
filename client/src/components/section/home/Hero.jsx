import Image from "next/image";
import { Container } from "../../layout/Container";
import { Section } from "../../layout/Section";
import { Button } from "../../ui/button";
import Link from "next/link";

const Hero = () => {
  return (
    <Section className="relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/images/plantozone.png"
          alt="Beautiful indoor plants"
          layout="fill"
          objectFit="cover"
          quality={100}
          className="absolute z-0"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>
      </div>

      {/* Content */}
      <Container className="relative z-20 flex flex-col items-center justify-center min-h-[75vh] text-center text-white px-6">
        <h1 className="font-playfair font-extrabold tracking-tight text-[clamp(2rem,4vw,4rem)] leading-tight">
          Bring Nature Indoors
        </h1>
        <p className="mt-4 text-[clamp(1.2rem,2vw,2rem)] max-w-3xl">
          Transform your space with our curated collection of beautiful,
          easy-to-care-for plants.
        </p>
        <Link href="/shop">
          <Button
            size="lg"
            className="mt-6 px-6 py-3 text-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105"
          >
            Shop Now
          </Button>
        </Link>
      </Container>
    </Section>
  );
};

export default Hero;
