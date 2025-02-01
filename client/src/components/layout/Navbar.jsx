"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import {
  ShoppingCartIcon,
  HeartIcon,
  UserIcon,
  MenuIcon,
  XIcon,
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

export default function CustomNavbar() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(true); // toggle between sign-in and sign-up
  const [isMenuOpen, setIsMenuOpen] = useState(false); // toggle for mobile menu
  const [activeTab, setActiveTab] = useState("/shop"); // Track active tab for bottom nav
  const [isSignedIn, setIsSignedIn] = useState(false); // Track if the user is signed in
  const menuRef = useRef(null); // Reference to the menu container for outside click detection

  const router = useRouter(); // Correctly using the useRouter hook inside the functional component

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
    setActiveTab(href); // Update active tab
  };

  // Handle profile click logic
  const handleProfileClick = () => {
    if (isSignedIn) {
      // Redirect to profile page if signed in
      router.push("/profile");
    } else {
      // Show the sign-in modal if not signed in
      openAuthModal();
    }
  };

  // Close the menu if clicked outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup listener on component unmount
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle login state persistence on page load
  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      setIsSignedIn(true);
    }
  }, []);

  return (
    <>
      <header className="fixed w-full bg-white z-[99] border-b">
        <div className="bg-primary h-5"></div>
        <Container>
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
            {/* Left: Logo */}
            <div className="w-[80px]">
              <Logo />
            </div>
            {/* Center: Navigation Links (Visible on desktop) */}
            <div className="hidden md:flex gap-10 items-center">
              <nav className="space-x-8 text-[16px] font-medium">
                {header.map((link, id) => (
                  <Link
                    key={id}
                    href={link.href}
                    className="hover:text-[#0b9c09] transition-colors capitalize"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Right: Icons */}
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <ShoppingCartIcon className="h-7 w-7" />
                <span className="sr-only">Shopping Cart</span>
              </Button>
              <Button variant="ghost" size="icon">
                <HeartIcon className="h-7 w-7" />
                <span className="sr-only">Wishlist</span>
              </Button>
              <Button variant="ghost" size="icon" onClick={handleProfileClick}>
                <UserIcon className="h-7 w-7" />
                <span className="sr-only">User Profile</span>
              </Button>
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

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div
            ref={menuRef}
            className="absolute top-0 left-0 right-0 bg-white shadow-md z-50 md:hidden transform transition-all duration-300 ease-in-out translate-x-0"
          >
            <div className="flex justify-between items-center p-4">
              <Logo />
              <Button variant="ghost" size="icon" onClick={toggleMenu}>
                <XIcon className="h-7 w-7" />
                <span className="sr-only">Close Menu</span>
              </Button>
            </div>
            <div className="flex flex-col items-center space-y-4 py-4">
              {header.map((link, id) => (
                <Link
                  key={id}
                  href={link.href}
                  className="hover:text-[#0b9c09] transition-colors capitalize text-lg"
                  onClick={toggleMenu}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Bottom Navigation Tabs Bar for Mobile with Icons */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-md z-[100]">
        <div className="flex justify-between items-center p-4">
          {mobileTabs.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center text-sm transition-colors duration-200 p-2 ${
                activeTab === link.href
                  ? "text-[#0b9c09] bg-gray-100 rounded-md"
                  : "text-gray-600 hover:text-[#0b9c09]"
              }`}
              onClick={() => handleTabClick(link.href)} // Change active tab
            >
              <Icon icon={link.icon} width="30" height="30" />
              <span className="text-sm">{link.label}</span>
            </Link>
          ))}
          <button
            key="profile"
            className={`flex flex-col items-center text-sm transition-colors duration-200 ${
              activeTab === "/profile"
                ? "text-[#0b9c09] bg-gray-100 rounded-md"
                : "text-gray-600 hover:text-[#0b9c09]"
            }`}
            onClick={() => handleProfileClick()} // Change active tab
          >
            <Icon icon="proicons:person" width="32" height="32" />
            <span className="text-sm">Profile</span>
          </button>
        </div>
      </div>

      {/* Authentication Modal */}
      <Dialog
        open={isAuthModalOpen}
        onOpenChange={setIsAuthModalOpen}
        className="mt-[80px]"
      >
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
