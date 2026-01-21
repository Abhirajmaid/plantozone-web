"use client";
import React, { useEffect, useState } from "react";
import { Container } from "../../layout/Container";
import { Section } from "../../layout/Section";
import Link from "next/link";
import { InfiniteCategoryMarquee, SectionTitle } from "@/src/components";
import Image from "next/image";
import categoriesAction from "@/src/lib/action/categories.action";

const DEFAULT_CATEGORY_IMAGE = "/images/plant.png";
const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

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
          imageUrl = strapiImageUrl.startsWith('http') 
            ? strapiImageUrl 
            : `${STRAPI_BASE_URL}${strapiImageUrl}`;
        }
        
        return {
          id: cat.id,
          name: title || `Category ${index + 1}`,
          slug: cat.attributes?.slug || title?.toLowerCase().replace(/\s+/g, '-') || `category-${index + 1}`,
          image: imageUrl,
          gradient: cat.attributes?.gradient || gradientColors[index % gradientColors.length],
          description: cat.attributes?.description || ""
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
      {/* Yellow Category Banner */}
      <InfiniteCategoryMarquee />

      <Section className="bg-white">
        <Container>
          <SectionTitle 
            subtitle="Our Categories"
            title="Shop By Category"
            className="mb-12"
            subtitleClassName="text-black"
          />
          
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={fetchCategories}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 mb-4">No categories found. Please add categories in Strapi admin.</p>
              <button 
                onClick={fetchCategories}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Refresh
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-8 md:gap-12">
              {categories.map((item, idx) => (
                <Link href={`/shop/${item.slug}`} key={item.id} className="group">
                  <div className="flex flex-col items-center">
                    <div className={`w-[180px] h-[180px] md:w-[200px] md:h-[200px] rounded-full overflow-hidden shadow-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl relative`}>
                      {/* Image Display */}
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={200}
                        height={200}
                        className="object-cover w-full h-full"
                        unoptimized={item.image.startsWith('http')}
                      />
                      {/* Overlay for better text visibility */}
                      <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors duration-300"></div>
                    </div>
                    <span className="text-sm md:text-base font-semibold text-gray-800 text-center group-hover:text-primary transition-colors duration-300 max-w-[180px] md:max-w-[200px]">
                      {item.name}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </Section>

      <style jsx>{``}</style>
    </>
  );
};

export default CategorySec;
