import Image from "next/image";
import { Section } from "../../layout/Section";
import { Container } from "../../layout/Container";
import { SectionTitle } from "../..";

const about = {
  image: "/images/plantozone.png",
  heading: "About Us",
  subheading: "Bringing Nature Closer to Your Doorstep",
  description:
    "At Plantozone, we are passionate about bringing the beauty of nature into your home. We offer a wide selection of premium indoor and outdoor plants, expert care guidance, and everything you need to create your perfect green space. Our mission is to make plant care easy and enjoyable for everyone.",
  signature: "Jenny Alexander",
  stats: [
    { label: "Categories", value: "20+" },
    { label: "Products", value: "6000+" },
    { label: "Satisfied Customer", value: "99%" },
  ],
};

const AboutUsSection = () => (
  <Section className="bg-gray-100">
    <Container>
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 md:gap-12 lg:gap-16 py-8 md:py-12 lg:py-20">
        {/* Left: About content (moved from right) */}
        <div className="flex-1 w-full lg:w-1/2">
          <div className="text-center lg:text-left">
            <SectionTitle
              subtitle={about.heading}
              title={
                <>
                  <span className="text-gray-900">{about.subheading.split(" ").slice(0, 2).join(" ")}</span>{" "}
                  <span className="text-primary">{about.subheading.split(" ").slice(2).join(" ")}</span>
                </>
              }
              className="mb-6"
              subtitleClassName="font-medium"
            />
            <p className="text-gray-600 text-base leading-relaxed mb-8 max-w-2xl mx-auto lg:mx-0">
              {about.description}
            </p>

            {/* Signature */}
            <div className="text-center lg:text-left">
              <div className="text-lg font-semibold text-gray-800 mb-1">
                {about.signature}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Statistics */}
        <div className="flex-1 w-full lg:w-1/2 flex items-center justify-center lg:justify-end">
          <div className="w-full max-w-xl">
            <div className="bg-primary text-white rounded-xl px-6 md:px-8 py-6 shadow-lg grid grid-cols-1 md:grid-cols-3 gap-4 items-center text-center">
              {about.stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-xl md:text-3xl font-bold text-secondary mb-1">{stat.value}</div>
                  <div className="text-xs md:text-sm font-medium opacity-95">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Container>
  </Section>
);

export default AboutUsSection;
