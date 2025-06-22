import Image from "next/image";
import { SectionTitle } from "../..";
import { Container } from "../../layout/Container";
import { Section } from "../../layout/Section";

const timelineEvents = [
  {
    year: "2018",
    title: "PLANTOZONE IS BORN",
    description:
      "Plantozone was founded with a vision to make green living accessible and joyful for everyone. We started with a small collection and a big dream.",
    image:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
  },
  {
    year: "2020",
    title: "EXPANSION & NEW CATEGORIES",
    description:
      "We expanded our range to 20+ categories and 3000+ products, introducing rare, exotic, and air-purifying plants for every space.",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
  },
  {
    year: "2022",
    title: "DELIVERING PAN-INDIA",
    description:
      "With a robust logistics network, we started delivering to 50+ cities, ensuring every plant lover in India could enjoy our collection.",
    image:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80",
  },
  {
    year: "2024",
    title: "COMMUNITY & SUSTAINABILITY",
    description:
      "We launched our plant care community and adopted sustainable packaging, aiming for a greener, happier planet together.",
    image:
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=80",
  },
];

const Timeline = () => {
  return (
    <Section>
      <Container>
        <SectionTitle title="Making History Together" />
        <div className="mt-12">
          {timelineEvents.map((event, index) => (
            <div
              key={index}
              className="relative mb-16 flex flex-col gap-8 lg:flex-row lg:items-center"
            >
              {index % 2 === 0 ? (
                <>
                  <div className="lg:w-1/2">
                    <Image
                      width={1000}
                      height={800}
                      src={event.image}
                      alt={event.title}
                      className="rounded-lg object-cover h-[300px] w-full"
                    />
                  </div>
                  <div className="lg:w-1/2">
                    <span className="font-heading text-3xl text-primary">
                      {event.year}
                    </span>
                    <h3 className="mt-2 font-heading text-4xl font-bold">
                      {event.title}
                    </h3>
                    <p className="mt-4 text-gray-600 text-base">
                      {event.description}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="lg:w-1/2">
                    <span className="font-heading text-3xl text-primary">
                      {event.year}
                    </span>
                    <h3 className="mt-2 font-heading text-4xl  font-bold">
                      {event.title}
                    </h3>
                    <p className="mt-4 text-gray-600 text-base">
                      {event.description}
                    </p>
                  </div>
                  <div className="lg:w-1/2">
                    <Image
                      width={1000}
                      height={800}
                      src={event.image}
                      alt={event.title}
                      className="rounded-lg object-cover h-[300px] w-full"
                    />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
};

export default Timeline;
