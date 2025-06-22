import Image from "next/image";
import { Section } from "../../layout/Section";
import { Container } from "../../layout/Container";
import { SectionTitle } from "../..";

const about = {
  image: "/images/plantozone.png",
  heading: "About Plantozone",
  subheading: "Greenery for Every Space",
  description:
    "At Plantozone, we are passionate about making green living easy and accessible. With 6000+ products and 20+ categories, we help you find the perfect plant for every space. Our mission is to inspire a greener lifestyle, simplify plant care, and deliver happiness to your doorstep in 50+ cities.",
  signature: "Prabhas Rao Balla",
  stats: [
    { label: "Categories", value: "20+" },
    { label: "Products", value: "6000+" },
    { label: "Happy Customers", value: "99%" },
    { label: "Cities Served", value: "50+" },
  ],
};

const AboutUsSection = () => (
  <Section className={"bg-lightGray"}>
    <Container>
      <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16 py-12 md:py-20 w-full">
        {/* Left: Image with badge and play button */}
        <div className="relative flex-shrink-0 flex items-center justify-center w-full md:w-[50%]">
          <div className="relative bg-white rounded-3xl shadow-xl border border-lightGreen/20 p-0 flex flex-col items-center">
            <div className="rounded-3xl overflow-hidden w-full h-[320px] md:w-full md:h-[560px] shadow-lg border-2 border-lightGreen">
              <Image
                src={about.image}
                alt="About Us"
                width={1280}
                height={1360}
                className="object-cover w-full h-full"
              />
            </div>
           
            {/* Decorative badge */}
            <span className="absolute top-4 left-4 bg-lightGreen text-white text-xs font-semibold px-4 py-1 rounded-full shadow">
              Since 2018
            </span>
          </div>
        </div>
        {/* Right: Content */}
        <div className="flex-1 flex flex-col items-center md:items-start">
          <span className="text-lg md:text-lg mb-1 font-medium">
            {about.heading}
          </span>
          <SectionTitle
            title={<span>{about.subheading}</span>}
            className="mb-2"
          />
          <p className="text-gray-600 text-center md:text-left max-w-xl mb-8 md:text-base text-sm font-normal">
            {about.description}
          </p>
          <div className="grid grid-cols-2 gap-4 md:gap-6 mb-8 w-full max-w-xs">
            {about.stats.map((stat, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center bg-lightGreen/10 rounded-xl px-6 py-5 shadow"
              >
                <span className="text-xl md:text-2xl font-bold text-lightGreen">
                  {stat.value}
                </span>
                <span className="text-xs md:text-sm mt-1 text-gray-700 font-medium text-center">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 flex flex-col items-center md:items-start">
            <span className="font-signature text-base md:text-lg text-gray-700 font-semibold">
              {about.signature}
            </span>
            <span className="text-xs text-gray-400 mt-1">
              Founder, Plantozone
            </span>
          </div>
        </div>
      </div>
    </Container>
  </Section>
);

export default AboutUsSection;
