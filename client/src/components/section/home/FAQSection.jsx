"use client";
import React, { useState } from "react";
import { Section } from "../../layout/Section";
import { Container } from "../../layout/Container";
import { PrimaryButton, SectionTitle } from "@/src/components";
import Link from "next/link";
import { InfiniteCategoryMarquee } from "@/src/components";

// FAQ data
const faqData = [
  {
    id: "1",
    question: "How do I care for my new plant?",
    answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris."
  },
  {
    id: "2",
    question: "Do you sell plant accessories like pots and soil?",
    answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua eiusmod tempor incididunt ut labore et dolore magna aliqua eiusmod tempor incididunt ut labore et dolore magna aliqua."
  },
  {
    id: "3",
    question: "How are the plants packaged for shipping?",
    answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris."
  },
  {
    id: "4",
    question: "What forms of payment do you accept?",
    answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris."
  },
  {
    id: "5",
    question: "How can I provide feedback about my experience?",
    answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris."
  },
  {
    id: "6",
    question: "How long will it take for my plants to arrive?",
    answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris."
  }
];

const FAQItem = ({ item, isOpen, onToggle }) => {
  return (
    <div className="mb-4">
      <button
        onClick={onToggle}
        className={`w-full rounded-xl px-5 py-4 flex items-center justify-between transition-all duration-300 ${
          isOpen
            ? "bg-primary text-white"
            : "bg-gray-100 text-gray-900 hover:bg-gray-200"
        }`}
      >
        <span className="text-left font-medium text-sm md:text-base pr-4">
          {item.question}
        </span>
        <span className={`flex-shrink-0 w-6 h-6 flex items-center justify-center ${
          isOpen ? "text-white" : "text-gray-600"
        }`}>
          {isOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          )}
        </span>
      </button>
      {isOpen && (
        <div className="bg-primary text-white rounded-b-xl px-5 py-4 text-sm md:text-base leading-relaxed">
          {item.answer}
        </div>
      )}
    </div>
  );
};

const FAQSection = () => {
  const [openItem, setOpenItem] = useState("2"); // Second item is open by default

  const handleToggle = (id) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <>
      {/* Yellow Navigation Bar at Top */}
      <InfiniteCategoryMarquee />

      <Section className="bg-white py-12 md:py-16">
        <Container>
          {/* Section Header */}
          <SectionTitle 
            subtitle="FAQs"
            title={<>Question? <span className="text-primary">Look here.</span></>}
            className="mb-8 md:mb-12"
            titleClassName="text-2xl md:text-3xl lg:text-4xl font-bold"
            subtitleClassName="text-xs md:text-sm text-gray-600 uppercase tracking-wider font-medium"
          />

          {/* Main Content - FAQ and Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Left: FAQ Accordion */}
            <div className="lg:col-span-2">
              {faqData.map((item) => (
                <FAQItem
                  key={item.id}
                  item={item}
                  isOpen={openItem === item.id}
                  onToggle={() => handleToggle(item.id)}
                />
              ))}
            </div>

            {/* Right: Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-100 rounded-xl p-6 md:p-8 h-fit sticky top-4">
                {/* Chat Bubble Icon - Black bubble with white dots and green overlapping bubble */}
                <div className="relative mb-4 mx-auto lg:mx-0 w-fit">
                  {/* Large black speech bubble with white dots */}
                  <div className="relative">
                    <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none">
                      {/* Main black bubble */}
                      <path d="M12 4C6.48 4 2 8.48 2 14v20c0 5.52 4.48 10 10 10h8l6 12 6-12h8c5.52 0 10-4.48 10-10V14c0-5.52-4.48-10-10-10H12z" fill="#1f2937"/>
                      {/* Three white dots */}
                      <circle cx="20" cy="22" r="2.5" fill="white"/>
                      <circle cx="32" cy="22" r="2.5" fill="white"/>
                      <circle cx="44" cy="22" r="2.5" fill="white"/>
                    </svg>
                    {/* Smaller green overlapping bubble */}
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full"></div>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 text-center lg:text-left">
                  You have different questions?
                </h3>

                {/* Description */}
                <p className="text-sm md:text-base text-gray-600 mb-6 text-center lg:text-left">
                  Our team will answer all your questions. We ensure a quick response.
                </p>

                {/* Contact Us Button */}
                <PrimaryButton href="/contact-us" className="w-full">Contact Us</PrimaryButton>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Yellow Navigation Bar at Bottom */}
      <InfiniteCategoryMarquee />
    </>
  );
};

export default FAQSection;

