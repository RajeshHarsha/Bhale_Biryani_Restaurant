"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { CartProvider, useCart } from "@/components/cart-context";
import { OrderMenuCard } from "@/components/order-menu-card";
import { CartSummary } from "@/components/cart-summary";
import { CheckoutForm } from "@/components/checkout-form";
import { OrderConfirmation } from "@/components/order-confirmation";
import { BranchSelector } from "@/components/branch-selector";
import { MenuItem, Order, Branch } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingBag } from "lucide-react";

type OrderStep = "branch" | "menu" | "checkout" | "confirmation";

import { motion, AnimatePresence } from "framer-motion";

function OrderPageContent() {
  const [step, setStep] = useState<OrderStep>("branch");
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const { totalItems, clearCart } = useCart();

  useEffect(() => {
    fetch("/api/menu")
      .then((res) => res.json())
      .then((data) => {
        setMenuItems(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleOrderSuccess = (order: Order) => {
    setCompletedOrder(order);
    setStep("confirmation");
    clearCart();
  };

  const variants = {
    initial: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        x: { duration: 0.4 },
        opacity: { duration: 0.2 },
      },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -50 : 50,
      opacity: 0,
      transition: {
        x: { duration: 0.4 },
        opacity: { duration: 0.2 },
      },
    }),
  };

  const [direction, setDirection] = useState(0);

  const navigateTo = (newStep: OrderStep) => {
    const steps: OrderStep[] = ["branch", "menu", "checkout", "confirmation"];
    const currentIndex = steps.indexOf(step);
    const nextIndex = steps.indexOf(newStep);
    setDirection(nextIndex > currentIndex ? 1 : -1);
    setStep(newStep);
  };

  if (step === "confirmation" && completedOrder) {
    return <OrderConfirmation order={completedOrder} />;
  }

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 md:h-16">
            <Link
              href="/"
              className="flex items-center gap-2 group transition-transform hover:scale-105"
            >
              <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors mr-2">
                <ArrowLeft className="h-5 w-5" />
              </div>
              <Image
                src="/images/bb_logo.png"
                alt="Bhale Biryani"
                width={70}
                height={70}
                className="object-contain"
                priority
              />
            </Link>
            <div className="flex items-center gap-3">
              {step === "menu" && selectedBranch && (
                <Button
                  variant="ghost"
                  onClick={() => navigateTo("branch")}
                  className="hidden sm:flex text-sm font-bold gap-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Change Branch
                </Button>
              )}
              {step === "checkout" && (
                <Button
                  variant="ghost"
                  onClick={() => navigateTo("menu")}
                  className="text-sm font-bold gap-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Menu
                </Button>
              )}
              {totalItems > 0 && step === "menu" && (
                <Button 
                  onClick={() => navigateTo("checkout")} 
                  className="gap-2 font-black shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
                >
                  <ShoppingBag className="h-5 w-5" />
                  Cart ({totalItems})
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full"
          >
            {step === "branch" && (
              <BranchSelector
                onSelect={(branch) => {
                  setSelectedBranch(branch);
                  navigateTo("menu");
                }}
              />
            )}

            {step === "menu" && selectedBranch && (
              <div className="space-y-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                    <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter mb-3">
                      Place Your Order
                    </h1>
                    <div className="flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                       <p className="text-muted-foreground font-bold tracking-tight">
                        Ordering from: <strong className="text-primary uppercase">{selectedBranch.name}</strong>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-10">
                  <div className="lg:col-span-2">
                    {loading ? (
                      <div className="space-y-6">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="h-40 bg-muted/50 animate-pulse rounded-2xl"
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {menuItems
                          .filter((item) => {
                            const restrictedBranches = ["seethammadhara", "diamond-park", "gajuwaka"];
                            const allowedItems = ["chicken-fry-piece-biryani", "chicken-dum-biryani", "chittimutyalu-chicken-palav", "chicken-fry"];
                            if (selectedBranch && restrictedBranches.includes(selectedBranch.id)) {
                              return allowedItems.includes(item.id);
                            }
                            return true;
                          })
                          .map((item, idx) => (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.05 }}
                            >
                              <OrderMenuCard item={item} />
                            </motion.div>
                          ))}
                      </div>
                    )}
                  </div>

                  <div className="hidden lg:block sticky top-28 h-fit">
                    <CartSummary onCheckout={() => navigateTo("checkout")} />
                  </div>
                </div>
              </div>
            )}

            {step === "checkout" && selectedBranch && (
              <div className="max-w-3xl mx-auto">
                <CheckoutForm
                  branch={selectedBranch}
                  onBack={() => navigateTo("menu")}
                  onSuccess={handleOrderSuccess}
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Mobile Cart Bar */}
        <AnimatePresence>
          {totalItems > 0 && step === "menu" && (
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-2xl border-t border-border z-40"
            >
              <Button
                className="w-full h-14 font-black text-lg gap-3 shadow-[0_-10px_30px_rgba(var(--primary),0.2)]"
                onClick={() => navigateTo("checkout")}
              >
                <ShoppingBag className="h-6 w-6" />
                Checkout · ₹{totalItems > 0 ? "..." : "0"} ({totalItems} items)
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function OrderPage() {
  return (
    <CartProvider>
      <OrderPageContent />
    </CartProvider>
  );
}
