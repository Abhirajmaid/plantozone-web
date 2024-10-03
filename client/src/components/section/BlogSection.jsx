import Image from "next/image";
import { SectionTitle } from "..";
import { Container } from "../layout/Container";
import { Section } from "../layout/Section";

const BlogSection = () => {
  return (
    <Section>
      <Container>
        <div className="w-full flex justify-center">
          <SectionTitle title="Blogs" />
        </div>
        <div className="flex flex-col lg:flex-row lg:space-x-16 mt-[80px]">
          {/* Left Side */}
          <div className="mb-8 lg:w-1/3">
            <h3 className="text-lg font-normal uppercase tracking-wider mb-4">
              All UP-TO-DATE information about plants, you can find it on our
              Blogs
            </h3>
            <a
              href="#"
              className="inline-block px-6 py-3 border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-white transition rounded-md"
            >
              To the Blog Page
            </a>
          </div>

          {/* Right Side */}
          <div className="lg:w-2/3">
            <div className="space-y-8">
              {/* First Blog Post */}
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
                <Image
                  src="/images/plant.png"
                  alt="Low-Light Plants"
                  width={300}
                  height={400}
                  className="md:w-[400px] rounded-md h-[350px]"
                />
                <div className="md:w-2/3">
                  <h3 className="text-2xl font-semibold">
                    Low-Light Plants That Will Brighten Any Room
                  </h3>
                  <p className="mt-2">
                    Discover the best low-light plants that can thrive in
                    minimal sunlight and brighten your room.
                  </p>
                  <a
                    href="#"
                    className="inline-block mt-4 px-6 py-2 bg-[#0b9c09] text-white rounded-md"
                  >
                    Read More
                  </a>
                </div>
              </div>

              {/* Second Blog Post */}
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
                <Image
                  src="/images/plant.png"
                  width={300}
                  height={300}
                  alt="Bonsai Basics"
                  className="md:w-[400px] rounded-md"
                />
                <div className="md:w-2/3">
                  <h3 className="text-2xl font-semibold">
                    Bonsai Basics: A Beginner’s Guide to Growing Miniature Trees
                  </h3>
                  <p className="mt-2">
                    Learn the basics of growing Bonsai trees and how to care for
                    them properly.
                  </p>
                  <a
                    href="#"
                    className="inline-block mt-4 px-6 py-2 bg-[#0b9c09] text-white rounded-md"
                  >
                    Read More
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default BlogSection;
