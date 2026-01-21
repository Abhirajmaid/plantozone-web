"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Star, Heart, Share2, Plus, Minus } from "lucide-react";
import { Icon } from "@iconify/react";
import PrimaryButton from "@/src/components/common/PrimaryButton";
import SecondaryButton from "@/src/components/common/SecondaryButton";
import { Badge } from "@/src/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/src/components/ui/breadcrumb";
import { Section } from "@/src/components/layout/Section";
import { Container } from "@/src/components/layout/Container";
import { Diver, TestimonialSwiper, ShopServiceSection, SectionTitle, ProductCard, NewsletterSection } from "@/src/components";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import plantsAction from "@/src/lib/action/plants.action";
import { addToCart as addToCartUtil, getCartItems } from "@/src/lib/utils/cartUtils";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OFFER_PLANT_IDS = [64, 47]; // Bonsai plants with 30% off offer
const OFFER_DISCOUNT = 30;

export default function ProductPage() {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("Small");
  const [selectedShape, setSelectedShape] = useState("Hexagonal");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewForm, setReviewForm] = useState({
    name: "",
    email: "",
    title: "",
    review: "",
    rating: 0
  });
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [product, setProduct] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("additional-info");
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [relatedSwiper, setRelatedSwiper] = useState(null);
  const relatedPrevRef = useRef(null);
  const relatedNextRef = useRef(null);

  const params = useParams();
  const router = useRouter();
  const productId = params.slug;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResponse = await plantsAction.getPlantById(productId);
        setProduct(productResponse?.data?.data);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, [productId]);

  // Fetch related products when product is loaded
  useEffect(() => {
    if (product?.id) {
      fetchRelatedProducts();
    }
  }, [product?.id]);

  // Setup swiper navigation
  useEffect(() => {
    if (relatedSwiper && relatedSwiper.params) {
      relatedSwiper.params.navigation.prevEl = relatedPrevRef.current;
      relatedSwiper.params.navigation.nextEl = relatedNextRef.current;
      relatedSwiper.navigation.init();
      relatedSwiper.navigation.update();
    }
  }, [relatedSwiper]);

  const fetchRelatedProducts = async () => {
    try {
      setLoadingRelated(true);
      const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
      const NO_PREVIEW_IMG = "/images/plant.png";
      
      const resp = await plantsAction.getPlants();
      const plants = resp.data.data || [];
      
      // Filter out current product and get related products (same category or random)
      const filtered = plants.filter((plant) => plant.id !== product.id);
      
      // Process and map plants data
      const processedPlants = filtered.slice(0, 12).map((plant) => {
        const attrs = plant.attributes || {};
        
        // Handle image URL - prepend Strapi base URL if relative
        let imageUrl = NO_PREVIEW_IMG;
        const strapiImageUrl = attrs?.images?.data?.[0]?.attributes?.url;
        if (strapiImageUrl) {
          imageUrl = strapiImageUrl.startsWith('http') 
            ? strapiImageUrl 
            : `${STRAPI_BASE_URL}${strapiImageUrl}`;
        }
        
        // Return plant data in expected format
        return {
          id: plant.id,
          attributes: {
            ...attrs,
            images: {
              data: [{
                attributes: {
                  url: imageUrl
                }
              }]
            }
          }
        };
      });
      
      setRelatedProducts(processedPlants);
      setLoadingRelated(false);
    } catch (error) {
      console.error("Error fetching related products:", error);
      setLoadingRelated(false);
    }
  };

  // Handler for adding to cart from related products
  const handleRelatedAddToCart = (item, { size, shape, price }) => {
    const attrs = item.attributes;
    const NO_PREVIEW_IMG = "/images/plant.png";
    const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
    const strapiImageUrl = attrs?.images?.data?.[0]?.attributes?.url;
    let imageUrl = NO_PREVIEW_IMG;
    if (strapiImageUrl) {
      imageUrl = strapiImageUrl.startsWith('http') 
        ? strapiImageUrl 
        : `${STRAPI_BASE_URL}${strapiImageUrl}`;
    }
    addToCartUtil({
      product: item.id,
      title: attrs.title,
      price: price,
      size: size,
      shape: shape,
      quantity: 1,
      image: imageUrl,
    });
  };

  const addToCart = () => {
    if (!selectedSize) {
      alert("Please select a plant size");
      return;
    }
    if (!selectedShape) {
      alert("Please select a plant shape");
      return;
    }

    const price = selectedSize === "Medium" ? 850 : 650;
    const newItem = {
      product: product.id,
      title: product?.attributes?.title,
      price: price,
      size: selectedSize,
      shape: selectedShape,
      quantity: quantity,
      image: product?.attributes?.images?.data[0]?.attributes?.url || "",
    };

    addToCartUtil(newItem);
    setShowSuccess(true);
    toast.success("Successfully added to cart!", {
      position: "top-right",
      autoClose: 2000,
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      ),
    });
    setTimeout(() => setShowSuccess(false), 2000);
  };

  // Review form handlers
  const handleReviewInputChange = (field, value) => {
    setReviewForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStarClick = (rating) => {
    setReviewRating(rating);
    setReviewForm(prev => ({
      ...prev,
      rating: rating
    }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!reviewForm.name || !reviewForm.email || !reviewForm.title || !reviewForm.review || reviewForm.rating === 0) {
      toast.error("Please fill in all required fields and select a rating", {
        position: "top-right"
      });
      return;
    }

    const reviewData = {
      name: reviewForm.name,
      email: reviewForm.email,
      title: reviewForm.title,
      review: reviewForm.review,
      rating: reviewForm.rating,
      productId: product?.id,
      productTitle: product?.attributes?.title,
      date: new Date().toISOString(),
      status: 'pending' // For moderation
    };

    // Console log the data
    console.log("Review Data to be sent to Strapi:", reviewData);

    // TODO: Send to Strapi backend
    // const response = await fetch('/api/reviews', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(reviewData)
    // });

    toast.success("Review submitted successfully! Thank you for your feedback.", {
      position: "top-right"
    });

    // Reset form
    setReviewForm({
      name: "",
      email: "",
      title: "",
      review: "",
      rating: 0
    });
    setReviewRating(0);
  };

  const buyNow = () => {
    if (!selectedSize) {
      alert("Please select a plant size");
      return;
    }
    if (!selectedShape) {
      alert("Please select a plant shape");
      return;
    }

    const price = selectedSize === "Medium" ? 850 : 650;
    const newItem = {
      product: product.id,
      title: product?.attributes?.title,
      price: price,
      size: selectedSize,
      shape: selectedShape,
      quantity: quantity,
      image: product?.attributes?.images?.data[0]?.attributes?.url || "",
    };

    addToCartUtil(newItem);
    toast.success("Added to cart! Redirecting to checkout...", {
      position: "top-right",
      autoClose: 1500,
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      ),
    });

    // Redirect to checkout after a short delay
    setTimeout(() => {
      router.push("/checkouts");
    }, 1500);
  };

  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  const handleSizeSelect = (size) => setSelectedSize(size);
  const handleShapeSelect = (shape) => setSelectedShape(shape);

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading product details...</p>
      </div>
    );
  }

  // Check if current product has offer
  const hasOffer = OFFER_PLANT_IDS.includes(product.id);

  return (
    <Section className="min-h-screen relative">
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce">
          <div className="flex items-center gap-2">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>Successfully added to cart!</span>
          </div>
        </div>
      )}
      <Container className="mx-auto px-4 sm:px-6 lg:px-8 xl:px-[100px] py-4 sm:py-6 lg:py-8 pt-24 lg:pt-[120px]">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-4 lg:mb-8 flex items-center gap-2 text-xs sm:text-sm lg:text-base">
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="text-gray-600 hover:text-green-600">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <span className="text-gray-400">/</span>
          <BreadcrumbItem>
            <BreadcrumbLink href="/shop" className="text-gray-600 hover:text-green-600">Plants</BreadcrumbLink>
          </BreadcrumbItem>
          <span className="text-gray-400">/</span>
          <BreadcrumbItem>
            <span className="text-gray-800 font-medium">{product.attributes.title}</span>
          </BreadcrumbItem>
        </Breadcrumb>

        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Product Image Gallery */}
          <div className="w-full relative">
            {/* Offer Badge on Image */}
            {hasOffer && (
              <div className="absolute top-4 left-4 z-20">
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg shadow-2xl transform rotate-[-5deg]">
                  <div className="text-2xl font-bold">{OFFER_DISCOUNT}% OFF</div>
                  <div className="text-xs font-medium">Limited Time</div>
                </div>
              </div>
            )}
            {/* Main Product Image */}
            <div className="aspect-square w-full bg-white rounded-xl shadow-lg mb-4 overflow-hidden relative">
              <img
                src={product.attributes.images.data[selectedImageIndex]?.attributes.url || product.attributes.images.data[0]?.attributes.url}
                alt={product.attributes.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnail Images - Always show, even for single image */}
            <div className="flex gap-3">
              {product.attributes.images.data.map((image, index) => (
                <div 
                  key={index} 
                  className={`w-20 h-20 bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 border-2 ${
                    selectedImageIndex === index ? 'border-yellow-400 shadow-lg' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img
                    src={image.attributes.url}
                    alt={`${product.attributes.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Category */}
            <p className="text-sm text-gray-500 uppercase tracking-wide">Indoor Plant</p>
            
            {/* Product Name */}
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 flex-1">
                {product.attributes.title}
              </h1>
              {/* Offer Badge next to title */}
              {hasOffer && (
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg">
                  <div className="text-lg font-bold">{OFFER_DISCOUNT}% OFF</div>
                  <div className="text-xs font-medium">Special Offer</div>
                </div>
              )}
            </div>

            {/* Dynamic Stock Status Badge */}
            {/* Logic: Show "In Stock" if >10 items, show exact count if 1-10 items, show "Out of Stock" if 0 */}
            <div className="flex items-center gap-3">
              {(() => {
                const stockQuantity = product.attributes.stock || 0;
                if (stockQuantity > 10) {
                  return (
                    <Badge className="bg-green-100 text-green-800 px-3 py-1 text-sm font-medium">
                      In Stock
                    </Badge>
                  );
                } else if (stockQuantity > 0) {
                  return (
                    <Badge className="bg-orange-100 text-orange-800 px-3 py-1 text-sm font-medium">
                      Only {stockQuantity} left
                    </Badge>
                  );
                } else {
                  return (
                    <Badge className="bg-red-100 text-red-800 px-3 py-1 text-sm font-medium">
                      Out of Stock
                    </Badge>
                  );
                }
              })()}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                />
              ))}
              </div>
              <span className="text-gray-600">4.9 (245 Review)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              {hasOffer ? (
                <>
                  <div className="flex flex-col">
                    <span className="text-3xl font-bold text-green-600">
                      ₹{Math.round((selectedSize === "Medium" ? 850 : 650) * (1 - OFFER_DISCOUNT / 100))}
                    </span>
                    <span className="text-sm text-gray-500">After {OFFER_DISCOUNT}% discount</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl text-gray-400 line-through">₹{selectedSize === "Medium" ? "850" : "650"}</span>
                    <span className="text-sm text-green-600 font-semibold">Save ₹{Math.round((selectedSize === "Medium" ? 850 : 650) * (OFFER_DISCOUNT / 100))}</span>
                  </div>
                </>
              ) : (
                <>
                  <span className="text-3xl font-bold text-gray-800">₹{selectedSize === "Medium" ? "850" : "650"}</span>
                  <span className="text-xl text-gray-400 line-through">₹{selectedSize === "Medium" ? "1,499" : "1,099"}</span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
            </p>

            {/* Plant Size Selection */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">Plant Size</label>
              <div className="flex gap-2">
                {["Small", "Medium"].map((size) => (
                <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedSize === size
                        ? "bg-yellow-400 text-gray-800"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {size}
                </button>
                ))}
              </div>
            </div>

            {/* Plant Shape Selection */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">Plant Shape</label>
              <div className="flex gap-2">
                {["Hexagonal", "Round"].map((shape) => (
                <button
                    key={shape}
                    onClick={() => setSelectedShape(shape)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedShape === shape
                        ? "bg-yellow-400 text-gray-800"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {shape}
                </button>
                ))}
              </div>
            </div>


            {/* Quantity Selector */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">Quantity</label>
              <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-50 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 text-lg font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-gray-50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons - Hidden on mobile, shown on desktop */}
            <div className="hidden md:flex gap-4">
              <SecondaryButton onClick={addToCart} withArrow={false} className="flex-1">
                Add To Cart
              </SecondaryButton>
              <PrimaryButton onClick={buyNow} withArrow={false} className="flex-1">
                Buy Now
              </PrimaryButton>
              <button className="border-2 border-gray-300 hover:border-gray-400 rounded-lg w-12 h-12 inline-flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </button>
            </div>

            {/* SKU & Tags */}
            <div className="space-y-2 text-sm text-gray-600">
              <p><span className="font-medium">SKU:</span> PLTC87654ABC</p>
              <p><span className="font-medium">Tags:</span> Indoor Plant, Monstera deliciosa, Plants</p>
            </div>

            {/* Share Icons */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Share :</span>
              <div className="flex gap-2">
                <a
                  href="https://www.facebook.com/sharer/sharer.php?u=https://plantozone.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center transition-colors"
                >
                  <Icon icon="mdi:facebook" className="w-4 h-4 text-white" />
                </a>
                <a
                  href="https://twitter.com/intent/tweet?url=https://plantozone.com&text=Check out this amazing plant!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center transition-colors"
                >
                  <Icon icon="mdi:twitter" className="w-4 h-4 text-white" />
                </a>
                <a
                  href="https://pinterest.com/pin/create/button/?url=https://plantozone.com&media=&description=Check out this amazing plant!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center transition-colors"
                >
                  <Icon icon="mdi:pinterest" className="w-4 h-4 text-white" />
                </a>
                <a
                  href="https://www.instagram.com/plantozone"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center transition-colors"
                >
                  <Icon icon="mdi:instagram" className="w-4 h-4 text-white" />
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* Product Information Tabs */}
        <div className="mb-12">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="flex space-x-8">
              {[
                { id: "description", label: "Description" },
                { id: "additional-info", label: "Additional Information" },
                { id: "review", label: "Review" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-yellow-400 text-gray-900"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {activeTab === "description" && (
              <div className="prose max-w-none">
                <p className="text-gray-600 leading-relaxed mb-6">
                  This beautiful plant brings natural beauty to your home or office. This plant is perfect for India's climate and grows easily.
                </p>
                <p className="text-gray-600 leading-relaxed mb-6">
                  This plant purifies the air and makes your living space healthy. It grows well even in low light, which is ideal for Indian homes.
                </p>
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Key Features:</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Perfect for Indian climate</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Grows well in low light</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Air purifying properties</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Easy maintenance</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Beautiful foliage and growth</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Perfect for Indian homes</span>
                    </li>
                  </ul>
                </div>
                
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Care Instructions:</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Water 2-3 times a week</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>4-6 hours of sunlight daily</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Fertilize once a month</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "additional-info" && (
              <div className="overflow-hidden border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-yellow-400">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                        Attribute
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Plant Size
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        10-12 inches (25-30 cm)
                      </td>
                    </tr>
                    <tr className="bg-white">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Light Requirements
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        Bright, indirect sunlight
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Watering Needs
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        Water every 1-2 weeks
                      </td>
                    </tr>
                    <tr className="bg-white">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Growth Rate
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        Moderate growth rate indoors
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Pot Material
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        Ceramic pot with drainage hole
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "review" && (
              <div className="space-y-8">
                {/* Overall Rating Summary */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl font-bold text-gray-800">4.9</div>
                      <div>
                        <div className="flex items-center space-x-1 mb-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Icon key={star} icon="material-symbols:star" className="w-5 h-5 text-yellow-400" />
                          ))}
                        </div>
                        <p className="text-sm text-gray-600">245 Reviews</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600 w-8">{rating}</span>
                          <Icon icon="material-symbols:star" className="w-4 h-4 text-yellow-400" />
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-yellow-400 h-2 rounded-full" 
                              style={{ width: `${rating === 5 ? 85 : rating === 4 ? 10 : rating === 3 ? 3 : rating === 2 ? 1 : 1}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Review List */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-800">Review List</h3>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600">Showing 1-4 of 24 reviews</span>
                      <select className="border border-gray-300 rounded-md px-3 py-1 text-sm">
                        <option>Sort by: Newest</option>
                        <option>Sort by: Oldest</option>
                        <option>Sort by: Highest Rating</option>
                        <option>Sort by: Lowest Rating</option>
                      </select>
                    </div>
                  </div>

                  {/* Individual Reviews */}
                  <div className="space-y-6">
                    {/* Review 1 */}
                    <div className="border-b border-gray-200 pb-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                          P
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-800">Priya Sharma</h4>
                            <div className="flex items-center space-x-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Icon key={star} icon="material-symbols:star" className="w-4 h-4 text-yellow-400" />
                              ))}
                              <span className="text-sm text-gray-600 ml-2">5.0</span>
                            </div>
                          </div>
                          <h5 className="font-medium text-gray-700 mb-2">Perfect for my Mumbai apartment!</h5>
                          <p className="text-gray-600 text-sm leading-relaxed mb-2">
                            This plant is absolutely beautiful! It's been 2 months and it's thriving in my Mumbai apartment. 
                            The humidity here is perfect for this plant. Delivery was super fast and packaging was excellent.
                          </p>
                          <span className="text-xs text-gray-500">2 weeks ago</span>
                        </div>
                      </div>
                    </div>

                    {/* Review 2 */}
                    <div className="border-b border-gray-200 pb-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                          A
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-800">Arjun Patel</h4>
                            <div className="flex items-center space-x-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Icon key={star} icon="material-symbols:star" className="w-4 h-4 text-yellow-400" />
                              ))}
                              <span className="text-sm text-gray-600 ml-2">5.0</span>
                            </div>
                          </div>
                          <h5 className="font-medium text-gray-700 mb-2">Great quality, excellent service</h5>
                          <p className="text-gray-600 text-sm leading-relaxed mb-2">
                            Ordered this for my office in Bangalore. The plant arrived in perfect condition. 
                            Customer service team was very helpful with care instructions. Highly recommend!
                          </p>
                          <span className="text-xs text-gray-500">1 month ago</span>
                        </div>
                      </div>
                    </div>

                    {/* Review 3 */}
                    <div className="border-b border-gray-200 pb-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center text-white font-semibold">
                          S
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-800">Sneha Reddy</h4>
                            <div className="flex items-center space-x-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Icon key={star} icon="material-symbols:star" className="w-4 h-4 text-yellow-400" />
                              ))}
                              <span className="text-sm text-gray-600 ml-2">5.0</span>
                            </div>
                          </div>
                          <h5 className="font-medium text-gray-700 mb-2">Love the plant, love the service!</h5>
                          <p className="text-gray-600 text-sm leading-relaxed mb-2">
                            This is my third order from Plantozone. The quality is consistently excellent. 
                            The plant is growing beautifully in my Delhi home. Thank you for such amazing service!
                          </p>
                          <span className="text-xs text-gray-500">3 weeks ago</span>
                        </div>
                      </div>
                    </div>

                    {/* Review 4 */}
                    <div className="border-b border-gray-200 pb-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                          R
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-800">Rajesh Kumar</h4>
                            <div className="flex items-center space-x-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Icon key={star} icon="material-symbols:star" className="w-4 h-4 text-yellow-400" />
                              ))}
                              <span className="text-sm text-gray-600 ml-2">5.0</span>
                            </div>
                          </div>
                          <h5 className="font-medium text-gray-700 mb-2">Excellent plant, fast delivery</h5>
                          <p className="text-gray-600 text-sm leading-relaxed mb-2">
                            Ordered this for my wife's birthday. She absolutely loves it! The plant is healthy and beautiful. 
                            Delivery was on time and packaging was perfect. Will definitely order again.
                          </p>
                          <span className="text-xs text-gray-500">1 week ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Add Your Review Form */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Add your review</h3>
                  <p className="text-sm text-gray-600 mb-6">* Required fields</p>
                  
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                        <input 
                          type="text" 
                          value={reviewForm.name}
                          onChange={(e) => handleReviewInputChange('name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          placeholder="Enter your name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                        <input 
                          type="email" 
                          value={reviewForm.email}
                          onChange={(e) => handleReviewInputChange('email', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating *</label>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button 
                            key={star} 
                            type="button" 
                            onClick={() => handleStarClick(star)}
                            className="transition-colors"
                          >
                            <Icon 
                              icon="material-symbols:star" 
                              className={`w-6 h-6 ${
                                star <= reviewRating 
                                  ? 'text-yellow-400' 
                                  : 'text-gray-300 hover:text-yellow-200'
                              }`} 
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Add Review Title *</label>
                      <input 
                        type="text" 
                        value={reviewForm.title}
                        onChange={(e) => handleReviewInputChange('title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="Enter review title"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Add Detailed Review *</label>
                      <textarea 
                        rows="4"
                        value={reviewForm.review}
                        onChange={(e) => handleReviewInputChange('review', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="Share your experience with this product"
                        required
                      ></textarea>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Photo / Video</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Icon icon="material-symbols:cloud-upload" className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-2">Drag and drop your files here, or</p>
                        <PrimaryButton type="button" withArrow={false} className="!px-4 !py-2 rounded-md bg-white text-yellow-600 hover:text-yellow-700 shadow-none hover:scale-100">
                          Browse
                        </PrimaryButton>
                      </div>
                    </div>
                    
                <SecondaryButton type="submit" withArrow={false} className="px-6 py-2 rounded-md">
                  Submit
                </SecondaryButton>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mb-16">
          <SectionTitle 
            subtitle="Related Products"
            title="Explore Related Products"
            className="mb-8 md:mb-12"
          />

          {/* Loading State */}
          {loadingRelated ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : relatedProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600">No related products available at the moment.</p>
            </div>
          ) : (
            /* Swiper Carousel */
            <div className="relative">
              <Swiper
                modules={[Navigation, Autoplay]}
                onSwiper={setRelatedSwiper}
                navigation={{
                  prevEl: relatedPrevRef.current,
                  nextEl: relatedNextRef.current,
                }}
                spaceBetween={20}
                slidesPerView={1}
                breakpoints={{
                  640: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                  },
                  768: {
                    slidesPerView: 3,
                    spaceBetween: 24,
                  },
                  1024: {
                    slidesPerView: 4,
                    spaceBetween: 24,
                  },
                  1280: {
                    slidesPerView: 4,
                    spaceBetween: 30,
                  },
                }}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                loop={relatedProducts.length > 4}
                className="related-products-swiper"
              >
                {relatedProducts.map((product) => (
                  <SwiperSlide key={product.id}>
                    <div className="px-1">
                      <ProductCard
                        data={product}
                        onAddToCart={(opts) => handleRelatedAddToCart(product, opts)}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Custom Navigation Buttons */}
              {relatedProducts.length > 4 && (
                <>
                  <button 
                    ref={relatedPrevRef}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                    aria-label="Previous"
                  >
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button 
                    ref={relatedNextRef}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                    aria-label="Next"
                  >
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Services Section */}
        <div className="mb-16">
          <ShopServiceSection />
        </div>

      </Container>

      {/* Newsletter Section */}
      <NewsletterSection />

      {/* Mobile Bottom Bar - Only visible on mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-[110]">
        <div className="flex items-center justify-between p-3 gap-2">
          {/* Price Display */}
          <div className="flex flex-col min-w-[80px]">
            <span className="text-[10px] text-gray-500 uppercase">Price</span>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold text-green-600">
                ₹{selectedSize === "Medium" ? "850" : "650"}
              </span>
              <span className="text-xs text-gray-400 line-through">
                ₹{selectedSize === "Medium" ? "1,499" : "1,099"}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 flex-1">
            <button
              onClick={addToCart}
              className="flex-1 bg-green-700 hover:bg-green-800 text-white font-semibold py-2.5 px-3 rounded-lg text-xs uppercase tracking-wide transition-colors shadow-md"
            >
              Add To Cart
            </button>
            <button
              onClick={buyNow}
              className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2.5 px-3 rounded-lg text-xs uppercase tracking-wide transition-colors shadow-md"
            >
              Buy Now
            </button>
          </div>
        </div>

        {/* Free Delivery Banner */}
        <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2">
          <div className="flex items-center justify-center gap-2 text-xs font-medium">
            <span>🚚</span>
            <span>FREE Delivery on Orders Above ₹2000!</span>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Padding - To prevent content from being hidden behind the bottom bar */}
      <div className="md:hidden h-[120px]"></div>
    </Section>
  );
}
