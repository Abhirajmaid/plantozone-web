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
              We can deliver superior products by sourcing quality materials and
              maintaining exceptional relationships with our suppliers. Our
              extensive dealer support network with customer service,
              distribution and end-user support. This streamlined model ensures
              maximum efficiency and value throughout the tactical flow. Our
              industry-leading LIFETIME warranty speaks for itself.
            </p>
          </div>
          <div className="flex gap-12">
            <div className="text-center">
              <span className="font-heading text-section font-bold text-primary">
                25+
              </span>
              <p className="mt-2 text-lg text-darkGray">worldwide stores</p>
            </div>
            <div className="text-center">
              <span className="font-heading text-section font-bold text-primary">
                1k+
              </span>
              <p className="mt-2 text-lg text-darkGray">tactical products</p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default Stats;
