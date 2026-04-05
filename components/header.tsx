"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Phone, MapPin, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#menu", label: "Menu" },
  { href: "#reviews", label: "Reviews" },
  { href: "#location", label: "Location" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-background/80 backdrop-blur-md border-b border-border ${
        isScrolled ? "shadow-xl" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-500 ${
          isScrolled ? "h-14 md:h-16" : "h-16 md:h-20"
        }`}>
          <Link href="/" className="flex items-center group">
            <div className="relative overflow-hidden">
              <Image
                src="/images/bb_logo.png"
                alt="Bhale Biryani"
                width={100}
                height={100}
                className={`object-contain transition-all duration-500 group-hover:scale-110 ${
                  isScrolled ? "w-20 h-20" : "w-28 h-28"
                }`}
                priority
              />
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-sm font-bold text-muted-foreground hover:text-primary transition-colors group py-2"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-6">
            <a
              href="tel:+919100888983"
              className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span>091008 88983</span>
            </a>
            <Button asChild variant="outline" className="font-bold border-2 hover:bg-primary/5">
              <a href="#location">
                <MapPin className="h-4 w-4 mr-2" />
                Directions
              </a>
            </Button>
            <Button asChild className="font-bold shadow-lg hover:shadow-primary/20 transition-all group">
              <Link href="/order">
                <ShoppingBag className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
                Order Now
              </Link>
            </Button>
          </div>

          <button
            className="md:hidden p-2 rounded-full hover:bg-primary/10 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden bg-background/98 backdrop-blur-2xl border-b border-border overflow-hidden"
          >
            <nav className="flex flex-col px-6 py-10 gap-6">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className="text-2xl font-black text-foreground hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <hr className="border-border opacity-50" />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-6"
              >
                <a
                  href="tel:+919100888983"
                  className="flex items-center gap-4 text-lg font-bold text-muted-foreground hover:text-primary transition-colors"
                >
                  <Phone className="h-6 w-6" />
                  <span>091008 88983</span>
                </a>
                <div className="grid gap-3">
                  <Button asChild variant="outline" size="lg" className="w-full font-bold border-2">
                    <a href="#location" onClick={() => setIsMenuOpen(false)}>
                      <MapPin className="h-5 w-5 mr-2" />
                      Get Directions
                    </a>
                  </Button>
                  <Button asChild size="lg" className="w-full font-bold shadow-xl">
                    <Link href="/order" onClick={() => setIsMenuOpen(false)}>
                      <ShoppingBag className="h-5 w-5 mr-2" />
                      Order Now
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
