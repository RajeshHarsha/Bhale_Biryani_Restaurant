"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Star, Clock, MapPin, ShoppingBag } from "lucide-react";

import { motion } from "framer-motion";

export function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1 },
    },
  };

  return (
    <section id="home" className="relative min-h-screen flex items-end overflow-hidden">
      <div className="absolute inset-0">
        <motion.div
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 6, ease: "linear" }}
          className="absolute inset-0"
        >
          <Image
            src="/images/hero-biryani.jpg"
            alt="Delicious Chicken Dum Biryani"
            fill
            className="object-cover"
            priority
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/10" />
      </div>

      <motion.div 
        className="relative z-10 w-full px-4 sm:px-6 lg:px-8 pb-16 md:pb-24"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={itemVariants} className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1 bg-primary/95 text-primary-foreground px-4 py-1.5 rounded-full text-sm font-bold shadow-[0_0_20px_rgba(var(--primary),0.3)]">
              <Star className="h-4 w-4 fill-current" />
              <span>4.0</span>
            </div>
            <span className="text-white/90 text-sm font-bold tracking-tight drop-shadow-md">(185 reviews)</span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold text-white tracking-tighter leading-[0.9] mb-4 drop-shadow-2xl">
            <span className="block">Bhale</span>
            <span className="block text-accent">Biryani</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-xl md:text-2xl text-white/90 max-w-xl mb-10 leading-relaxed font-medium drop-shadow-lg">
            Authentic Hyderabadi-style Dum Biryani in Visakhapatnam. Experience the tradition in every grain.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-2 text-white/80 bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
              <Clock className="h-5 w-5" />
              <span className="text-sm">Monday - Sunday : 11:00 AM - 10:30 PM</span>
            </div>
            <div className="flex items-center gap-2 text-white/80 bg-black/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10">
              <MapPin className="h-5 w-5" />
              <span className="text-sm">Seethammadhara, Diamond Park, NAD Junction, Gajuwaka</span>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="text-base shadow-xl hover:scale-105 transition-transform" asChild>
              <a href="#menu">View Our Menu</a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base order-now-btn bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 shadow-xl hover:scale-105 transition-transform"
              asChild
            >
              <Link href="/order">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Order Now
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
