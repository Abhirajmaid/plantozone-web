"use client";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { ShoppingCartIcon, HeartIcon, UserIcon } from "lucide-react";
import { Logo } from "..";
import { header } from "@/src/lib/data/links";
import { Container } from "./Container";

export default function CustomNavbar() {
  return (
    <header className="fixed w-full bg-white z-[99] border-b">
      <div className="bg-primary h-5"></div>
      <Container>
        <div className=" flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
          {/* Left: Logo */}
          <div className="w-[80px]">
            <Logo />
          </div>
          <div className="flex gap-10 items-center">
            {/* Center: Navigation Links */}
            <nav className="hidden md:flex space-x-8 text-base font-medium">
              {header.map((link, id) => {
                return (
                  <Link
                    href={link.href}
                    className="hover:text-[#0b9c09] transition-colors capitalize"
                  >
                    {link.label}
                  </Link>
                );
              })}
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
              <Button variant="ghost" size="icon">
                <UserIcon className="h-7 w-7" />
                <span className="sr-only">User Profile</span>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
}
