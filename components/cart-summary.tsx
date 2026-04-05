"use client";

import { useCart } from "@/components/cart-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

interface CartSummaryProps {
  onCheckout: () => void;
}

export function CartSummary({ onCheckout }: CartSummaryProps) {
  const { items, updateQuantity, removeItem, totalPrice, totalItems } =
    useCart();

  if (items.length === 0) {
    return (
      <Card className="sticky top-24">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <ShoppingBag className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground mb-1">
            Your cart is empty
          </h3>
          <p className="text-sm text-muted-foreground">
            Add items from the menu to get started
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="sticky top-24">
      <CardContent className="p-6">
        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-primary" />
          Your Order
          <span className="ml-auto text-sm font-normal text-muted-foreground">
            {totalItems} item{totalItems !== 1 ? "s" : ""}
          </span>
        </h3>

        <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
          {items.map((item) => (
            <div
              key={item.menuItem.id}
              className="flex items-center gap-3 py-2 border-b border-border last:border-0"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {item.menuItem.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {"\u20B9"}{item.menuItem.price} each
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() =>
                    updateQuantity(item.menuItem.id, item.quantity - 1)
                  }
                  className="h-6 w-6 rounded-full"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="text-sm font-bold min-w-[1.25rem] text-center">
                  {item.quantity}
                </span>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() =>
                    updateQuantity(item.menuItem.id, item.quantity + 1)
                  }
                  className="h-6 w-6 rounded-full"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">
                  {"\u20B9"}{item.menuItem.price * item.quantity}
                </p>
              </div>
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={() => removeItem(item.menuItem.id)}
                className="h-6 w-6 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-4 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-base font-bold text-foreground">Total</span>
            <span className="text-xl font-bold text-primary">
              {"\u20B9"}{totalPrice}
            </span>
          </div>
        </div>

        <Button className="w-full" size="lg" onClick={onCheckout}>
          Proceed to Checkout
        </Button>
      </CardContent>
    </Card>
  );
}
