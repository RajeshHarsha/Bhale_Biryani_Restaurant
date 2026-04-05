"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

const menuItems = [
  {
    name: "Chicken Dum Biryani",
    description:
      "Slow-cooked aromatic basmati rice layered with tender chicken, infused with saffron and traditional spices",
    originalPrice: 199,
    price: 150,
    image: "/images/dum-biryani.jpg",
    popular: true,
  },
  {
    name: "Chicken Fry Pieces",
    description:
      "Crispy golden fried chicken pieces marinated in authentic spices, perfect as a side or standalone",
    originalPrice: 159,
    price: 120,
    image: "/images/chicken-fry.jpg",
    popular: true,
  },
  {
    name: "Chicken Pulao",
    description:
      "Fragrant basmati rice cooked with succulent chicken pieces, fried onions, and aromatic whole spices",
    originalPrice: 179,
    price: 130,
    image: "/images/chicken-pulao.jpg",
    popular: false,
  },
  {
    name: "Jeera Rice",
    description:
      "Fluffy basmati rice tempered with cumin seeds, a perfect accompaniment to any curry",
    originalPrice: 110,
    price: 80,
    image: "/images/hero-biryani.jpg",
    popular: false,
  },
];

import { motion } from "framer-motion";

export function MenuSection() {
  const headerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { duration: 0.5 } 
    },
  };

  return (
    <section id="menu" className="py-20 md:py-32 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={headerVariants}
        >
          <span className="text-primary font-bold text-sm uppercase tracking-[0.2em]">
            Our Specialties
          </span>
          <h2 className="text-4xl md:text-6xl font-extrabold text-foreground mt-3 mb-6 tracking-tight">
            Menu Highlights
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            We serve only the finest rice dishes, prepared fresh daily with
            authentic recipes passed down through generations.
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {menuItems.map((item) => (
            <motion.div
              key={item.name}
              variants={cardVariants}
            >
              <Card className="overflow-hidden group hover:shadow-[0_20px_50px_rgba(var(--primary),0.15)] transition-all duration-500 hover:-translate-y-2 border-primary/5 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative w-full sm:w-56 h-56 sm:h-auto flex-shrink-0 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-in-out"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                      {item.popular && (
                        <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest px-2.5 py-1 rounded shadow-[0_4px_10px_rgba(var(--primary),0.3)] z-10">
                          Popular
                        </div>
                      )}
                    </div>
                    <div className="p-8 flex flex-col justify-center bg-transparent">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                          {item.name}
                        </h3>
                        <div className="flex flex-col items-end">
                          {item.originalPrice > item.price && (
                            <span className="text-muted-foreground line-through text-xs font-medium opacity-60">
                              {"\u20B9"}
                              {item.originalPrice}
                            </span>
                          )}
                          <span className="text-primary font-black text-2xl flex-shrink-0">
                            {"\u20B9"}
                            {item.price}
                          </span>
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3 font-medium">
                        {item.description}
                      </p>
                      <div className="flex justify-end mt-auto">
                        <Button size="sm" asChild className="gap-2 px-6 py-5 rounded-full shadow-lg hover:shadow-primary/20 transition-all font-bold">
                          <Link href="/order">
                            <ShoppingBag className="h-4 w-4" />
                            Order Now
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="text-center mt-16 space-y-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-muted-foreground text-sm font-medium">
            Prices range from {"\u20B9"}1 to {"\u20B9"}200 per person · Dine-in
            & Drive-through available
          </p>
          <Button size="lg" className="text-lg px-8 shadow-xl hover:scale-105 transition-transform" asChild>
            <Link href="/order">
              <ShoppingBag className="h-5 w-5 mr-2" />
              Order Now
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
