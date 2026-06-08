"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Container } from "../../layout/Container";
import { Section } from "../../layout/Section";
import Link from "next/link";
import { SectionTitle } from "@/src/components";

const gradientColors = [
  "from-green-400 to-emerald-600",
  "from-blue-400 to-cyan-600",
  "from-purple-400 to-pink-600",
  "from-orange-400 to-red-600",
  "from-yellow-400 to-amber-600",
];

/** Shared card shell — fixed aspect so images fill edge-to-edge with object-cover */
function CategoryCardShell({ item, children, className = "" }) {
  return (
    <Link
      href={`/shop/${item.slug}`}
      className={`group block h-full ${className}`}
    >
      <div className="relative w-full aspect-[9/16] min-h-[360px] sm:min-h-[400px] md:min-h-[440px] lg:min-h-[480px] rounded-2xl overflow-hidden shadow-md ring-1 ring-black/5 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl group-hover:ring-green-600/30">
        {children}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-16 pb-3 px-3 pointer-events-none">
          <p className="text-white font-semibold text-center text-sm md:text-base leading-tight drop-shadow-md line-clamp-2">
            {item.name}
          </p>
        </div>
      </div>
    </Link>
  );
}

function CategoryCard({ item, gradientIndex }) {
  const [imgFailed, setImgFailed] = useState(false);
  const gradient =
    item.gradient || gradientColors[gradientIndex % gradientColors.length];
  const showPhoto = Boolean(item.image) && !imgFailed;

  return (
    <CategoryCardShell item={item}>
      {showPhoto ? (
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover object-center"
          loading="lazy"
          onError={() => setImgFailed(true)}
          unoptimized
        />
      ) : (
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradient} flex items-center justify-center p-4`}
        >
          <p className="text-white/90 font-semibold text-center text-lg drop-shadow-md">
            {item.name}
          </p>
        </div>
      )}
    </CategoryCardShell>
  );
}

function CategoryCardMobile({ item, gradientIndex }) {
  const [imgFailed, setImgFailed] = useState(false);
  const gradient =
    item.gradient || gradientColors[gradientIndex % gradientColors.length];
  const showPhoto = Boolean(item.image) && !imgFailed;

  return (
    <CategoryCardShell item={item} className="w-full">
      {showPhoto ? (
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="50vw"
          className="object-cover object-center"
          loading="lazy"
          onError={() => setImgFailed(true)}
          unoptimized
        />
      ) : (
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradient} flex items-center justify-center p-3`}
        >
          <p className="text-white font-semibold text-center text-sm drop-shadow-md">
            {item.name}
          </p>
        </div>
      )}
    </CategoryCardShell>
  );
}

const CategorySec = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/categories", { cache: "no-store" });
      const json = await res.json();
      const list = json.data || [];

      if (list.length === 0) {
        setError("No categories available");
        setLoading(false);
        return;
      }

      setCategories(list);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <Section className="bg-white">
      <Container>
        <SectionTitle
          subtitle="Our Categories"
          title="Shop By Category"
          className="mb-6 mt-8"
          subtitleClassName="text-black"
        />
      </Container>

      <div className="w-full">
        {loading ? (
          <div className="px-4 lg:px-12">
            <div className="hidden sm:grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-[9/16] min-h-[360px] md:min-h-[440px] lg:min-h-[480px] rounded-2xl bg-gray-200 animate-pulse"
                />
              ))}
            </div>
            <div className="sm:hidden grid grid-cols-2 gap-3 py-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-[9/16] min-h-[320px] rounded-2xl bg-gray-200 animate-pulse"
                />
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              type="button"
              onClick={fetchCategories}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="w-full overflow-hidden py-4 md:py-6">
            <div className="px-4 lg:px-12">
              <div className="hidden sm:grid gap-4 md:gap-5 items-stretch sm:grid-cols-2 md:grid-cols-4">
                {categories.map((item, index) => (
                  <CategoryCard
                    key={item.id}
                    item={item}
                    gradientIndex={index}
                  />
                ))}
              </div>

              <div className="sm:hidden py-2">
                <div className="grid grid-cols-2 gap-3">
                  {categories.slice(0, 4).map((item, index) => (
                    <CategoryCardMobile
                      key={item.id}
                      item={item}
                      gradientIndex={index}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Section>
  );
};

export default CategorySec;
