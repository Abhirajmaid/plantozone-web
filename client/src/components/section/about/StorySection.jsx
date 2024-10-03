import React from "react";
import { Container } from "../../layout/Container";
import { Section } from "../../layout/Section";

const StorySection = () => {
  return (
    <Section>
      <Container>
        <div className="container mx-auto flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 p-6">
            <h2 className="text-4xl font-semibold mb-4">Our Story</h2>
            <p className="text-lg text-gray-700">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>
          <div className="lg:w-1/2 p-6">
            <img
              src="/path-to-story-image.jpg"
              alt="Our Story"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default StorySection;
