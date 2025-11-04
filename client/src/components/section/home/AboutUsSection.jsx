import Image from "next/image";
import { Section } from "../../layout/Section";
import { Container } from "../../layout/Container";
import { SectionTitle } from "../..";

const about = {
  image: "/images/plantozone.png",
  heading: "About Us",
  subheading: "Bringing Nature Closer to Your Doorstep",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
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
      <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16 py-16 lg:py-20">
        {/* Left: Image with play button and decorative elements */}
        <div className="relative flex-shrink-0 w-full lg:w-1/2 flex justify-center">
          <div className="relative">
            {/* Main circular image */}
            <div className="w-80 h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden shadow-2xl border-4 border-white relative">
              <Image
                src={about.image}
                alt="About Us"
                width={400}
                height={400}
                className="object-cover w-full h-full"
              />
              
              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 cursor-pointer">
                  <svg className="w-6 h-6 text-gray-700 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Sparkle decorative elements */}
            <div className="absolute -bottom-4 -left-4 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
            <div className="absolute -top-4 -right-4 w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Right: Content */}
        <div className="flex-1 w-full lg:w-1/2">
          <div className="text-center lg:text-left">
            <span className="text-sm md:text-base text-gray-500 mb-2 font-medium">
              {about.heading}
            </span>
            <SectionTitle
              title={
                <>
                  <span className="text-gray-900">{about.subheading.split(' ').slice(0, 2).join(' ')}</span>{' '}
                  <span className="text-primary">{about.subheading.split(' ').slice(2).join(' ')}</span>
                </>
              }
              className="mb-6"
            />
            <p className="text-gray-600 text-base leading-relaxed mb-8 max-w-2xl mx-auto lg:mx-0">
              {about.description}
            </p>

            {/* Statistics - unified green pill */}
            <div className="mb-8 max-w-xl mx-auto lg:mx-0">
              <div className="bg-primary text-white rounded-xl px-6 md:px-8 py-6 shadow-lg grid grid-cols-3 gap-4 items-center">
                {about.stats.map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-xl md:text-3xl font-bold text-secondary mb-1">{stat.value}</div>
                    <div className="text-xs md:text-sm font-medium opacity-95">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Signature */}
            <div className="text-center lg:text-left">
              <div className="text-lg font-semibold text-gray-800 mb-1">
                {about.signature}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  </Section>
);

export default AboutUsSection;
