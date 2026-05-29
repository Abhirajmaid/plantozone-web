"use client";
import React from "react";
import { Section } from "../../layout/Section";
import { Icon } from "@iconify/react";
import { SectionTitle } from "../..";
import { Container } from "../../layout/Container";

const whyUs = [
  {
    icon: "lucide:recycle",
    title: "Secure & Recyclable Packaging",
    description:
      "Eco-friendly packaging keeps every plant safe in transit while staying kind to the planet.",
    stat: "100%",
    statLabel: "recyclable materials",
  },
  {
    icon: "lucide:refresh-ccw",
    title: "Free Replacements if Damaged",
    description:
      "Plants arrive damaged? We replace them at no extra cost — quick, simple, and hassle-free.",
    stat: "Free",
    statLabel: "damage replacements",
  },
  {
    icon: "lucide:droplets",
    title: "Self-Watering Pots Included",
    description:
      "Every plant ships with a self-watering pot so beginners and busy plant parents thrive with ease.",
    stat: "Included",
    statLabel: "with every order",
  },
];

const WhyUsCard = ({ item, index }) => {
  return (
    <article className="group relative flex flex-col h-full bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/25">
      <div className="h-1 w-full shrink-0 bg-gradient-to-r from-primary via-lightGreen to-primary/60" />

      <div className="flex flex-col flex-1 p-7">
        {/* Fixed-height header: step number */}
        <div className="h-5 flex items-center shrink-0">
          <span className="text-xs font-semibold tabular-nums tracking-widest text-primary/70">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        {/* Fixed-height icon zone — icons aligned across cards */}
        <div className="h-[4.75rem] flex items-center shrink-0 mt-5 mb-6">
          <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 ring-1 ring-primary/15">
            <Icon icon={item.icon} className="w-7 h-7 text-primary" />
          </div>
        </div>

        {/* Fixed-height title — prevents uneven wraps */}
        <h3 className="min-h-[3.25rem] md:min-h-[3.5rem] text-base md:text-lg font-semibold text-gray-900 leading-snug line-clamp-2 mb-3">
          {item.title}
        </h3>

        <p className="text-sm text-gray-600 leading-relaxed flex-1">
          {item.description}
        </p>

        <div className="mt-auto pt-5 border-t border-gray-100 flex items-end gap-2 shrink-0">
          <span className="text-2xl font-bold text-primary leading-none">
            {item.stat}
          </span>
          <span className="text-xs text-gray-500 pb-0.5 leading-tight">
            {item.statLabel}
          </span>
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(400px circle at 50% 0%, rgba(11,156,9,0.06), transparent 70%)",
        }}
        aria-hidden
      />
    </article>
  );
};

const WhyUs = () => {
  return (
    <Section className="relative overflow-hidden bg-gray-50 py-12 md:py-16 lg:py-20">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230b9c09' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
        aria-hidden
      />

      <Container className="relative z-10">
        <SectionTitle
          subtitle="Our Promise"
          title="Why Us"
          className="mb-4"
          subtitleClassName="text-primary font-medium tracking-wider normal-case"
        />

        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-10 md:mb-12 text-base leading-relaxed px-2">
          More than plants — every order comes with care, quality guarantees, and
          thoughtful extras built for happy, healthy greenery.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto items-stretch">
          {whyUs.map((item, id) => (
            <WhyUsCard key={item.title} item={item} index={id} />
          ))}
        </div>

        <div className="mt-10 md:mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-500">
          <span className="inline-flex items-center gap-2">
            <Icon icon="lucide:shield-check" className="w-4 h-4 text-primary shrink-0" />
            Quality guaranteed
          </span>
          <span className="hidden sm:inline text-gray-300 select-none" aria-hidden>
            |
          </span>
          <span className="inline-flex items-center gap-2">
            <Icon icon="lucide:truck" className="w-4 h-4 text-primary shrink-0" />
            Pan-India delivery
          </span>
          <span className="hidden sm:inline text-gray-300 select-none" aria-hidden>
            |
          </span>
          <span className="inline-flex items-center gap-2">
            <Icon icon="lucide:leaf" className="w-4 h-4 text-primary shrink-0" />
            Expert plant care
          </span>
        </div>
      </Container>
    </Section>
  );
};

export default WhyUs;
