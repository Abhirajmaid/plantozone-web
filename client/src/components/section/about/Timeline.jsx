import Image from "next/image";
import { SectionTitle } from "../..";
import { Container } from "../../layout/Container";
import { Section } from "../../layout/Section";

const timelineEvents = [
  {
    year: "1988",
    title: "FOUNDED WITH HEADQUARTERS IN UK",
    description:
      "We believe in giving each customer access to exceptional products that are expertly crafted to give unparalleled experience.",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    year: "2001",
    title: "WE HAVE EXPERT TEAM MEMBER",
    description:
      "We believe in giving each customer access to exceptional products that are expertly crafted to give unparalleled experience.",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    year: "2015",
    title: "WHAT IT MEANS TO BE PROFESSIONAL",
    description:
      "We believe in giving each customer access to exceptional products that are expertly crafted to give unparalleled experience.",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    year: "2024",
    title: "THE NEXT CHAPTER",
    description:
      "We believe in giving each customer access to exceptional products that are expertly crafted to give unparalleled experience.",
    image: "/placeholder.svg?height=300&width=400",
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
                      src="https://images.unsplash.com/photo-1503149779833-1de50ebe5f8a?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
                      src="https://images.unsplash.com/photo-1503149779833-1de50ebe5f8a?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
