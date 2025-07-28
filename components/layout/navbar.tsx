"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Menu, X, User, ShoppingCart } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

const navItems = [
  { href: "/", label: "Trang chủ" },
  { href: "/about", label: "Giới thiệu" },
  { href: "/events", label: "Sự kiện" },
  { href: "/shop", label: "Cửa hàng" },
  { href: "/news", label: "Tin tức" },
  { href: "/gallery", label: "Thư viện ảnh" },
  { href: "/contact", label: "Liên hệ" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300`}
      style={{
        backgroundColor: isScrolled
          ? "var(--nav-bg-scrolled-light)"
          : "var(--nav-bg-light)",
        borderBottomColor: isScrolled ? "var(--border-color)" : "transparent",
        backdropFilter: isScrolled ? "blur(10px)" : "none",
        boxShadow: isScrolled ? "0 2px 4px rgba(0, 0, 0, 0.1)" : "none",
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            {/* <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center"> */}
            <Image
              src="/img/logo-vsm.png"
              alt="Logo"
              width={125}
              height={125}
            />
            {/* </div> */}
            {/* <span className="font-bold text-xl gradient-text">
              Vietnam Student Marathon
            </span> */}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3 py-2 text-sm font-medium transition-colors hover:text-primary ${
                  pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {item.label}
                {pathname === item.href && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    layoutId="navbar-indicator"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Tài khoản</Link>
                  </DropdownMenuItem>
                  {user.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">Quản trị</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={logout}>
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">Đăng nhập</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Đăng ký</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="md:hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-2 pt-2 pb-3 space-y-1 bg-background/95 backdrop-blur-md rounded-lg mt-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                      pathname === item.href
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="border-t pt-4 mt-4">
                  {user ? (
                    <div className="space-y-1">
                      <Link
                        href="/profile"
                        className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-primary"
                        onClick={() => setIsOpen(false)}
                      >
                        Tài khoản
                      </Link>
                      {user.role === "admin" && (
                        <Link
                          href="/admin"
                          className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-primary"
                          onClick={() => setIsOpen(false)}
                        >
                          Quản trị
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setIsOpen(false);
                        }}
                        className="block w-full text-left px-3 py-2 text-base font-medium text-muted-foreground hover:text-primary"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Link
                        href="/login"
                        className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-primary"
                        onClick={() => setIsOpen(false)}
                      >
                        Đăng nhập
                      </Link>
                      <Link
                        href="/register"
                        className="block px-3 py-2 text-base font-medium text-primary"
                        onClick={() => setIsOpen(false)}
                      >
                        Đăng ký
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
