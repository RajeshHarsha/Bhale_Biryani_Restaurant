"use client";

import Image from "next/image";
import { MenuItem } from "@/lib/types";
import { useCart } from "@/components/cart-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Minus } from "lucide-react";

interface OrderMenuCardProps {
  item: MenuItem;
}

export function OrderMenuCard({ item }: OrderMenuCardProps) {
  const { addItem, updateQuantity, getItemQuantity } = useCart();
  const quantity = getItemQuantity(item.id);

  return (
    <Card
      className={`overflow-hidden transition-all duration-300 ${
        !item.available
          ? "opacity-50 pointer-events-none"
          : "hover:shadow-lg"
      } ${quantity > 0 ? "ring-2 ring-primary" : ""}`}
    >
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          <div className="relative w-full sm:w-40 h-36 sm:h-auto flex-shrink-0">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
            />
            {item.popular && (
              <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-medium px-2 py-0.5 rounded">
                Popular
              </div>
            )}
            {!item.available && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-semibold text-sm bg-red-600 px-3 py-1 rounded">
                  Unavailable
                </span>
              </div>
            )}
          </div>
          <div className="p-4 flex flex-col justify-between flex-1 gap-3">
            <div>
              <div className="flex items-start justify-between gap-3 mb-1">
                <h3 className="text-base font-semibold text-foreground">
                  {item.name}
                </h3>
                <div className="flex flex-col items-end gap-0.5">
                  {item.originalPrice > item.price && (
                    <span className="text-muted-foreground line-through text-xs font-normal">
                      {"\u20B9"}{item.originalPrice}
                    </span>
                  )}
                  <span className="text-primary font-bold text-base flex-shrink-0">
                    {"\u20B9"}{item.price}
                  </span>
                </div>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                {item.description}
              </p>
            </div>
            <div className="flex items-center justify-end">
              {quantity === 0 ? (
                <Button
                  size="sm"
                  onClick={() => addItem(item)}
                  disabled={!item.available}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              ) : (
                <div className="flex items-center gap-3 bg-primary/10 rounded-lg px-2 py-1">
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => updateQuantity(item.id, quantity - 1)}
                    className="h-7 w-7 rounded-full hover:bg-primary/20"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </Button>
                  <span className="text-sm font-bold min-w-[1.5rem] text-center text-primary">
                    {quantity}
                  </span>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => updateQuantity(item.id, quantity + 1)}
                    className="h-7 w-7 rounded-full hover:bg-primary/20"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
