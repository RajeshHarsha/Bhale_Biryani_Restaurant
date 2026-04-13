import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Order, OrderType, Branch } from "@/lib/types";
import { ArrowLeft, Loader2, UtensilsCrossed, ShoppingBag, MapPin } from "lucide-react";
import { CreateOrderSchema } from "@/lib/schemas";
import { toast } from "sonner";

interface CheckoutFormProps {
  branch: Branch;
  onBack: () => void;
  onSuccess: (order: Order) => void;
}

const PLATFORM_CHARGE = 5;
const TAX_RATE = 0.18;

export function CheckoutForm({ branch, onBack, onSuccess }: CheckoutFormProps) {
  const { data: session } = useSession();
  const { items, totalPrice: subtotal } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [orderType, setOrderType] = useState<OrderType>("takeaway"); // DEFAULT TO TAKEAWAY
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const platformTotal = subtotal + PLATFORM_CHARGE;
  const taxAmount = Math.round(platformTotal * TAX_RATE);
  const grandTotal = platformTotal + taxAmount;

  useEffect(() => {
    if (session?.user) {
      if (session.user.name) setName(session.user.name);
      if ((session.user as any).phone) setPhone((session.user as any).phone);
    }
  }, [session]);

  const handleDineInClick = () => {
    toast.error("Sorry for the inconvience due to Gas Shortage now Dine-in is not available right now", {
      duration: 5000,
    });
    setOrderType("takeaway");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 1. Prepare data
    const orderData = {
      items: items.map((i) => ({
        menuItemId: i.menuItem.id,
        name: i.menuItem.name,
        price: i.menuItem.price,
        quantity: i.quantity,
      })),
      customer: { name: name.trim(), phone: phone.trim() },
      orderType,
      branch: branch.id,
      total: grandTotal, // USE CALCULATED GRAND TOTAL
    };

    // 2. Validate
    const validation = CreateOrderSchema.safeParse(orderData);
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });

      if (!res.ok) {
        throw new Error("Failed to place order");
      }

      const order = await res.json();
      onSuccess(order);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-lg mx-auto">
      <CardContent className="p-6 md:p-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Menu
        </button>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Checkout</h2>
          <span className="text-[10px] font-bold text-muted-foreground px-2 py-0.5 bg-muted rounded border uppercase">
            GSTIN: Applied (Pending)
          </span>
        </div>

        {/* Order Summary */}
        <div className="bg-secondary/50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-border/50">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Ordering From
            </h3>
            <span className="text-sm font-bold text-primary">{branch.shortName}</span>
          </div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Order Summary
          </h3>
          {items.map((item) => (
            <div
              key={item.menuItem.id}
              className="flex justify-between text-sm py-1"
            >
              <span className="text-muted-foreground">
                {item.menuItem.name} × {item.quantity}
              </span>
              <span className="font-medium text-foreground">
                {"\u20B9"}{item.menuItem.price * item.quantity}
              </span>
            </div>
          ))}
          
          <div className="border-t border-border/40 mt-3 pt-3 space-y-2">
             <div className="flex justify-between text-sm font-medium text-muted-foreground">
                <span>Items Subtotal</span>
                <span>{"\u20B9"}{subtotal}</span>
             </div>
             <div className="flex justify-between text-sm font-medium text-muted-foreground">
                <span>Platform Charges</span>
                <span>{"\u20B9"}{PLATFORM_CHARGE}</span>
             </div>
             <div className="flex justify-between text-sm font-medium text-muted-foreground">
                <span>GST (18%)</span>
                <span>{"\u20B9"}{taxAmount}</span>
             </div>
          </div>

          <div className="border-t-2 border-dashed border-border mt-3 pt-3 flex justify-between">
            <span className="font-bold text-foreground">Total Bill</span>
            <span className="font-bold text-primary text-xl">
              {"\u20B9"}{grandTotal}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Order Type */}
          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">
              Order Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleDineInClick}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                  orderType === "dine-in"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/50"
                }`}
              >
                <UtensilsCrossed className="h-4 w-4" />
                <span className="text-sm font-medium">Dine-in</span>
              </button>
              <button
                type="button"
                onClick={() => setOrderType("takeaway")}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                  orderType === "takeaway"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/50"
                }`}
              >
                <ShoppingBag className="h-4 w-4" />
                <span className="text-sm font-medium">Takeaway</span>
              </button>
            </div>
            <p className="text-[10px] text-amber-600 font-bold mt-2">
              * Dine-in restricted due to current logistics issues
            </p>
          </div>

          {/* Customer Details */}
          <div>
            <label
              htmlFor="name"
              className="text-sm font-medium text-foreground mb-1.5 block"
            >
              Your Name
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="text-sm font-medium text-foreground mb-1.5 block"
            >
              Phone Number
            </label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              required
            />
          </div>

          {error && (
            <p className="text-destructive text-sm font-medium">{error}</p>
          )}

          {/* Payment Method */}
          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">
              Payment Method
            </label>
            <div className="flex items-center gap-3 p-3 rounded-lg border-2 border-primary bg-primary/10">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold text-xs">{"\u20B9"}</span>
              </div>
              <div>
                <span className="text-sm font-semibold text-primary">Cash on Delivery (COD)</span>
                <p className="text-xs text-muted-foreground">Pay when you receive your order</p>
              </div>
            </div>
          </div>

          {/* Pickup & Delivery Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 space-y-1.5">
            <p className="text-sm font-medium text-amber-800">
              📍 Please come & collect your order from the restaurant.
            </p>
            <p className="text-xs text-amber-700">
              🚚 Want door delivery? Additional charges starting from {"\u20B9"}10 will apply for delivery.
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Placing Order...
              </>
            ) : (
              <>Place Order (COD) · {"\u20B9"}{grandTotal}</>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
