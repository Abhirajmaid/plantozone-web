"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { ShoppingCartIcon, HeartIcon, UserIcon } from "lucide-react";
import { Logo } from "..";
import { header } from "@/src/lib/data/links";
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

export default function CustomNavbar() {
  // State to control modal visibility and form toggle
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(true); // toggle between sign-in and sign-up

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

  return (
    <header className="fixed w-full bg-white z-[99] border-b">
      <div className="bg-primary h-5"></div>
      <Container>
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
          {/* Left: Logo */}
          <div className="w-[80px]">
            <Logo />
          </div>
          <div className="flex gap-10 items-center">
            {/* Center: Navigation Links */}
            <nav className="hidden md:flex space-x-8 text-[16px] font-medium">
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
            {/* Right: Icons */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <ShoppingCartIcon className="h-7 w-7" />
                <span className="sr-only">Shopping Cart</span>
              </Button>
              <Button variant="ghost" size="icon">
                <HeartIcon className="h-7 w-7" />
                <span className="sr-only">Wishlist</span>
              </Button>
              <Button variant="ghost" size="icon" onClick={openAuthModal}>
                <UserIcon className="h-7 w-7" />
                <span className="sr-only">User Profile</span>
              </Button>
            </div>
          </div>
        </div>
      </Container>

      {/* Authentication Modal */}
      <Dialog
        open={isAuthModalOpen}
        onOpenChange={setIsAuthModalOpen}
        className="mt-[80px]"
      >
        <DialogContent className="bg-white w-[500px]">
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
    </header>
  );
}
