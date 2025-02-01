import { Section } from "../../layout/Section";

const PageBanner = () => {
  return (
    <Section>
      <div
        className="relative bg-cover bg-center bg-no-repeat min-h-[200px] sm:min-h-[300px] md:h-96 mt-[80px]"
        style={{ backgroundImage: "url('/images/banner1.svg')" }}
      >
        {/* Optional Overlay (Can be removed if not needed) */}
        <div className="absolute inset-0 bg-black/10 md:bg-black/20"></div>
      </div>
    </Section>
  );
};

export default PageBanner;
