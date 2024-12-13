"use client";

import { Package, Leaf, Truck, Sprout } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Separator } from "@/src/components/ui/separator";
import { Section } from "../../layout/Section";
import { Container } from "../../layout/Container";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const deliverySchema = z.object({
  country: z.string().min(1, "Country is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pinCode: z
    .string()
    .regex(/^\d{6}$/, "PIN code must be 6 digits")
    .min(1, "PIN code is required"),
  phone: z
    .string()
    .regex(/^\d{10}$/, "Phone number must be 10 digits")
    .min(1, "Phone number is required"),
  saveInfo: z.boolean().optional(),
  email: z.string().email("Invalid email format"),
});

const CheckoutPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(deliverySchema),
  });

  const onSubmit = (data) => {
    console.log("Form Data:", data);
  };
  return (
    <Section>
      <Container className="min-h-screen  pt-[100px]">
        <div className="container mx-auto px-4 py-8">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Left Column - Forms */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Image
                  src="/images/logo_color.png"
                  alt="Ugaoo Logo"
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                />
                <Link
                  href="/cart"
                  className="text-sm text-green-600 hover:text-green-700"
                >
                  Return to cart
                </Link>
              </div>

              {/* Contact Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Contact</h2>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="Email"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B9C09] focus:outline-none"
                />
                {errors.email && (
                  <p className="text-sm text-primary">{errors.email.message}</p>
                )}
                <div className="flex items-center space-x-2">
                  <Checkbox id="newsletter" />
                  <Label htmlFor="newsletter">
                    Email me with news and offers
                  </Label>
                </div>
              </div>

              {/* Delivery Section */}
              {/* <div className="space-y-4">
                <h2 className="text-xl font-semibold">Delivery</h2>
                <Select defaultValue="india">
                  <SelectTrigger>
                    <SelectValue placeholder="Country/Region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="india">India</SelectItem>
                  </SelectContent>
                </Select>
                <div className="grid gap-4 md:grid-cols-2">
                  <Input placeholder="First name" />
                  <Input placeholder="Last name" />
                </div>
                <Input placeholder="Address" />
                <div className="grid gap-4 md:grid-cols-3">
                  <Input placeholder="City" />
                  <Select defaultValue="maharashtra">
                    <SelectTrigger>
                      <SelectValue placeholder="State" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maharashtra">Maharashtra</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input placeholder="PIN code" />
                </div>
                <Input placeholder="Phone" />
                <div className="flex items-center space-x-2">
                  <Checkbox id="save-info" />
                  <Label htmlFor="save-info">
                    Save this information for next time
                  </Label>
                </div>
              </div> */}
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6 bg-white p-6 rounded-lg shadow-md max-w-full mx-auto"
              >
                <h2 className="text-2xl font-bold text-gray-800">
                  Delivery Details
                </h2>

                {/* Country/Region */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Country/Region
                  </label>
                  <select
                    {...register("country")}
                    defaultValue="india"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B9C09] focus:outline-none"
                  >
                    <option value="india">India</option>
                  </select>
                  {errors.country && (
                    <p className="text-sm text-red-500">
                      {errors.country.message}
                    </p>
                  )}
                </div>

                {/* Name */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      {...register("firstName")}
                      placeholder="First name"
                      className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B9C09] focus:outline-none"
                    />
                    {errors.firstName && (
                      <p className="text-sm text-red-500">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <input
                      {...register("lastName")}
                      placeholder="Last name"
                      className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B9C09] focus:outline-none"
                    />
                    {errors.lastName && (
                      <p className="text-sm text-red-500">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    {...register("address")}
                    placeholder="Address"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B9C09] focus:outline-none"
                  />
                  {errors.address && (
                    <p className="text-sm text-red-500">
                      {errors.address.message}
                    </p>
                  )}
                </div>

                {/* City, State, PIN */}
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <input
                      {...register("city")}
                      placeholder="City"
                      className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B9C09] focus:outline-none"
                    />
                    {errors.city && (
                      <p className="text-sm text-red-500">
                        {errors.city.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      State
                    </label>
                    <select
                      {...register("state")}
                      defaultValue="maharashtra"
                      className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B9C09] focus:outline-none"
                    >
                      <option value="maharashtra">Maharashtra</option>
                    </select>
                    {errors.state && (
                      <p className="text-sm text-red-500">
                        {errors.state.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      PIN Code
                    </label>
                    <input
                      {...register("pinCode")}
                      placeholder="PIN code"
                      className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B9C09] focus:outline-none"
                    />
                    {errors.pinCode && (
                      <p className="text-sm text-red-500">
                        {errors.pinCode.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    {...register("phone")}
                    placeholder="Phone"
                    className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B9C09] focus:outline-none"
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* Save Info */}
                <div className="flex items-center space-x-2">
                  <input
                    {...register("saveInfo")}
                    id="save-info"
                    type="checkbox"
                    className="w-4 h-4 text-[#0B9C09] border-gray-300 rounded focus:ring-[#0B9C09]"
                  />
                  <label htmlFor="save-info" className="text-sm text-gray-700">
                    Save this information for next time
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-2 px-4 text-white bg-[#0B9C09] rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-[#0B9C09]"
                >
                  Submit
                </button>
              </form>

              {/* Payment Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Payment</h2>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600">
                      All transactions are secure and encrypted.
                    </p>
                    <div className="mt-4 rounded border p-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="COD" defaultChecked />
                        <Label htmlFor="cod" className="text-base">
                          Cash On Delivery (COD)
                        </Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Billing Address */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Billing address</h2>
                <div className="flex items-center space-x-2">
                  <Checkbox id="same-address" defaultChecked />
                  <Label htmlFor="same-address">Same as shipping address</Label>
                </div>
              </div>

              <Button className="w-full bg-green-600 hover:bg-green-700">
                Pay now
              </Button>

              <div className="flex justify-center space-x-4 text-sm text-gray-500">
                <Link href="/refund">Refund policy</Link>
                <Link href="/privacy">Privacy policy</Link>
                <Link href="/terms">Terms of service</Link>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="space-y-6 bg-gray-50 p-6">
              <div className="flex items-start space-x-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-lg border bg-white">
                  <Image
                    src="/placeholder.svg"
                    alt="Peace Lily Plant"
                    fill
                    className="object-cover"
                  />
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-500 text-xs text-white">
                    1
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Peace Lily Plant</h3>
                  <p className="text-sm text-gray-500">
                    Small / Graded / Ivory
                  </p>
                  <p className="text-sm text-gray-500">Gift Message: No</p>
                </div>
                <p className="font-medium">₹299.00</p>
              </div>

              <div className="space-y-4">
                <div className="flex">
                  <Input
                    placeholder="Discount code or gift card"
                    className="rounded-r-none"
                  />
                  <Button variant="outline" className="rounded-l-none">
                    Apply
                  </Button>
                </div>
                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                  <div className="flex items-center space-x-2 text-green-800">
                    <span className="font-medium">ECO100</span>
                    <span className="text-sm">
                      Apply Code to Unlock ₹100 off on ₹899+ Orders!
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹299.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-sm text-gray-500">
                    Enter shipping address
                  </span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>₹299.00</span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  1 Million+ Happy Customers Trust Us!
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Package className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="font-medium">Guaranteed Returns</p>
                      <p className="text-sm text-gray-600">
                        Assured replacements if your plant arrives damaged or
                        dies within the first 15 days
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Leaf className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="font-medium">
                        Healthy & Premium Looking Plants
                      </p>
                      <p className="text-sm text-gray-600">
                        We grow & nurture all our plants with love for 6 months
                        before sending them to you
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Truck className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="font-medium">Our Plants Grow Everywhere</p>
                      <p className="text-sm text-gray-600">
                        We deliver all over the country
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Sprout className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="font-medium">Growing the Grower</p>
                      <p className="text-sm text-gray-600">
                        We have been growing plants for over 30 years and
                        understand the science behind it
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default CheckoutPage;
