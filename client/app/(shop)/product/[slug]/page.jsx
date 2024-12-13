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

export default function ProductPage() {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(""); // State for storing selected size

  const [data, setData] = useState();

  const param = useParams();

  const id = param.slug;

  console.log(id);

  // Handler for increasing the quantity
  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  // Handler for decreasing the quantity
  const handleDecrease = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1)); // Prevent going below 1
  };

  const handleClick = (size) => {
    setSelectedSize(size); // Update state with the selected size
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

  console.log(data);

  return (
    <Section>
      <Container className="container mx-auto px-[100px] py-8 pt-[100px]">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-8 flex gap-1">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/plants">/ Plants</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink>/ {data?.attributes?.title}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div>
            <div className=" h-[80%] bg-gray-100 rounded-lg mb-4 object-fill ">
              <img
                src={data?.attributes?.images?.data[0]?.attributes?.url}
                alt="Ficus Lyrata Bambino XL"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-3xl font-semibold mb-4">
              {data?.attributes?.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center mb-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-yellow-400 text-yellow-400"
                />
              ))}
              <span className="ml-2 text-sm text-gray-600">5.0</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-green-600">
                {selectedSize == "Small" ? "₹550" : "₹750"}
              </span>
              <span className="text-gray-500 line-through">
                {" "}
                {selectedSize == "Small" ? "₹1,099" : "₹1,499"}
              </span>
              <Badge
                variant="secondary"
                className="bg-yellow-100 text-yellow-800"
              >
                -50%
              </Badge>
            </div>

            {/* Gift Option */}
            <div className="flex items-center gap-2 mb-6">
              <input
                type="checkbox"
                id="gift"
                className="rounded border-gray-300"
              />
              <label htmlFor="gift" className="text-sm text-gray-600">
                This Is a Gift
              </label>
            </div>
            <div className="flex flex-col items-start mb-8">
              <label className="mb-2 text-sm font-medium text-gray-700">
                SELECT PLANT SIZE
              </label>
              <div className="flex space-x-4">
                {/* Small Button */}
                <button
                  onClick={() => handleClick("Small")}
                  className={`px-4 py-2 border-2 rounded-md ${
                    selectedSize === "Small"
                      ? "bg-green-600 text-white"
                      : "border-green-600 text-green-600"
                  } hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2`}
                >
                  4 Inch
                </button>

                {/* Medium Button */}
                <button
                  onClick={() => handleClick("Medium")}
                  className={`px-4 py-2 border-2 rounded-md ${
                    selectedSize === "Medium"
                      ? "bg-green-600 text-white"
                      : "border-green-600 text-green-600"
                  } hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2`}
                >
                  6 Inch
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex items-center gap-4 mb-6">
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
                  className="w-12 text-center"
                />
                <button
                  onClick={handleIncrease}
                  className="px-3 py-2 border-l hover:bg-gray-200"
                >
                  +
                </button>
              </div>
              <Button className="flex-1 bg-green-600 hover:bg-green-700 py-5">
                ADD TO CART
              </Button>
            </div>

            <Button
              variant="secondary"
              size="lg"
              className="w-full mb-6 font-semibold py-5"
            >
              BUY IT NOW
            </Button>

            {/* Promo */}
            <div className="border rounded-lg p-4 mb-6 text-center text-sm">
              🌱Get ₹100 OFF On Order Above ₹899 | USE CODE ECO100 🎁
            </div>

            {/* Delivery Check */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">CHECK DELIVERY</h3>
              <div className="flex gap-2">
                <Input placeholder="Enter PIN code" className="flex-1" />
                <Button>CHECK</Button>
              </div>
            </div>

            {/* Plant Care */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="water">
                <AccordionTrigger>
                  <span className="flex items-center gap-2">
                    💧 Water Once A Week
                  </span>
                </AccordionTrigger>
                <AccordionContent className="font-medium ">
                  Water your Ficus Lyrata Bambino once a week or when the top
                  soil feels dry.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="sunlight">
                <AccordionTrigger>
                  <span className="flex items-center gap-2">
                    ☀️ Needs Bright Indirect Sunlight
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  Place in a bright location but avoid direct sunlight which can
                  burn the leaves.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="pets">
                <AccordionTrigger>
                  <span className="flex items-center gap-2">
                    🐱 Toxic To Pets
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  Keep this plant away from pets as it can be toxic if ingested.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="experience">
                <AccordionTrigger>
                  <span className="flex items-center gap-2">
                    🌿 Needs Gardening Experience
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  This plant requires some experience to maintain optimal growth
                  conditions.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* About the Product */}
        <section className="py-16 border-y-2 my-[80px]">
          <h2 className="text-3xl font-semibold text-center text-green-800 mb-6">
            About the Product
          </h2>
          <p className="max-w-3xl mx-auto text-center text-gray-600 leading-relaxed">
            {data?.attributes?.description}
          </p>
        </section>
      </Container>

      {/* What's in the Box */}
      <section className="py-16 bg-gray-50  mb-[80px]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-yellow-300 p-8 rounded-lg">
              <img
                src="/images/pakage.png"
                alt="Product package illustration"
                className="w-full"
              />
            </div>
            <div>
              <h2 className="text-4xl font-semibold text-green-800 mb-8">
                What's in the Box
              </h2>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  Ficus Lyrata Bambino Plant with Pot -XL: 65 - 90 cm
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  Pot Size: 9 inch diameter
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  Soil Media: Coco Peat+Coco Chips+Soil
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  Recyclable box
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <NewArrivals />
      <div className="w-[50%] mx-auto">
        <Diver />
      </div>
      <TestimonialSwiper />
    </Section>
  );
}
