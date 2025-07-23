"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import Logo from "@/assets/logo/logo.jpeg";

interface NavbarProps {
  user?: {
    id: string;
    email: string;
    name: string;
    role: "user" | "admin";
  } | null;
}

export function Navbar({ user }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/help-center", label: "Help center" },
    { href: "/about", label: "About" },
    { href: "/request-for-service", label: "Request for service" },
  ];

  const handleLogout = () => {
    console.log("Logging out...");
    window.location.reload();
  };

  return (
    <nav className=" sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ">
      <div className="container flex h-20 items-center justify-between mx-auto">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src={Logo}
            alt="Logo"
            width={50}
            height={50}
            className="object-contain rounded-lg"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-medium transition-colors py-2 px-4 rounded hover:bg-[#3c2c2c] hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline py-2 px-4 rounded hover:bg-[#3c2c2c] hover:text-white font-medium">
                    {user.name}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                {user.role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">Admin Panel</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center">
              <button className="py-2 px-4 rounded hover:bg-[#3c2c2c] hover:text-white font-medium">
                <Link className="" href="/login">
                  Login
                </Link>
              </button>
              <button className="py-2 px-4 rounded hover:bg-[#3c2c2c] hover:text-white font-medium">
                <Link className="" href="/signup">
                  Sign Up
                </Link>
              </button>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-lg font-medium transition-colors py-2 px-4 rounded hover:bg-[#3c2c2c] hover:text-white "
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
