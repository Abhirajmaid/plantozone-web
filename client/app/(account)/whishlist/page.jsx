"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Container } from "@/src/components/layout/Container";
import { Section } from "@/src/components/layout/Section";
import PrimaryButton from "@/src/components/common/PrimaryButton";
import SecondaryButton from "@/src/components/common/SecondaryButton";
import {
  getWishlistItems,
  removeFromWishlist,
  clearWishlist,
} from "@/src/lib/utils/wishlistUtils";
import { addToCart } from "@/src/lib/utils/cartUtils";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { ShopServiceSection, NewsletterSection } from "@/src/components";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setWishlistItems(getWishlistItems());
  }, []);

  const handleRemoveItem = (productId, size, shape) => {
    const updated = removeFromWishlist(productId, size, shape);
    setWishlistItems(updated);
    toast.success("Item removed from wishlist");
  };

  const handleClearWishlist = () => {
    if (confirm("Are you sure you want to clear your wishlist?")) {
      clearWishlist();
      setWishlistItems([]);
      toast.success("Wishlist cleared");
    }
  };

  const handleAddToCart = (item) => {
    addToCart({ ...item, quantity: 1 });
    toast.success("Item added to cart!");
  };

  const handleAddAllToCart = () => {
    wishlistItems.forEach((item) => {
      addToCart({ ...item, quantity: 1 });
    });
    toast.success("All items added to cart!");
  };

  const handleCopyLink = () => {
    const wishlistLink = typeof window !== 'undefined' ? window.location.href : '';
    navigator.clipboard.writeText(wishlistLink);
    setCopied(true);
    toast.success("Wishlist link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <div className="pt-[88px]">
      {/* Hero Section with Breadcrumb */}
      <div 
        className="relative py-20 md:py-24 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/breadcrumbbg.png')" }}
      >
        <div className="absolute inset-0 bg-white/70"></div>
        <Container>
          <div className="relative z-10 flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Wishlist
            </h1>
            <div className="flex items-center gap-2 text-gray-600">
              <Link href="/" className="hover:text-green-600 transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-gray-800 font-medium">Wishlist</span>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Content */}
      <Section className="bg-gray-50 min-h-screen">
        <Container className="py-8">
          {wishlistItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <Icon icon="mdi:heart-outline" className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your wishlist is empty</h2>
              <p className="text-gray-600 mb-6">Looks like you haven't added any items to your wishlist yet.</p>
              <Link href="/shop">
                <SecondaryButton withArrow={false} className="px-8 py-3">
                  Continue Shopping
                </SecondaryButton>
              </Link>
            </div>
          ) : (
            <>
              {/* Wishlist Table */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                {/* Table Header */}
                <div className="bg-secondary px-6 py-4 grid grid-cols-12 gap-4 text-sm font-semibold text-black">
                  <div className="col-span-1"></div>
                  <div className="col-span-4">Product</div>
                  <div className="col-span-2">Price</div>
                  <div className="col-span-2">Date Added</div>
                  <div className="col-span-2">Stock Status</div>
                  <div className="col-span-1"></div>
                </div>

                {/* Wishlist Items */}
                {wishlistItems.map((item, index) => {
                  const displayPrice = item.price || (item.size === "8 Inch" ? 850 : 650);
                  const dateAdded = item.dateAdded || new Date().toISOString();
                  
                  return (
                    <div key={`${item.product}-${item.size}-${item.shape || ""}-${index}`} className="px-6 py-4 border-b border-gray-200 grid grid-cols-12 gap-4 items-center">
                      {/* Remove Button */}
                      <div className="col-span-1">
                        <button
                          onClick={() => handleRemoveItem(item.product, item.size, item.shape)}
                          className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Icon icon="material-symbols:close" className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Product Image and Info */}
                      <div className="col-span-4 flex items-center space-x-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                          <Image
                            src={item.image || "/images/default-plant.jpg"}
                            alt={item.title}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 text-sm">{item.title}</h3>
                          <p className="text-xs text-gray-500">Indoor Plant</p>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="col-span-2">
                        <span className="text-sm font-medium text-gray-800">₹{displayPrice}</span>
                      </div>

                      {/* Date Added */}
                      <div className="col-span-2">
                        <span className="text-sm text-gray-600">{formatDate(dateAdded)}</span>
                      </div>

                      {/* Stock Status */}
                      <div className="col-span-2">
                        <span className="text-sm font-medium text-green-600">In Stock</span>
                      </div>

                      {/* Add to Cart Button */}
                      <div className="col-span-1">
                        <SecondaryButton
                          onClick={() => handleAddToCart(item)}
                          withArrow={false}
                          className="px-4 py-2 text-xs"
                        >
                          Add to Cart
                        </SecondaryButton>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Wishlist Actions */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-700">Wishlist link:</span>
                  <input
                    type="text"
                    readOnly
                    value={typeof window !== 'undefined' ? window.location.href : ''}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  />
                  <SecondaryButton
                    onClick={handleCopyLink}
                    withArrow={false}
                    className="px-4 py-2"
                  >
                    {copied ? "Copied!" : "Copy Link"}
                  </SecondaryButton>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleClearWishlist}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Clear Wishlist
                  </button>
                  <PrimaryButton
                    onClick={handleAddAllToCart}
                    withArrow={false}
                    className="px-6 py-2"
                  >
                    Add All to Cart
                  </PrimaryButton>
                </div>
              </div>
            </>
          )}

          {/* Services Section */}
          <div className="mb-8 [&>div]:!mb-8 [&>div]:!my-8">
            <ShopServiceSection />
          </div>
        </Container>
      </Section>

      {/* Newsletter Section */}
      <NewsletterSection />
    </div>
  );
}
