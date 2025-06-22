import { SectionTitle } from "../..";
import { Container } from "../../layout/Container";
import { Section } from "../../layout/Section";

const Stats = () => {
  return (
    <Section>
      <Container>
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <SectionTitle title="Who we are" />
            <p className="mt-4 text-darkGray">
              Plantozone is dedicated to making green living easy and accessible
              for everyone. With a curated selection of 6000+ plants and
              accessories, we help you find the perfect green companion for
              every space. Our commitment to quality, customer happiness, and
              sustainability drives everything we do.
            </p>
          </div>
          <div className="flex gap-12">
            <div className="text-center">
              <span className="font-heading text-section font-bold text-primary">
                50+
              </span>
              <p className="mt-2 text-lg text-darkGray">Cities Served</p>
            </div>
            <div className="text-center">
              <span className="font-heading text-section font-bold text-primary">
                6000+
              </span>
              <p className="mt-2 text-lg text-darkGray">Products</p>
            </div>
            <div className="text-center">
              <span className="font-heading text-section font-bold text-primary">
                99%
              </span>
              <p className="mt-2 text-lg text-darkGray">Happy Customers</p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default Stats;
