"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Phone, MapPin, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navLinks = [
  { href: "/#home", label: "Home" },
  { href: "/#menu", label: "Menu" },
  { href: "/#reviews", label: "Reviews" },
  { href: "/#location", label: "Location" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session } = useSession();

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

          <nav className="hidden lg:flex items-center gap-8">
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

          <div className="hidden md:flex items-center gap-4">
            <div className="hidden xl:flex items-center gap-2 mr-2">
              <a
                href="tel:+919100888983"
                className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>091008 88983</span>
              </a>
            </div>

            <Button asChild variant="ghost" size="sm" className="font-bold text-xs hover:text-primary transition-colors">
              <Link href="/order">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Order Now
              </Link>
            </Button>

            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 overflow-hidden border border-border/50 hover:border-primary/50 transition-colors">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={session.user?.image || ""} alt={session.user?.name || "User"} />
                      <AvatarFallback className="bg-primary/10 text-primary font-black">
                        {session.user?.name?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mt-2 border-none shadow-2xl bg-card/95 backdrop-blur-xl" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-black leading-none text-foreground">{session.user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground font-medium">{session.user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border/50" />
                  <DropdownMenuItem asChild className="cursor-pointer font-bold focus:bg-primary/10 focus:text-primary transition-colors">
                    <Link href="/profile">My Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer font-bold focus:bg-primary/10 focus:text-primary transition-colors">
                    <Link href="/profile/orders">Order History</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border/50" />
                  <DropdownMenuItem 
                    className="cursor-pointer font-bold text-red-500 focus:bg-red-50 focus:text-red-600 transition-colors"
                    onClick={() => signOut()}
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild className="font-bold shadow-lg shadow-primary/20 transition-all rounded-full px-6">
                <Link href="/login">Login</Link>
              </Button>
            )}
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
              {session && (
                <div className="flex items-center gap-4 pb-4 border-b border-border/50">
                  <Avatar className="h-12 w-12 border border-primary/20">
                    <AvatarFallback className="bg-primary/10 text-primary font-black text-lg">
                      {session.user?.name?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-black text-foreground">{session.user?.name}</p>
                    <p className="text-sm text-muted-foreground font-medium">{session.user?.email}</p>
                  </div>
                </div>
              )}
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
                {session ? (
                  <>
                    <Link
                      href="/profile"
                      className="flex items-center gap-4 text-lg font-bold text-foreground hover:text-primary transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                    <Link
                      href="/profile/orders"
                      className="flex items-center gap-4 text-lg font-bold text-foreground hover:text-primary transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Orders
                    </Link>
                    <Button 
                      variant="destructive" 
                      className="w-full font-bold"
                      onClick={() => {
                        signOut();
                        setIsMenuOpen(false);
                      }}
                    >
                      Log out
                    </Button>
                  </>
                ) : (
                  <Button asChild className="w-full font-bold shadow-xl rounded-full h-12 text-lg">
                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>Login / Sign Up</Link>
                  </Button>
                )}
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
