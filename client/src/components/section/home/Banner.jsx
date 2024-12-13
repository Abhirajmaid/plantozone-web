import { Container } from "../../layout/Container";
import { Section } from "../../layout/Section";

const PageBanner = () => {
  return (
    <Section>
      <div
        className="relative bg-cover bg-center h-96 mt-[80px]"
        style={{ backgroundImage: "url('/images/banner1.svg')" }}
      ></div>
    </Section>
  );
};

export default PageBanner;
