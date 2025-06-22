"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
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
import { Logo } from "..";
import { header, mobileTabs } from "@/src/lib/data/links";
import { Container } from "./Container";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/src/components/ui/dialog";
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
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("/shop");
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);
  const dropdownTimerRef = useRef(null);
  const pathname = usePathname();

  const router = useRouter();

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
      <header className="fixed w-full bg-white z-[99] border-b">
        <div className="bg-primary h-5"></div>
        <Container>
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
            {/* Left: Logo */}
            <div className="w-[40px] md:w-[80px]">
              <Logo />
            </div>
            {/* Center: Navigation Links */}
            <div className="hidden md:flex gap-10 items-center">
              <nav className="space-x-8 text-[16px] font-medium">
                {header.map((link, id) => (
                  <Link
                    key={id}
                    href={link.href}
                    className={`hover:text-[#0b9c09] transition-colors capitalize ${
                      pathname === link.href
                        ? "text-[#0b9c09] font-bold underline underline-offset-8"
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
              <Button variant="ghost" size="icon" asChild className="relative">
                <Link href="/cart">
                  <ShoppingCartIcon className="h-7 w-7" />
                  <span className="sr-only">Shopping Cart</span>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold border-2 border-white">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </Button>
              {/* <Button variant="ghost" size="icon">
                <HeartIcon className="h-7 w-7" />
                <span className="sr-only">Wishlist</span>
              </Button> */}
              {isSignedIn ? (
                <div
                  className="relative"
                  onMouseEnter={handleDropdownEnter}
                  onMouseLeave={handleDropdownLeave}
                  ref={dropdownRef}
                >
                  <Button variant="ghost" size="icon" className="relative">
                    <UserIcon className="h-7 w-7" />
                  </Button>

                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <div className="py-1" role="menu">
                        <Link
                          href="/orders"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <PackageIcon className="mr-2 h-4 w-4" />
                          Orders
                        </Link>
                        <Link
                          href="/account"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <UserCircleIcon className="mr-2 h-4 w-4" />
                          Account
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <LogOutIcon className="mr-2 h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Button onClick={openAuthModal}>Login</Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMenu}
                className="transition-all transform duration-300"
              >
                <MenuIcon className="h-7 w-7" />
                <span className="sr-only">Menu</span>
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
              <Logo />
              <Button variant="ghost" size="icon" onClick={toggleMenu}>
                <XIcon className="h-7 w-7" />
                <span className="sr-only">Close Menu</span>
              </Button>
            </div>
            <div className="flex flex-col items-center space-y-4 py-4">
              {header
                .filter(
                  (link) => !mobileTabs.some((tab) => tab.href === link.href)
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
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-md z-[100]">
        <div className="flex justify-between items-center p-4">
          {mobileTabs
            .filter((link) => link.href !== "/wishlist")
            .map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center text-sm transition-colors duration-200 p-2 ${
                  activeTab === link.href
                    ? "text-[#0b9c09] bg-gray-100 rounded-md"
                    : "text-gray-600 hover:text-[#0b9c09]"
                }`}
                onClick={() => handleTabClick(link.href)}
              >
                <Icon icon={link.icon} width="25" height="25" />
                <span className="text-xs">{link.label}</span>
                {link.href === "/cart" && cartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </Link>
            ))}
        </div>
      </div>

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
