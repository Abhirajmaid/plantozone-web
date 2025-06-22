import { Container } from "@/src/components/layout/Container";
import { Section } from "@/src/components/layout/Section";
import Link from "next/link";

export default function ComingSoon() {
  return (
    <Section className="min-h-[60vh] flex items-center justify-center">
      <Container>
        <div className="flex flex-col items-center justify-center py-20">
          <h1 className="text-4xl font-bold text-primary mb-4">Coming Soon</h1>
          <p className="text-gray-600 text-lg mb-8 text-center max-w-xl">
            This page is under construction and will be available soon. Stay
            tuned for updates!
          </p>
          <Link
            href="/"
            className="bg-lightGreen text-white px-6 py-2 rounded-full font-semibold hover:bg-green-700 transition"
          >
            Go to Home
          </Link>
        </div>
      </Container>
    </Section>
  );
}
