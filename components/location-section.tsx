"use client";

import { MapPin, Phone, Clock, Navigation, Star, UtensilsCrossed, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const locations = [
  {
    name: "Bhale Biryani Seethammadhara",
    rating: 4.0,
    reviews: 185,
    address: "Visakhapatnam, Andhra Pradesh",
    services: ["Dine-in", "Takeaway"],
    directionsUrl: "https://maps.app.goo.gl/ZeBG1iuLaKPWBGFy7",
  },
  {
    name: "Bhale Biryani Diamond Park",
    rating: 4.4,
    reviews: 284,
    address: "Visakhapatnam, Andhra Pradesh",
    services: ["Dine-in", "Takeaway"],
    directionsUrl: "https://maps.app.goo.gl/fB2VrZeaqtRgHHoX8",
  },
  {
    name: "Bhale Biryani NAD Junction",
    rating: 4.6,
    reviews: 86,
    address: "Visakhapatnam, Andhra Pradesh",
    services: ["Dine-in", "Takeaway", "No delivery"],
    directionsUrl: "https://maps.app.goo.gl/53EjUFy1e4v9tXEg7",
  },
  {
    name: "Bhale Biryani Gajuwaka",
    rating: 4.4,
    reviews: 378,
    address: "Gajuwaka, Andhra Pradesh",
    services: ["Dine-in", "Takeaway"],
    directionsUrl: "https://maps.app.goo.gl/8ktRRCTWWDfXuJqm9",
  },
];

const businessHours = [
  { day: "Monday - Sunday", hours: "11:00 AM - 10:30 PM" },
];

import { motion } from "framer-motion";

export function LocationSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section id="location" className="py-20 md:py-32 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={itemVariants}
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">
            Our Locations
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mt-2 mb-4">
            Find Us Across Vizag
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Visit any of our 4 branches across Visakhapatnam for the same
            authentic taste you love.
          </p>
        </motion.div>

        {/* Map */}
        <motion.div 
          className="aspect-video max-h-96 rounded-xl overflow-hidden mb-12 shadow-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d121607.7853941337!2d83.26369276451004!3d17.73316673525618!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sbhale%20biryani%20locations!5e0!3m2!1sen!2sin!4v1775127102654!5m2!1sen!2sin"
            width="200%"
            height="200%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Bhale Biryani Locations"
            className="w-full h-full"
          />
        </motion.div>

        {/* Location Cards Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {locations.map((location) => (
            <motion.div key={location.name} variants={itemVariants}>
              <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-primary/5 h-full">
                <CardContent className="p-5 flex flex-col h-full">
                  <h3 className="font-bold text-foreground text-base mb-2 leading-tight group-hover:text-primary transition-colors">
                    {location.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-1.5 mb-3">
                    <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span className="text-sm font-semibold">
                        {location.rating}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      ({location.reviews})
                    </span>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-2 mb-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">
                      {location.address}
                    </span>
                  </div>

                  {/* Services */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {location.services.map((service) => (
                      <span
                        key={service}
                        className="text-xs px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full"
                      >
                        {service}
                      </span>
                    ))}
                  </div>

                  {/* Directions Button */}
                  <div className="mt-auto">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full gap-2 transition-all hover:bg-primary hover:text-primary-foreground"
                      asChild
                    >
                      <a
                        href={location.directionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Navigation className="h-3.5 w-3.5" />
                        Directions
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Business Hours & Contact */}
        <motion.div 
          className="grid sm:grid-cols-2 gap-5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-primary/5 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">
                    Business Hours
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Same timings at all branches
                  </p>
                  <div className="space-y-1">
                    {businessHours.map((schedule, index) => (
                      <div
                        key={index}
                        className="flex justify-between gap-4 text-muted-foreground text-sm"
                      >
                        <span className="font-medium text-foreground/70">{schedule.day}</span>
                        <span className="font-bold text-foreground">
                          {schedule.hours}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/5 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">
                    Contact Us
                  </h3>
                  <div className="space-y-1 mb-2">
                    <a
                      href="tel:+919100888983"
                      className="block text-primary font-bold text-xl hover:underline hover:translate-x-1 transition-transform"
                    >
                      091008 88983
                    </a>
                    <a
                      href="tel:+919100888975"
                      className="block text-primary font-bold text-xl hover:underline hover:translate-x-1 transition-transform"
                    >
                      091008 88975
                    </a>
                  </div>
                  <p className="text-sm text-muted-foreground italic flex items-center gap-1.5">
                    <UtensilsCrossed className="h-3.5 w-3.5" />
                    Call for fast takeaway or reservations
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
