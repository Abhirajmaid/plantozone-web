"use client";
import React, { useEffect, useState } from "react";
import { Container } from "../../layout/Container";
import { Section } from "../../layout/Section";
import Link from "next/link";
import { InfiniteCategoryMarquee, SectionTitle } from "@/src/components";
import Image from "next/image";
import categoriesAction from "@/src/lib/action/categories.action";

const DEFAULT_CATEGORY_IMAGE = "/images/plant.png";
const STRAPI_BASE_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "https://dashboard.plantozone.com";

// Gradient colors for categories
const gradientColors = [
  "from-green-400 to-emerald-600",
  "from-blue-400 to-cyan-600",
  "from-purple-400 to-pink-600",
  "from-orange-400 to-red-600",
  "from-yellow-400 to-amber-600",
  "from-teal-400 to-green-600",
  "from-indigo-400 to-purple-600",
  "from-rose-400 to-pink-600",
];

const CategorySec = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const resp = await categoriesAction.getCategories();
      console.log("Categories API Response:", resp.data);

      const categoriesData = resp.data.data || [];

      if (categoriesData.length === 0) {
        console.warn("No categories found in response");
        setError("No categories available");
        setLoading(false);
        return;
      }

      // Map backend data to component format
      const mappedCategories = categoriesData.map((cat, index) => {
        const title = cat.attributes?.title;
        if (!title) {
          console.warn(`Category ${cat.id} is missing title field`);
        }

        // Get image URL from Strapi
        let imageUrl = DEFAULT_CATEGORY_IMAGE;
        const strapiImageUrl = cat.attributes?.image?.data?.attributes?.url;
        if (strapiImageUrl) {
          // If the URL is relative, prepend Strapi base URL
          imageUrl = strapiImageUrl.startsWith("http")
            ? strapiImageUrl
            : `${STRAPI_BASE_URL}${strapiImageUrl}`;
        }

        return {
          id: cat.id,
          name: title || `Category ${index + 1}`,
          slug:
            cat.attributes?.slug ||
            title?.toLowerCase().replace(/\s+/g, "-") ||
            `category-${index + 1}`,
          image: imageUrl,
          gradient:
            cat.attributes?.gradient ||
            gradientColors[index % gradientColors.length],
          description: cat.attributes?.description || "",
        };
      });

      console.log("Mapped categories:", mappedCategories);
      setCategories(mappedCategories);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
      console.error("Error details:", error.response?.data || error.message);
      setError(`Failed to load categories: ${error.message}`);
      setLoading(false);
    }
  };

  return (
    <>
      <Section className="bg-white">
        {/* Title constrained to site container */}
        <Container>
          <SectionTitle
            subtitle="Our Categories"
            title="Shop By Category"
            className="mb-6 mt-8"
            subtitleClassName="text-black"
          />
        </Container>

        {/* Full-width categories row */}
        <div className="w-full">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-red-600 mb-4">{error}</p>
              <div className="flex justify-center">
                <button
                  onClick={fetchCategories}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 mb-4">
                No categories found. Please add categories in Strapi admin.
              </p>
              <div className="flex justify-center">
                <button
                  onClick={fetchCategories}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Refresh
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full overflow-hidden py-6">
              <div className="px-4 lg:px-12">
                {/* Desktop / Tablet grid */}
                <div className="hidden sm:grid gap-4 items-start sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                  {categories.map((item) => (
                    <Link
                      href={`/shop/${item.slug}`}
                      key={item.id}
                      className="group"
                    >
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-full aspect-[4/5] md:aspect-[5/6] min-h-[320px] md:min-h-[360px] lg:min-h-[420px] rounded-2xl overflow-hidden shadow-lg bg-primary flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl relative`}
                        >
                          <div className="relative w-full h-full">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                              unoptimized={item.image.startsWith("http")}
                            />
                          </div>
                          <div className="absolute inset-0 group-hover:bg-primary/10 transition-colors duration-300"></div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Mobile: grid layout (2 cols x 3 rows) for first 5 categories.
                    Layout: fill left-to-right, top-to-bottom. Last (index 4) spans both columns. */}
                <div className="sm:hidden py-4 px-2">
                  <div className="grid grid-cols-2 grid-rows-2 gap-3">
                    {categories.slice(0, 4).map((item, idx) => {
                      const spanClass = idx === 4 ? "col-span-2" : "col-span-1";
                      return (
                        <Link
                          href={`/shop/${item.slug}`}
                          key={item.id}
                          className={`group ${spanClass}`}
                        >
                          <div className="flex flex-col items-center h-full">
                            <div
                              className={`w-full h-full min-h-[220px] rounded-2xl overflow-hidden shadow-lg bg-primary flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl relative`}
                            >
                              <div className="relative w-full h-full">
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                  unoptimized={item.image.startsWith("http")}
                                />
                              </div>
                              <div className="absolute inset-0 group-hover:bg-primary/10 transition-colors duration-300"></div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Section>

      <style jsx>{``}</style>
    </>
  );
};

export default CategorySec;
