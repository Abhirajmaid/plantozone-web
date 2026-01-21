"use client";
import { Itemlist, Loader } from "@/src/components";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import plantsAction from "@/src/lib/action/plants.action";
import categoriesAction from "@/src/lib/action/categories.action";

const page = () => {
  const params = useParams();
  const categorySlug = params.category || '';
  const [data, setData] = useState(null);
  const [categoryTitle, setCategoryTitle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [categorySlug]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Decode the category slug (handle URL encoding)
      // Next.js params might already be decoded, but handle both cases
      let decodedSlug = categorySlug || '';
      try {
        decodedSlug = decodeURIComponent(decodedSlug);
      } catch (e) {
        // If already decoded, use as is
        decodedSlug = categorySlug || '';
      }
      
      console.log('Raw category slug from URL:', categorySlug);
      console.log('Decoded category slug:', decodedSlug);
      
      // Fetch both products and categories
      const [plantsResp, categoriesResp] = await Promise.all([
        plantsAction.getPlants(),
        categoriesAction.getCategories()
      ]);

      const allPlants = plantsResp.data.data || [];
      const allCategories = categoriesResp.data.data || [];

      // Log available slugs for debugging
      console.log('Looking for slug:', decodedSlug);
      console.log('Available category slugs:', allCategories.map(c => ({
        slug: c.attributes?.slug,
        title: c.attributes?.title
      })));

      // Normalize slug for comparison (handle various & encodings)
      const normalizeSlug = (slug) => {
        return slug
          .toLowerCase()
          .replace(/&amp;/g, '&')
          .replace(/&/g, '&')
          .replace(/\s+/g, '-')
          .replace(/[^\w-&]/g, '');
      };

      // Find category by slug - try multiple matching strategies
      let matchedCategory = null;
      
      // Strategy 1: Exact match
      matchedCategory = allCategories.find(
        cat => cat.attributes?.slug === decodedSlug
      );
      
      // Strategy 2: Normalized match (handle & variations)
      if (!matchedCategory) {
        const normalizedDecoded = normalizeSlug(decodedSlug);
        matchedCategory = allCategories.find(cat => {
          const catSlug = cat.attributes?.slug || '';
          return normalizeSlug(catSlug) === normalizedDecoded;
        });
      }
      
      // Strategy 3: Try replacing & with "and" and vice versa (both directions)
      if (!matchedCategory) {
        // Create variations of the decoded slug
        const slugVariations = [
          decodedSlug,
          decodedSlug.replace(/&/g, 'and'),
          decodedSlug.replace(/&amp;/g, 'and'),
          decodedSlug.replace(/and/g, '&'),
          decodedSlug.replace(/-and-/g, '-&-'),
          decodedSlug.replace(/-&-/g, '-and-')
        ];
        
        matchedCategory = allCategories.find(cat => {
          const catSlug = cat.attributes?.slug || '';
          // Create variations of the category slug
          const catSlugVariations = [
            catSlug,
            catSlug.replace(/&/g, 'and'),
            catSlug.replace(/&amp;/g, 'and'),
            catSlug.replace(/and/g, '&'),
            catSlug.replace(/-and-/g, '-&-'),
            catSlug.replace(/-&-/g, '-and-')
          ];
          
          // Check if any variation matches
          return slugVariations.some(slugVar => 
            catSlugVariations.some(catVar => 
              slugVar.toLowerCase() === catVar.toLowerCase() ||
              normalizeSlug(slugVar) === normalizeSlug(catVar)
            )
          );
        });
      }
      
      // Strategy 4: Case-insensitive match
      if (!matchedCategory) {
        matchedCategory = allCategories.find(cat => {
          const catSlug = (cat.attributes?.slug || '').toLowerCase();
          return catSlug === decodedSlug.toLowerCase();
        });
      }
      
      // Strategy 5: Try to match by title (if slug doesn't work)
      if (!matchedCategory) {
        // Try to extract category name from slug and match by title
        const possibleTitle = decodedSlug
          .replace(/-/g, ' ')
          .replace(/&/g, '&')
          .replace(/&amp;/g, '&')
          .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize words
        
        matchedCategory = allCategories.find(cat => {
          const catTitle = (cat.attributes?.title || '').toLowerCase();
          const normalizedTitle = possibleTitle.toLowerCase();
          return catTitle === normalizedTitle || 
                 catTitle.includes(normalizedTitle) ||
                 normalizedTitle.includes(catTitle);
        });
      }

      if (matchedCategory) {
        const categoryName = matchedCategory.attributes?.title;
        const matchedSlug = matchedCategory.attributes?.slug;
        setCategoryTitle(categoryName);
        
        // Pass all plants to Itemlist and let it handle filtering with initialCategory
        // This ensures consistent filtering logic
        console.log(`✅ Category found: "${categoryName}"`);
        console.log(`   Matched slug: "${matchedSlug}" (was looking for: "${decodedSlug}")`);
        console.log(`   Total plants available: ${allPlants.length}`);
        console.log(`   Setting initialCategory to: "${categoryName}"`);
        setData(allPlants);
      } else {
        // If category not found, show all products
        console.error(`❌ Category with slug "${decodedSlug}" not found.`);
        console.log('Available categories:', allCategories.map(c => ({
          id: c.id,
          title: c.attributes?.title,
          slug: c.attributes?.slug
        })));
        console.log('Trying to find by title match...');
        
        // Last resort: try to find by matching title from slug
        const slugToTitle = decodedSlug
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
          .replace(/&/g, '&')
          .replace(/And/g, '&');
        
        const titleMatch = allCategories.find(cat => {
          const catTitle = (cat.attributes?.title || '').toLowerCase();
          return catTitle.includes(slugToTitle.toLowerCase()) || 
                 slugToTitle.toLowerCase().includes(catTitle);
        });
        
        if (titleMatch) {
          const categoryName = titleMatch.attributes?.title;
          console.log(`✅ Found by title match: "${categoryName}"`);
          setCategoryTitle(categoryName);
          setData(allPlants);
        } else {
          console.warn('No category found, showing all products');
          setData(allPlants);
        }
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      {data ? (
        <Itemlist data={data} initialCategory={categoryTitle} />
      ) : (
        <Loader />
      )}
    </>
  );
};

export default page;
