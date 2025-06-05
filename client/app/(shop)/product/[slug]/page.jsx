"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Star } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/src/components/ui/breadcrumb";
import { Section } from "@/src/components/layout/Section";
import { Container } from "@/src/components/layout/Container";
import { Diver, NewArrivals, TestimonialSwiper } from "@/src/components";
import plantsAction from "@/src/lib/action/plants.action";
import { addToCart as addToCartUtil } from "@/src/lib/utils/cartUtils";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProductPage() {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedShape, setSelectedShape] = useState("");
  const [product, setProduct] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const params = useParams();
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
  }, []);

  const addToCart = () => {
    if (!selectedSize) {
      alert("Please select a plant size");
      return;
    }
    if (!selectedShape) {
      alert("Please select a plant shape");
      return;
    }

    const price = selectedSize === "8 Inch" ? 850 : 650;
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
      <Container className="mx-auto px-4 sm:px-6 lg:px-8 xl:px-[100px] py-4 sm:py-6 lg:py-8 pt-16 lg:pt-[100px]">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-4 lg:mb-8 flex gap-1 text-xs sm:text-sm lg:text-base">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/plants">Plants</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink>{product.attributes.title}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          {/* Product Image */}
          <div className="w-full">
            <div className="aspect-square w-full sm:w-[80%] lg:w-full mx-auto bg-gray-100 rounded-lg mb-4">
              <img
                src={product.attributes.images.data[0]?.attributes.url}
                alt={product.attributes.title}
                className="w-full h-full object-cover rounded-lg border-2 border-secondary"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-4 sm:space-y-6">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold">
              {product.attributes.title}
            </h1>

            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400"
                />
              ))}
              <span className="ml-2 text-xs sm:text-sm text-gray-600">5.0</span>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
              <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600">
                ₹{selectedSize === "8 Inch" ? "850" : "650"}
              </span>
              <span className="text-sm sm:text-base text-gray-500 line-through">
                ₹{selectedSize === "8 Inch" ? "1,499" : "1,099"}
              </span>
              <Badge
                variant="secondary"
                className="bg-yellow-100 text-yellow-800 text-xs sm:text-sm"
              >
                -50%
              </Badge>
            </div>

            {/* Size Selection */}
            <div className="flex flex-col items-start">
              <label className="mb-2 text-xs sm:text-sm font-medium text-gray-700">
                SELECT PLANT SIZE
              </label>
              <div className="flex flex-wrap gap-2 sm:gap-4">
                <button
                  onClick={() => handleSizeSelect("6 Inch")}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base border-2 rounded-md ${
                    selectedSize === "6 Inch"
                      ? "bg-green-600 text-white"
                      : "border-green-600 text-green-600"
                  } hover:bg-green-100`}
                >
                  6 Inch
                </button>
                <button
                  onClick={() => handleSizeSelect("8 Inch")}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base border-2 rounded-md ${
                    selectedSize === "8 Inch"
                      ? "bg-green-600 text-white"
                      : "border-green-600 text-green-600"
                  } hover:bg-green-100`}
                >
                  8 Inch
                </button>
              </div>
            </div>

            {/* Shape Selection */}
            <div className="flex flex-col items-start mt-4">
              <label className="mb-2 text-xs sm:text-sm font-medium text-gray-700">
                SELECT PLANT SHAPE
              </label>
              <div className="flex flex-wrap gap-2 sm:gap-4">
                <button
                  onClick={() => handleShapeSelect("Hexagonal")}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base border-2 rounded-md ${
                    selectedShape === "Hexagonal"
                      ? "bg-green-600 text-white"
                      : "border-green-600 text-green-600"
                  } hover:bg-green-100`}
                >
                  Hexagonal
                </button>
                <button
                  onClick={() => handleShapeSelect("Round")}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base border-2 rounded-md ${
                    selectedShape === "Round"
                      ? "bg-green-600 text-white"
                      : "border-green-600 text-green-600"
                  } hover:bg-green-100`}
                >
                  Round
                </button>
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <div className="flex items-center border rounded-md">
                <button
                  onClick={handleDecrease}
                  className="px-3 py-2 border-r hover:bg-gray-200"
                >
                  -
                </button>
                <input
                  type="text"
                  value={quantity}
                  readOnly
                  className="w-12 text-center text-sm sm:text-base"
                />
                <button
                  onClick={handleIncrease}
                  className="px-3 py-2 border-l hover:bg-gray-200"
                >
                  +
                </button>
              </div>
              <Button
                onClick={addToCart}
                className="w-full sm:flex-1 bg-green-600 hover:bg-green-700 py-4 sm:py-5 text-sm sm:text-base"
              >
                ADD TO CART
              </Button>
            </div>
          </div>
        </div>

        {/* More Sections */}
        <Diver className="my-10 sm:my-16 lg:my-20" />
        <NewArrivals />
        <TestimonialSwiper />
      </Container>
    </Section>
  );
}
