"use client";
import { Star } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion";
import { Badge } from "@/src/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/src/components/ui/breadcrumb";
import { Section } from "@/src/components/layout/Section";
import { Container } from "@/src/components/layout/Container";
import { Diver, NewArrivals, TestimonialSwiper } from "@/src/components";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import plantsAction from "@/src/lib/action/plants.action";
import { CartDrawer } from "@/src/components/section/checkout/CartDrawer";

export default function ProductPage() {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [data, setData] = useState();
  const param = useParams();
  const id = param.slug;

  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }

    const price = selectedSize === "Small" ? 550 : 750;
    const newItem = {
      id: data?.id + selectedSize, // Unique ID based on product and size
      title: data?.attributes?.title,
      price: price,
      size: selectedSize,
      quantity: quantity,
      image: data?.attributes?.images?.data[0]?.attributes?.url,
    };

    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === newItem.id
      );

      if (existingItemIndex > -1) {
        // Update quantity if item exists
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      }

      // Add new item if it doesn't exist
      return [...prevItems, newItem];
    });

    setIsCartOpen(true);
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrease = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleClick = (size) => {
    setSelectedSize(size);
  };

  useEffect(() => {
    getSinglePlant();
  }, []);

  const getSinglePlant = () => {
    plantsAction
      .getPlantById(id)
      .then((resp) => {
        setData(resp.data.data);
      })
      .catch((error) => {
        console.log(error);
        warn(error);
      });
  };

  return (
    <Section className="min-h-screen">
      <Container className="mx-auto px-4 sm:px-6 lg:px-8 xl:px-[100px] py-4 sm:py-6 lg:py-8 pt-16 lg:pt-[100px]">
        {/* Responsive Breadcrumb */}
        <Breadcrumb className="mb-4 lg:mb-8 flex gap-1 text-xs sm:text-sm lg:text-base overflow-x-auto whitespace-nowrap">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/plants">/ Plants</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink className="truncate">
              / {data?.attributes?.title}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          {/* Product Image */}
          <div className="w-full">
            <div className="aspect-square w-full sm:w-[80%] lg:w-full mx-auto bg-gray-100 rounded-lg mb-4">
              <img
                src={data?.attributes?.images?.data[0]?.attributes?.url}
                alt={data?.attributes?.title}
                className="w-full h-full object-cover rounded-lg border-2 border-secondary"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-4 sm:space-y-6">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold">
              {data?.attributes?.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400"
                />
              ))}
              <span className="ml-2 text-xs sm:text-sm text-gray-600">5.0</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
              <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600">
                {selectedSize == "Small" ? "₹550" : "₹750"}
              </span>
              <span className="text-sm sm:text-base text-gray-500 line-through">
                {selectedSize == "Small" ? "₹1,099" : "₹1,499"}
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
                  onClick={() => handleClick("Small")}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base border-2 rounded-md ${
                    selectedSize === "Small"
                      ? "bg-green-600 text-white"
                      : "border-green-600 text-green-600"
                  } hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2`}
                >
                  4 Inch
                </button>
                <button
                  onClick={() => handleClick("Medium")}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base border-2 rounded-md ${
                    selectedSize === "Medium"
                      ? "bg-green-600 text-white"
                      : "border-green-600 text-green-600"
                  } hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2`}
                >
                  6 Inch
                </button>
              </div>
            </div>

            {/* Add to Cart Section */}
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
                className="w-full sm:flex-1 bg-green-600 hover:bg-green-700 py-4 sm:py-5 text-sm sm:text-base"
                onClick={addToCart}
              >
                ADD TO CART
              </Button>
            </div>

            <CartDrawer
              isOpen={isCartOpen}
              setIsOpen={setIsCartOpen}
              cartItems={cartItems}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
            />

            {/* Buy Now Button */}
            <Button
              variant="secondary"
              size="lg"
              className="w-full font-semibold py-4 sm:py-5 text-sm sm:text-base"
            >
              BUY IT NOW
            </Button>

            {/* Promo Box */}
            <div className="border rounded-lg p-3 sm:p-4 text-center text-xs sm:text-sm">
              🌱Get ₹100 OFF On Order Above ₹899 | USE CODE ECO100 🎁
            </div>

            {/* Delivery Check */}
            <div className="space-y-2">
              <h3 className="text-xs sm:text-sm font-medium">CHECK DELIVERY</h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  placeholder="Enter PIN code"
                  className="flex-1 text-sm"
                />
                <Button className="w-full sm:w-auto text-sm">CHECK</Button>
              </div>
            </div>

            {/* Care Instructions Accordion */}
            <Accordion type="single" collapsible className="w-full">
              {/* ... [Accordion items remain the same] */}
            </Accordion>
          </div>
        </div>

        {/* About Section */}
        <section className="py-6 sm:py-8 lg:py-16 border-y-2 my-6 lg:my-[40px]">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-center text-green-800 mb-4 lg:mb-6">
            About the Product
          </h2>
          <p className="max-w-3xl mx-auto text-center text-xs sm:text-sm lg:text-base text-gray-600 leading-relaxed px-4">
            {data?.attributes?.description}
          </p>
        </section>
      </Container>

      {/* What's in the Box Section */}
      <section className="py-6 sm:py-8 lg:py-16 bg-gray-50 mb-6 sm:mb-8 lg:mb-[80px]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">
            <div className="bg-yellow-300 p-4 sm:p-6 lg:p-8 rounded-lg">
              <img
                src="/images/pakage.png"
                alt="Product package illustration"
                className="w-full"
              />
            </div>
            <div className="space-y-4 lg:space-y-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-green-800">
                What's in the Box
              </h2>
              <ul className="space-y-2 sm:space-y-3 lg:space-y-4 text-xs sm:text-sm lg:text-base text-gray-600">
                {/* ... [List items remain the same] */}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Sections */}
      <NewArrivals />
      <div className="w-full lg:w-[50%] mx-auto px-4 lg:px-0">
        <Diver />
      </div>
      <TestimonialSwiper />
    </Section>
  );
}
