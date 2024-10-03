"use client";
import { Container } from "@/src/components/layout/Container";
import { Section } from "@/src/components/layout/Section";
import { useParams } from "next/navigation";
import React from "react";

const page = () => {
  const params = useParams();
  return (
    <Section>
      <Container className="mt-[100px]">page {params.slug}</Container>
    </Section>
  );
};

export default page;
