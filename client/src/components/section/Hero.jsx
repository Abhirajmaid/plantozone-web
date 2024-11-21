import Image from "next/image";
import { Container } from "../layout/Container";
import { Section } from "../layout/Section";
import { Button } from "../ui/button";

const Hero = () => {
  return (
    <Section className="!pb-0 relative">
      <Image
        src="/images/plantozone.png"
        alt="Beautiful indoor plants"
        layout="fill"
        objectFit="cover"
        quality={100}
        className="absolute z-0"
      />
      <Container className="mt-[80px] w-full min-h-[73vh] justify-center items-center flex">
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>

        {/* Content */}
        <div className="relative z-20 text-center text-white px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 font-playfair">
            Bring Nature Indoors
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl mb-8 max-w-3xl mx-auto">
            Transform your space with our curated collection of beautiful,
            easy-to-care-for plants.
          </p>
          <Button
            size="lg"
            className="  font-semibold text-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            Shop Now
          </Button>
        </div>
      </Container>
    </Section>
  );
};

export default Hero;
