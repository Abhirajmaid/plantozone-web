"use client";

import { useState } from "react";
import { Slider } from "@/src/components/ui/slider";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function Filters() {
  const [isOpen, setIsOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 100]);

  const toggleFilters = () => setIsOpen(!isOpen);

  return (
    <div className="bg-background border rounded-lg p-4 w-full md:w-[25%]">
      <div className="md:hidden">
        <Button
          onClick={toggleFilters}
          variant="outline"
          className="w-full mb-4"
        >
          {isOpen ? (
            <>
              Hide Filters
              <ChevronUp className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              Show Filters
              <ChevronDown className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
      <div className={`${isOpen ? "block" : "hidden"} md:block`}>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="category">
            <AccordionTrigger>Category</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <Checkbox id="indoor-plants" />
                  <span>Indoor Plants</span>
                </Label>
                <Label className="flex items-center space-x-2">
                  <Checkbox id="outdoor-plants" />
                  <span>Outdoor Plants</span>
                </Label>
                <Label className="flex items-center space-x-2">
                  <Checkbox id="succulents" />
                  <span>Succulents</span>
                </Label>
                <Label className="flex items-center space-x-2">
                  <Checkbox id="accessories" />
                  <span>Accessories</span>
                </Label>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="price">
            <AccordionTrigger>Price Range</AccordionTrigger>
            <AccordionContent>
              <Slider
                min={0}
                max={100}
                step={1}
                value={priceRange}
                onValueChange={setPriceRange}
                className="mb-4"
              />
              <div className="flex justify-between">
                <Input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) =>
                    setPriceRange([Number(e.target.value), priceRange[1]])
                  }
                  className="w-20"
                />
                <Input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], Number(e.target.value)])
                  }
                  className="w-20"
                />
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="size">
            <AccordionTrigger>Plant Size</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <Checkbox id="small" />
                  <span>Small</span>
                </Label>
                <Label className="flex items-center space-x-2">
                  <Checkbox id="medium" />
                  <span>Medium</span>
                </Label>
                <Label className="flex items-center space-x-2">
                  <Checkbox id="large" />
                  <span>Large</span>
                </Label>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="light">
            <AccordionTrigger>Light Requirements</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <Checkbox id="low-light" />
                  <span>Low Light</span>
                </Label>
                <Label className="flex items-center space-x-2">
                  <Checkbox id="medium-light" />
                  <span>Medium Light</span>
                </Label>
                <Label className="flex items-center space-x-2">
                  <Checkbox id="bright-light" />
                  <span>Bright Light</span>
                </Label>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Button className="w-full mt-4">Apply Filters</Button>
      </div>
    </div>
  );
}
