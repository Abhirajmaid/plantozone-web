"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/src/components/ui/breadcrumb";
import { Section } from "@/src/components/layout/Section";
import { Container } from "@/src/components/layout/Container";
import { Diver, NewArrivals, TestimonialSwiper } from "@/src/components";
import { useAuth } from "@/src/hooks/useAuth";
import plantsAction from "@/src/lib/action/plants.action";
import cartAction from "@/src/lib/action/cart.action";
import { CartDrawer } from "@/src/components/section/checkout/CartDrawer";
import { toast } from "@/src/hooks/use-toast";

export default function ProductPage() {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [product, setProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { user, isAuthenticated } = useAuth();
  const params = useParams();
  const router = useRouter();
  const productId = params.slug;

  // Fetch product and cart data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch product details
        const productResponse = await plantsAction.getPlantById(productId);
        setProduct(productResponse.data.data);

        // Fetch user cart if authenticated
        if (isAuthenticated) {
          const userCart = await cartAction.getUserCart();
          setCartItems(userCart);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
        toast({
          title: "Error",
          description: "Failed to load product details",
          variant: "destructive",
        });
      }
    };

    fetchData();
  }, [productId, isAuthenticated]);

  // Cart Management Functions
  const addToCart = async () => {
    // Validate login and size selection
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to add items to cart",
        variant: "warning",
      });
      router.push("/login");
      return;
    }

    if (!selectedSize) {
      toast({
        title: "Size Selection",
        description: "Please select a plant size",
        variant: "warning",
      });
      return;
    }

    // Determine price based on size
    const price = selectedSize === "Small" ? 550 : 750;

    const newCartItem = {
      product: product.id,
      title: product.attributes.title,
      price: price,
      size: selectedSize,
      quantity: quantity,
      userId: user.id,
      image: product.attributes.images.data[0]?.attributes.url || "",
    };

    try {
      // Add to cart in Strapi
      const addedItem = await cartAction.addToCart(newCartItem);

      // Update local cart state
      setCartItems((prevItems) => {
        // Check if item exists to update quantity
        const existingItemIndex = prevItems.findIndex(
          (item) => item.productId === product.id && item.size === selectedSize
        );

        if (existingItemIndex > -1) {
          const updatedItems = [...prevItems];
          updatedItems[existingItemIndex].quantity += quantity;
          return updatedItems;
        }

        return [...prevItems, addedItem];
      });

      // Open cart drawer
      setIsCartOpen(true);

      toast({
        title: "Added to Cart",
        description: `${product.attributes.title} added to your cart`,
        variant: "success",
      });
    } catch (error) {
      console.error("Failed to add to cart", error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    }
  };

  // Quantity management
  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  // Size selection
  const handleSizeSelect = (size) => setSelectedSize(size);

  // Render loading state
  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading product details...</p>
      </div>
    );
  }

  return (
    <Section className="min-h-screen">
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
                {selectedSize === "Small" ? "₹550" : "₹750"}
              </span>
              <span className="text-sm sm:text-base text-gray-500 line-through">
                {selectedSize === "Small" ? "₹1,099" : "₹1,499"}
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
                  onClick={() => handleSizeSelect("Small")}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base border-2 rounded-md ${
                    selectedSize === "Small"
                      ? "bg-green-600 text-white"
                      : "border-green-600 text-green-600"
                  } hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2`}
                >
                  4 Inch
                </button>
                <button
                  onClick={() => handleSizeSelect("Medium")}
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

            {/* Quantity and Add to Cart */}
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
                disabled={!selectedSize}
              >
                {isAuthenticated ? "ADD TO CART" : "LOGIN TO ADD"}
              </Button>
            </div>

            {/* Cart Drawer */}
            <CartDrawer
              isOpen={isCartOpen}
              setIsOpen={setIsCartOpen}
              cartItems={cartItems}
              updateQuantity={async (itemId, newQuantity) => {
                try {
                  await cartAction.updateCartItemQuantity(itemId, newQuantity);
                  setCartItems((prevItems) =>
                    prevItems.map((item) =>
                      item.id === itemId
                        ? { ...item, quantity: newQuantity }
                        : item
                    )
                  );
                } catch (error) {
                  console.error("Failed to update quantity", error);
                }
              }}
              removeFromCart={async (itemId) => {
                try {
                  await cartAction.removeFromCart(itemId);
                  setCartItems((prevItems) =>
                    prevItems.filter((item) => item.id !== itemId)
                  );
                } catch (error) {
                  console.error("Failed to remove item", error);
                }
              }}
            />

            {/* Promo Box */}
            <div className="border rounded-lg p-3 sm:p-4 text-center text-xs sm:text-sm">
              🌱 Get ₹100 OFF On Order Above ₹899 | USE CODE ECO100 🎁
            </div>
          </div>
        </div>

        {/* Additional Sections */}
        <section className="py-6 sm:py-8 lg:py-16 border-y-2 my-6 lg:my-[40px]">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-center text-green-800 mb-4 lg:mb-6">
            About the Product
          </h2>
          <p className="max-w-3xl mx-auto text-center text-xs sm:text-sm lg:text-base text-gray-600 leading-relaxed px-4">
            {product.attributes.description}
          </p>
        </section>

        {/* Additional Components */}
        <NewArrivals />
        <div className="w-full lg:w-[50%] mx-auto px-4 lg:px-0">
          <Diver />
        </div>
        <TestimonialSwiper />
      </Container>
    </Section>
  );
}
