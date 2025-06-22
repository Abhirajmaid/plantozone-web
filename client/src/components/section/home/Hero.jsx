import Image from "next/image";
import { Container } from "../../layout/Container";
import { Section } from "../../layout/Section";
import { Button } from "../../ui/button";
import Link from "next/link";

// Animation keyframes (inject into page, or move to global CSS)
const floatingKeyframes = `
@keyframes float {
  0% { transform: translateY(0px);}
  50% { transform: translateY(-20px);}
  100% { transform: translateY(0px);}
}
@keyframes gradientMove {
  0% { background-position: 0% 50%;}
  100% { background-position: 100% 50%;}
}
`;

const Hero = () => {
  return (
    <Section className="relative overflow-hidden">
      {/* Inject keyframes */}
      <style>{floatingKeyframes}</style>
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
        {/* Animated Gradient Overlay */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(120deg, rgba(34,197,94,0.25) 0%, rgba(16,185,129,0.25) 50%, rgba(59,130,246,0.25) 100%)",
            backgroundSize: "200% 200%",
            animation: "gradientMove 8s ease-in-out infinite alternate",
            mixBlendMode: "overlay",
          }}
        ></div>
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 z-20"></div>
      </div>

      {/* Floating Plant Illustration */}
      <div
        className="absolute left-1/2 top-[15%] z-30 pointer-events-none hidden md:block"
        style={{
          transform: "translateX(-50%)",
          animation: "float 4s ease-in-out infinite",
        }}
      >
        <Image
          src="/images/plant-float.png"
          alt="Floating Plant"
          width={220}
          height={220}
          priority
        />
      </div>

      {/* Content */}
      <Container className="relative z-40 flex flex-col items-center justify-center min-h-[75vh] text-center text-white px-6">
        <h1 className="font-playfair font-extrabold tracking-tight text-[clamp(2rem,4vw,4rem)] leading-tight opacity-0 animate-fadein">
          Bring Nature Indoors
        </h1>
        <p className="mt-4 text-[clamp(1.2rem,2vw,2rem)] max-w-3xl opacity-0 animate-fadein delay-200">
          Transform your space with our curated collection of beautiful,
          easy-to-care-for plants.
        </p>
        <Link href="/shop">
          <Button
            size="lg"
            className="mt-6 px-6 py-3 text-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 opacity-0 animate-fadein delay-400"
          >
            Shop Now
          </Button>
        </Link>
      </Container>
      {/* Fade-in animation utility */}
      <style>{`
        .animate-fadein {
          animation: fadeInUp 1.2s cubic-bezier(.23,1.01,.32,1) forwards;
        }
        .delay-200 { animation-delay: 0.2s; }
        .delay-400 { animation-delay: 0.4s; }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(40px);}
          100% { opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </Section>
  );
};

export default Hero;
