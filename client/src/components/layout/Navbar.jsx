"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import PrimaryButton from "@/src/components/common/PrimaryButton";
import {
  ShoppingCartIcon,
  HeartIcon,
  UserIcon,
  MenuIcon,
  XIcon,
  PackageIcon,
  LogOutIcon,
  UserCircleIcon,
} from "lucide-react";
import Logo from "../common/Logo";
import { header, mobileTabs } from "@/src/lib/data/links";
import { Container } from "./Container";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import SignInForm from "../common/SignInForm";
import SignUpForm from "../common/SignUpForm";
import { Icon } from "@iconify/react";

// --- Cart count utility ---
function getCartCount() {
  if (typeof window !== "undefined") {
    try {
      const cart = JSON.parse(sessionStorage.getItem("cart") || "[]");
      return cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    } catch {
      return 0;
    }
  }
  return 0;
}

export default function CustomNavbar() {
  const pathname = usePathname();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(pathname || "/");

  // Sync activeTab with pathname changes
  useEffect(() => {
    setActiveTab(pathname || "/");
  }, [pathname]);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);
  const dropdownTimerRef = useRef(null);
  const searchInputRef = useRef(null);

  const router = useRouter();

  const openSearch = () => {
    setIsSearchOpen(true);
    setSearchInput("");
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchInput("");
  };

  const handleSearchSubmit = () => {
    const q = searchInput.trim();
    if (q) {
      router.push(`/shop?search=${encodeURIComponent(q)}`);
    }
    closeSearch();
  };

  const openAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const switchToSignUp = () => {
    setIsSigningIn(false);
  };

  const switchToSignIn = () => {
    setIsSigningIn(true);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleTabClick = (href) => {
    setActiveTab(href);
  };

  const handleProfileClick = () => {
    if (!isSignedIn) {
      openAuthModal();
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("jwt");
    setIsSignedIn(false);
    setShowDropdown(false);
    router.push("/");
  };

  const handleDropdownEnter = () => {
    if (dropdownTimerRef.current) {
      clearTimeout(dropdownTimerRef.current);
    }
    setShowDropdown(true);
  };

  const handleDropdownLeave = () => {
    dropdownTimerRef.current = setTimeout(() => {
      setShowDropdown(false);
    }, 200);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (dropdownTimerRef.current) {
        clearTimeout(dropdownTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const jwt = sessionStorage.getItem("jwt");
    if (jwt) {
      setIsSignedIn(true);
    }
  }, []);

  useEffect(() => {
    setCartCount(getCartCount());
    // Listen for cart changes (optional: use a custom event or polling)
    const handleStorage = () => setCartCount(getCartCount());
    window.addEventListener("storage", handleStorage);
    // Optionally, poll for cart changes if cart is updated in sessionStorage
    const interval = setInterval(() => setCartCount(getCartCount()), 1000);
    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
      if (dropdownTimerRef.current) {
        clearTimeout(dropdownTimerRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Top Header Bar - visible on all screens */}
      <div className="fixed w-full bg-green-600 text-white z-[100] py-1.5 md:py-2 min-h-10 flex items-center">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between gap-1 md:gap-0 text-xs md:text-sm">
            {/* Left: Call Us - hide on small mobile to prioritize promo */}
            <div className="hidden sm:flex items-center order-2 md:order-1">
              <a
                href="tel:+919059152555"
                className="hover:underline cursor-pointer whitespace-nowrap"
              >
                Call Us : +91 90591 52555, +91 89994 92523
              </a>
            </div>

            {/* Center: Discount code offer - text only, no icons */}
            <div className="flex items-center justify-center order-1 md:order-2 text-center flex-1 ">
              <span className="font-regular md:font-medium">Use code FIRST125 to get 25% OFF for your first order.</span>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Navigation Bar - below top bar with clear gap */}
      <header className="fixed w-full bg-white z-[99] border-b top-10">
        <Container>
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-1">
            {/* Left: Logo and Brand */}
            <Link
              href="/"
              className="flex items-center space-x-2 md:space-x-3 hover:opacity-90 transition-opacity"
            >
              <div className="w-12 h-12 md:w-24 md:h-24 bg-white rounded-lg p-1 flex items-center justify-center">
                <Logo />
              </div>
              <span className="text-3xl hidden md:block md:text-3xl font-semibold text-gray-800">
                Plantozone<span className="text-yellow-400">.</span>
              </span>
            </Link>

            {/* Center: Navigation Links */}
            <div className="hidden md:flex items-center">
              <nav className="flex space-x-8 text-[16px] font-medium">
                {header.map((link, id) => (
                  <Link
                    key={id}
                    href={link.href}
                    className={`text-gray-700 hover:text-green-600 transition-colors capitalize ${
                      pathname === link.href
                        ? "text-green-600 font-semibold"
                        : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Right: Icons */}
            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={openSearch}
                aria-label="Search"
              >
                <Icon icon="mdi:magnify" className="h-6 w-6 text-gray-700" />
              </Button>
              <Button variant="ghost" size="icon" asChild className="relative">
                <Link href="/whishlist">
                  <Icon
                    icon="mdi:heart-outline"
                    className="h-6 w-6 text-gray-700"
                  />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild className="relative">
                <Link href="/cart">
                  <Icon
                    icon="mdi:cart-outline"
                    className="h-6 w-6 text-gray-700"
                  />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold border-2 border-white">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </Button>
              <PrimaryButton href="/contact-us" withArrow={false}>
                Contact Us
              </PrimaryButton>
            </div>

            {/* Mobile Icons - Search, Wishlist and Cart */}
            <div className="md:hidden flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={openSearch}
                aria-label="Search"
              >
                <Icon icon="mdi:magnify" className="h-5 w-5 text-gray-700" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                <Link href="/whishlist">
                  <Icon
                    icon="mdi:heart-outline"
                    className="h-5 w-5 text-gray-700"
                  />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 relative" asChild>
                <Link href="/cart">
                  <Icon
                    icon="mdi:cart-outline"
                    className="h-5 w-5 text-gray-700"
                  />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold border-2 border-white">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </Button>
            </div>
          </div>
        </Container>

        {/* Mobile Hamburger Menu for pages not on tabs */}
        {isMenuOpen && (
          <div
            ref={menuRef}
            className="absolute top-0 left-0 right-0 bg-white shadow-md z-50 md:hidden transform transition-all duration-300 ease-in-out translate-x-0 min-h-screen"
          >
            <div className="flex justify-between items-center p-4">
              <Link
                href="/"
                onClick={toggleMenu}
                className="w-12 h-12 bg-white rounded-lg p-1 flex items-center justify-center"
              >
                <Logo />
              </Link>
              <Button variant="ghost" size="icon" onClick={toggleMenu}>
                <XIcon className="h-7 w-7" />
                <span className="sr-only">Close Menu</span>
              </Button>
            </div>
            <div className="flex flex-col items-center space-y-4 py-4">
              {header
                .filter(
                  (link) => !mobileTabs.some((tab) => tab.href === link.href),
                )
                .map((link, id) => (
                  <Link
                    key={id}
                    href={link.href}
                    className="hover:text-[#0b9c09] transition-colors capitalize text-lg"
                    onClick={toggleMenu}
                  >
                    {link.label}
                  </Link>
                ))}
              {isSignedIn && (
                <>
                  {/* Account Related Links */}
                  <div className="w-full border-t pt-4 mt-4">
                    <Link
                      href="/orders"
                      className="flex items-center justify-center gap-2 text-lg hover:text-[#0b9c09] transition-colors capitalize"
                      onClick={toggleMenu}
                    >
                      <PackageIcon className="h-5 w-5" />
                      Orders
                    </Link>
                  </div>
                  <Link
                    href="/account"
                    className="flex items-center justify-center gap-2 text-lg hover:text-[#0b9c09] transition-colors capitalize"
                    onClick={toggleMenu}
                  >
                    <UserCircleIcon className="h-5 w-5" />
                    Account
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                    className="flex items-center justify-center gap-2 text-lg text-red-600 hover:text-red-700 transition-colors capitalize mt-4"
                  >
                    <LogOutIcon className="h-5 w-5" />
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Bottom Navigation Tabs */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-[100]"
        style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
      >
        <div className="flex justify-around items-center py-2 px-2">
          {mobileTabs
            .filter((link) => link.href !== "/wishlist")
            .map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href === "/" && pathname === "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex flex-col items-center justify-center text-sm transition-colors duration-200 px-2 py-1 min-w-[60px] ${
                    isActive ? "text-[#0b9c09]" : "text-gray-600"
                  }`}
                  onClick={() => handleTabClick(link.href)}
                >
                  <div
                    className={`relative ${isActive ? "bg-green-50 rounded-lg p-1" : ""}`}
                  >
                    <Icon icon={link.icon} className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-xs mt-1 ${isActive ? "font-medium" : ""}`}
                  >
                    {link.label}
                  </span>
                </Link>
              );
            })}
        </div>
      </div>

      {/* Search Modal */}
      <Dialog
        open={isSearchOpen}
        onOpenChange={(open) => {
          setIsSearchOpen(open);
          if (!open) setSearchInput("");
        }}
      >
        <DialogContent className="bg-white w-[90%] sm:w-[420px] mx-auto">
          <DialogHeader>
            <DialogTitle>Search plants</DialogTitle>
            <p className="text-sm text-gray-600">Find plants by name</p>
          </DialogHeader>
          <div className="mt-4 flex gap-2">
            <Input
              ref={searchInputRef}
              type="search"
              placeholder="e.g. Monstera, Bonsai…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
              className="flex-1"
              autoFocus
            />
            <Button
              onClick={handleSearchSubmit}
              className="bg-green-600 hover:bg-green-700"
            >
              Search
            </Button>
          </div>
          <DialogClose asChild>
            <Button variant="ghost" className="mt-2">
              Cancel
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>

      {/* Auth Modal */}
      <Dialog open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen}>
        <DialogContent className="bg-white w-[90%] sm:w-[500px] mx-auto">
          <DialogHeader>
            <div className="w-[120px] mx-auto mb-5">
              <Logo />
            </div>
            <DialogTitle>
              {isSigningIn ? "Sign In" : "Create Account"}
            </DialogTitle>
            <p>
              {isSigningIn
                ? "Welcome back! Sign in with"
                : "Start of a Magical Journey!"}
            </p>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            {isSigningIn ? (
              <SignInForm onSwitchToSignUp={switchToSignUp} />
            ) : (
              <SignUpForm onSwitchToSignIn={switchToSignIn} />
            )}
          </div>
          <DialogClose asChild>
            <Button variant="ghost" className="mt-1">
              Close
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
}
