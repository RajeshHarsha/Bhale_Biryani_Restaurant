"use client";

import { Branch, BRANCHES } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Star, Navigation, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BranchSelectorProps {
  onSelect: (branch: Branch) => void;
}

export function BranchSelector({ onSelect }: BranchSelectorProps) {
  return (
    <div className="min-h-[60vh]">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          Select Restaurant
        </h1>
        <p className="text-muted-foreground">
          Choose the nearest Bhale Biryani branch to place your order
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
        {BRANCHES.map((branch) => (
          <Card
            key={branch.id}
            className="cursor-pointer group hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:border-primary/50 transition-all duration-500 bg-card/60 backdrop-blur-sm border-none shadow-sm relative overflow-hidden"
            onClick={() => onSelect(branch)}
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-primary/0 group-hover:bg-primary transition-all duration-500" />
            <CardContent className="p-6">
              <div className="flex items-start gap-5">
                {/* Location Icon */}
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm text-primary">
                  <MapPin className="h-7 w-7" />
                </div>

                {/* Branch Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-extrabold text-foreground text-xl tracking-tight group-hover:text-primary transition-colors line-clamp-1">
                      {branch.name}
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-1.5 bg-primary/5 px-2 py-0.5 rounded-md">
                      <Star className="h-3.5 w-3.5 text-primary fill-primary" />
                      <span className="text-sm font-black text-primary">
                        {branch.rating}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                      {branch.area}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4 font-medium leading-relaxed">
                    {branch.address}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {branch.services.map((service) => (
                      <span
                        key={service}
                        className="text-[10px] uppercase font-black tracking-widest px-2.5 py-1 bg-muted/50 text-muted-foreground rounded-md border border-border/50 group-hover:border-primary/20 transition-colors"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Directions hint */}
      <div className="mt-10 flex items-center gap-3 text-sm text-muted-foreground max-w-5xl bg-muted/30 p-4 rounded-xl border border-border/50">
        <Navigation className="h-5 w-5 text-primary" />
        <span className="font-medium">
          Not sure which branch? Visit our{" "}
          <a href="/#location" className="text-primary hover:underline font-bold">
            locations page
          </a>{" "}
          for detailed directions and photos.
        </span>
      </div>
    </div>
  );
}
