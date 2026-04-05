"use client";

import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const reviews = [
  {
    name: "Satish Kumar",
    badge: "Local Guide",
    rating: 5,
    date: "a year ago",
    text: "Definitely try pulav. They have just 3 types of rice only - jeera rice, dum biryani, pulav. All are amazing!",
    photos: 342,
  },
  {
    name: "Uttam Chennuru",
    badge: "Local Guide",
    rating: 5,
    date: "7 months ago",
    text: "Super food and very nice atmosphere. We love this Biryani so much. The taste is authentic and the portions are generous.",
    photos: 77,
  },
  {
    name: "Customer",
    badge: null,
    rating: 5,
    date: "recent",
    text: "Nothing can beat the taste & quality for their price. So yummy and good food with reasonable price.",
    photos: 0,
  },
];

const ratingDistribution = [
  { stars: 5, percentage: 55 },
  { stars: 4, percentage: 25 },
  { stars: 3, percentage: 12 },
  { stars: 2, percentage: 5 },
  { stars: 1, percentage: 3 },
];

import { motion } from "framer-motion";

export function ReviewsSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 30 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { duration: 0.6 } 
    },
  };

  return (
    <section id="reviews" className="py-24 md:py-36 bg-secondary/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-16 lg:gap-20">
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <span className="text-primary font-bold text-sm uppercase tracking-[0.2em]">
              Customer Love
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mt-3 mb-8 tracking-tight">
              Real Taste, <br/>Real Reviews
            </h2>

            <div className="flex items-center gap-6 mb-10">
              <span className="text-7xl font-black text-foreground tabular-nums">4.0</span>
              <div>
                <div className="flex gap-1 mb-2">
                  {[1, 2, 3, 4].map((i) => (
                    <Star
                      key={i}
                      className="h-6 w-6 fill-primary text-primary transition-transform hover:scale-110"
                    />
                  ))}
                  <Star className="h-6 w-6 text-primary/30" />
                </div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">185 Google Reviews</p>
              </div>
            </div>

            <div className="space-y-5">
              {ratingDistribution.map((item) => (
                <div key={item.stars} className="flex items-center gap-4">
                  <span className="text-sm font-black text-muted-foreground w-4">
                    {item.stars}
                  </span>
                  <div className="flex-1 h-3 bg-muted/50 rounded-full overflow-hidden shadow-inner">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full transition-all duration-1000"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.percentage}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
                    />
                  </div>
                  <span className="text-sm font-bold text-muted-foreground w-10">
                    {item.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            className="lg:col-span-2 space-y-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {reviews.map((review, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="border-none shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(var(--primary),0.1)] transition-all duration-500 hover:-translate-y-2 bg-card/40 backdrop-blur-md relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary/0 group-hover:bg-primary transition-all duration-500" />
                  <CardContent className="p-8">
                    <div className="flex items-start gap-6">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 shadow-lg border border-primary/5">
                        <span className="text-xl font-black text-primary">
                          {review.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors">
                              {review.name}
                            </h4>
                            {review.badge && (
                              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-full mt-1">
                                <Star className="h-3 w-3 fill-current" />
                                {review.badge}
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                            {review.date}
                          </span>
                        </div>
                        <div className="flex gap-0.5 mb-5 opacity-90">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star
                              key={i}
                              className="h-4 w-4 fill-primary text-primary"
                            />
                          ))}
                        </div>
                        <div className="relative">
                          <Quote className="absolute -top-3 -left-3 h-10 w-10 text-primary/5 -rotate-12 transition-transform group-hover:rotate-0 duration-700" />
                          <p className="text-muted-foreground text-lg leading-relaxed pl-8 italic font-medium relative z-10">
                            "{review.text}"
                          </p>
                        </div>
                        {review.photos > 0 && (
                          <div className="mt-4 flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-50">
                             + {review.photos} Verified Photos
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            <motion.div 
              className="text-center pt-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <Button variant="ghost" className="text-muted-foreground hover:text-primary font-bold tracking-widest uppercase text-xs gap-2">
                Show 182 More Reviews from Google Maps
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
