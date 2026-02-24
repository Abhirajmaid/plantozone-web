"use client";
import React, { useState, useEffect } from "react";
import { ProductCard } from "../..";
import { PrimaryButton } from "@/src/components";
import { Icon } from "@iconify/react";
import {
  addToCart as addToCartUtil,
  getCartItems,
} from "@/src/lib/utils/cartUtils";
import categoriesAction from "@/src/lib/action/categories.action";

const DEFAULT_IMAGE = "/images/plant.png";

// Helper function to normalize category names for comparison
const normalizeCategory = (category) => {
  return category
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[&]/g, "and");
};

// Helper function to check if categories match (flexible matching)
const categoriesMatch = (filterCategory, plantCategory) => {
  const normalizedFilter = normalizeCategory(filterCategory);
  const normalizedPlant = normalizeCategory(plantCategory);

  // Exact match
  if (normalizedFilter === normalizedPlant) return true;

  // Check if one contains the other (handles singular/plural variations)
  if (
    normalizedFilter.includes(normalizedPlant) ||
    normalizedPlant.includes(normalizedFilter)
  ) {
    return true;
  }

  // Check for common variations (singular/plural, with/without spaces, etc.)
  // Remove common suffixes for flexible matching
  const filterBase = normalizedFilter
    .replace(/s$/, "")
    .replace(/plant$/, "")
    .trim();
  const plantBase = normalizedPlant
    .replace(/s$/, "")
    .replace(/plant$/, "")
    .trim();

  if (
    filterBase &&
    plantBase &&
    (filterBase === plantBase ||
      filterBase.includes(plantBase) ||
      plantBase.includes(filterBase))
  ) {
    return true;
  }

  return false;
};

const ItemList = ({ data, initialCategory = null, searchQuery = null }) => {
  const pageSize = 12;
  const [page, setPage] = useState(1);
  const [cartItems, setCartItems] = useState([]);
  const [sortBy, setSortBy] = useState("default");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [filters, setFilters] = useState({
    categories: initialCategory ? [initialCategory] : [],
    priceRange: [0, 1000],
    potSize: [],
    potShape: [],
    availability: [],
  });
  const [filteredData, setFilteredData] = useState([]);

  // Sync initialCategory with filters
  useEffect(() => {
    if (initialCategory) {
      // Check if we need to add it to filters
      if (!filters.categories.includes(initialCategory)) {
        setFilters((prev) => ({
          ...prev,
          categories: [initialCategory],
        }));
      }
    }
  }, [initialCategory]);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const resp = await categoriesAction.getCategories();
        const categories = resp.data.data || [];
        const categoryTitles = categories
          .map((cat) => cat.attributes?.title || "")
          .filter(Boolean);
        setAvailableCategories(categoryTitles);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Initialize filtered data when data changes
  useEffect(() => {
    if (data) {
      setFilteredData(data);
    }
  }, [data]);

  // Filter and sort data
  useEffect(() => {
    let filtered = [...(data || [])];

    console.log("Filtering data:", filtered.length, "items");
    console.log("Current filters:", filters);

    // Apply category filters
    if (filters.categories.length > 0) {
      const beforeFilter = filtered.length;
      filtered = filtered.filter((item) => {
        // Get plant categories from relation
        const plantCategories = item.attributes?.categories?.data || [];
        const plantCategoryTitles = plantCategories
          .map((cat) => cat.attributes?.title || "")
          .filter(Boolean);

        // If plant has no categories, skip it
        if (plantCategoryTitles.length === 0) {
          return false;
        }

        // Check if any selected filter category matches any plant category
        const matches = filters.categories.some((filterCategory) => {
          // First try exact match
          if (plantCategoryTitles.includes(filterCategory)) {
            return true;
          }
          // Then try flexible matching
          return plantCategoryTitles.some((plantCat) =>
            categoriesMatch(filterCategory, plantCat),
          );
        });

        if (!matches) {
          console.log(
            `Item "${item.attributes?.title}" filtered out. Plant categories:`,
            plantCategoryTitles,
            "Filter categories:",
            filters.categories,
          );
        }

        return matches;
      });
      console.log(
        `After category filter: ${beforeFilter} -> ${filtered.length} items`,
      );
    }

    // Apply price filter
    filtered = filtered.filter((item) => {
      const price = item.attributes?.price || 0;
      const maxPrice = filters.priceRange[1];
      console.log(
        `Item: ${item.attributes?.title}, Price: ${price}, MaxPrice: ${maxPrice}, Pass: ${price <= maxPrice}`,
      );
      return price <= maxPrice;
    });
    console.log("After price filter:", filtered.length, "items");

    // (ratings filter removed)

    // Apply availability filter
    if (filters.availability.includes("In Stock")) {
      filtered = filtered.filter((item) => (item.attributes?.stock || 0) > 0);
    }
    if (filters.availability.includes("Out of Stock")) {
      filtered = filtered.filter((item) => (item.attributes?.stock || 0) === 0);
    }

    // Apply sorting
    const isDiscounted = (item) =>
      (parseFloat(item?.attributes?.discountPercent) || 0) > 0;
    switch (sortBy) {
      case "price-low":
        filtered.sort(
          (a, b) => (a.attributes?.price || 0) - (b.attributes?.price || 0),
        );
        break;
      case "price-high":
        filtered.sort(
          (a, b) => (b.attributes?.price || 0) - (a.attributes?.price || 0),
        );
        break;
      case "rating":
        filtered.sort(
          (a, b) => (b.attributes?.rating || 0) - (a.attributes?.rating || 0),
        );
        break;
      case "name":
        filtered.sort((a, b) =>
          (a.attributes?.title || "").localeCompare(
            b.attributes?.title || "",
            undefined,
            { sensitivity: "base" },
          ),
        );
        break;
      default:
        // Discounted first, then A–Z by title
        filtered.sort((a, b) => {
          const aDisc = isDiscounted(a) ? 1 : 0;
          const bDisc = isDiscounted(b) ? 1 : 0;
          if (aDisc !== bDisc) return bDisc - aDisc;
          return (a.attributes?.title || "").localeCompare(
            b.attributes?.title || "",
            undefined,
            { sensitivity: "base" },
          );
        });
        break;
    }

    console.log("Final filtered data:", filtered.length, "items");
    setFilteredData(filtered);
    setPage(1); // Reset to first page when filters change
  }, [data, filters, sortBy]);

  const totalPages = Math.ceil((filteredData?.length || 0) / pageSize);
  const paginatedData = filteredData?.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));

  // Helper to inject default image if missing
  const getCardData = (item) => {
    const imgArr = item?.attributes?.images?.data;
    const url = imgArr?.[0]?.attributes?.url;
    const hasValidUrl = url != null && String(url).trim() !== "";
    if (!imgArr || !hasValidUrl) {
      return {
        ...item,
        attributes: {
          ...item.attributes,
          images: {
            data: [
              {
                id: "default",
                attributes: { url: DEFAULT_IMAGE },
              },
            ],
          },
        },
      };
    }
    return item;
  };

  // Handler for adding to cart (like cart page)
  const handleAddToCart = (item, { size, shape, price }) => {
    const attrs = item.attributes;
    const img = attrs?.images?.data?.[0]?.attributes?.url || DEFAULT_IMAGE;
    addToCartUtil({
      product: item.id,
      title: attrs.title,
      price: price,
      size: size,
      shape: shape,
      quantity: 1,
      image: img,
    });
    setCartItems(getCartItems());
  };

  // Filter handlers
  const handleCategoryChange = (category) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

 
 

  const handleAvailabilityChange = (availability) => {
    setFilters((prev) => ({
      ...prev,
      availability: prev.availability.includes(availability)
        ? prev.availability.filter((a) => a !== availability)
        : [...prev.availability, availability],
    }));
  };

  const handlePotSizeChange = (size) => {
    setFilters((prev) => ({
      ...prev,
      potSize: prev.potSize.includes(size)
        ? prev.potSize.filter((s) => s !== size)
        : [...prev.potSize, size],
    }));
  };

  const handlePotShapeChange = (shape) => {
    setFilters((prev) => ({
      ...prev,
      potShape: prev.potShape.includes(shape)
        ? prev.potShape.filter((s) => s !== shape)
        : [...prev.potShape, shape],
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      categories: [],
      priceRange: [0, 1000],
      potSize: [],
      potShape: [],
      availability: [],
    });
  };

  // Get active filters for display
  const getActiveFilters = () => {
    const active = [];
    if (filters.categories.length > 0)
      active.push(`Category: ${filters.categories.join(", ")}`);
    if (filters.priceRange[1] < 1000) {
      active.push(`Price: ₹0 - ₹${filters.priceRange[1]}`);
    }
    // (ratings filter removed)
    if (filters.availability.length > 0)
      active.push(filters.availability.join(", "));
    return active;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Filter Sidebar */}
      <div className="w-full lg:w-80 bg-white rounded-lg shadow-lg overflow-hidden h-fit">
        {/* Toggle header - visible on mobile, clickable to expand/collapse */}
        <button
          type="button"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="lg:hidden w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
          aria-expanded={isFilterOpen}
          aria-controls="filter-options-content"
        >
          <h3 className="text-xl font-semibold text-gray-800">
            Filter Options
          </h3>
          <Icon
            icon={isFilterOpen ? "mdi:chevron-up" : "mdi:chevron-down"}
            className="w-6 h-6 text-gray-600"
          />
        </button>
        {/* Static header - visible on desktop only */}
        <h3 className="hidden lg:block text-3xl font-semibold text-gray-800 p-6 pt-6 pb-0">
          Filter Options
        </h3>

        {/* Filter content - collapsible on mobile, always visible on desktop */}
        <div
          id="filter-options-content"
          className={`lg:block ${isFilterOpen ? "block" : "hidden"} p-6 pt-4 lg:pt-6`}
        >
          {/* Category Filter */}
          <div className="mb-6">
            <h4 className="text-lg font-medium text-gray-700 mb-3">Category</h4>
            {availableCategories.length > 0 ? (
              <div className="space-y-2">
                {availableCategories.map((category) => (
                  <label
                    key={category}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="text-[16px] text-gray-600">
                      {category}
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {/* Fallback to default categories while loading */}
                {[
                  "Indoor Plants",
                  "Outdoor Plants",
                  "Flowering Plants",
                  "Pet-friendly Plants",
                  "Air-purifying Plants",
                  "Herbs & Edibles",
                ].map((category) => (
                  <label
                    key={category}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="text-[16px] text-gray-600">
                      {category}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Price Filter */}
          <div className="mb-6">
            <h4 className="text-base font-medium text-gray-700 mb-3">Price</h4>
            <div className="space-y-3">
              {/* Price Display */}
              <div className="flex justify-between text-base text-gray-600">
                <span>₹0</span>
                <span>₹1000</span>
              </div>

              {/* Single Range Slider */}
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  value={filters.priceRange[1]}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setFilters((prev) => ({ ...prev, priceRange: [0, value] }));
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                  style={{
                    background: `linear-gradient(to right, #16a34a 0%, #16a34a ${((filters.priceRange[1] - 0) / (1000 - 0)) * 100}%, #e5e7eb ${((filters.priceRange[1] - 0) / (1000 - 0)) * 100}%, #e5e7eb 100%)`,
                  }}
                />
              </div>

              {/* Price Range Display */}
              <div className="text-center text-base text-gray-500">
                ₹0 - ₹{filters.priceRange[1]} (Current: {filters.priceRange[1]})
              </div>
            </div>

            <style jsx>{`
              .slider-thumb::-webkit-slider-thumb {
                appearance: none;
                height: 20px;
                width: 20px;
                border-radius: 50%;
                background: #16a34a;
                cursor: pointer;
                border: 2px solid #fff;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
              }

              .slider-thumb::-moz-range-thumb {
                height: 20px;
                width: 20px;
                border-radius: 50%;
                background: #16a34a;
                cursor: pointer;
                border: 2px solid #fff;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
              }
            `}</style>
          </div>

          {/* (Review and Light Requirements filters removed) */}

          {/* Pot Size */}
          <div className="mb-6">
            <h4 className="text-base font-medium text-gray-700 mb-3">
              Pot Size
            </h4>
            <div className="space-y-2">
              {["Small", "Medium"].map((size) => (
                <label
                  key={size}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filters.potSize.includes(size)}
                    onChange={() => handlePotSizeChange(size)}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="text-base text-gray-600">{size}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Pot Shape */}
          <div className="mb-6">
            <h4 className="text-base font-medium text-gray-700 mb-3">
              Pot Shape
            </h4>
            <div className="space-y-2">
              {["Round", "Hexagonal"].map((shape) => (
                <label
                  key={shape}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filters.potShape.includes(shape)}
                    onChange={() => handlePotShapeChange(shape)}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="text-base text-gray-600">{shape}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="mb-6">
            <h4 className="text-base font-medium text-gray-700 mb-3">
              Availability
            </h4>
            <div className="space-y-2">
              {["In Stock", "Out of Stock"].map((availability) => (
                <label
                  key={availability}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filters.availability.includes(availability)}
                    onChange={() => handleAvailabilityChange(availability)}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="text-base text-gray-600">
                    {availability}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Search query header */}
        {searchQuery && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Search results for &quot;{searchQuery}&quot;
            </h2>
          </div>
        )}

        {/* Results and Sort Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div className="text-gray-600 mb-2 sm:mb-0">
            Showing {(page - 1) * pageSize + 1}-
            {Math.min(page * pageSize, filteredData.length)} of{" "}
            {filteredData.length} results
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600 text-sm">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="default">Discounted first, then A–Z</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Rating</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>

        {/* Active Filters */}
        {getActiveFilters().length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {getActiveFilters().map((filter, index) => (
              <span
                key={index}
                className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center"
              >
                {filter}
                <button
                  onClick={() => {
                    // Remove specific filter logic would go here
                    clearAllFilters();
                  }}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            ))}
            <button
              onClick={clearAllFilters}
              className="text-sm text-gray-600 hover:text-gray-800 underline"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {paginatedData.map((item, id) => (
            <ProductCard
              key={id}
              data={getCardData(item)}
              onAddToCart={(opts) => handleAddToCart(getCardData(item), opts)}
              showAddToCart
            />
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 gap-2">
            <button
              onClick={handlePrev}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon icon="mdi:chevron-left" className="w-4 h-4" />
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`px-3 py-2 ${
                    page === pageNum
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {totalPages > 5 && (
              <>
                <span className="text-gray-500">...</span>
                <button
                  onClick={() => setPage(totalPages)}
                  className={`px-3 py-2 ${
                    page === totalPages
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              onClick={handleNext}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon icon="mdi:chevron-right" className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemList;
