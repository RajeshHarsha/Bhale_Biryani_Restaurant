"use client";

import { Order, BRANCHES } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, MessageCircle, Home, Phone, IndianRupee, Clock, MapPin } from "lucide-react";
import Link from "next/link";

interface OrderConfirmationProps {
  order: Order;
}

export function OrderConfirmation({ order }: OrderConfirmationProps) {
  const branchInfo = BRANCHES.find((b) => b.id === order.branch);
  const whatsappNumber = "919849092758"; // Temporary single number for all branches

  const currentTime = new Date().toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const itemsList = order.items
    .map(
      (item, i) =>
        `   ${i + 1}. ${item.name} × ${item.quantity} — ₹${item.price * item.quantity}`
    )
    .join("\n");

  const whatsappMessage = encodeURIComponent(
    `----------------------------------------\n` +
      `      BHALE BIRYANI - ORDER RECEIPT\n` +
      `----------------------------------------\n\n` +
      `Order ID: ${order.id}\n` +
      `Type: ${order.orderType === "dine-in" ? "Dine-in" : "Takeaway"}\n` +
      `Branch: ${branchInfo?.shortName || order.branch}\n\n` +
      `ITEMS:\n` +
      `${order.items.map(i => `- ${i.name} x ${i.quantity} (₹${i.price * i.quantity})`).join('\n')}\n\n` +
      `----------------------------------------\n` +
      `TOTAL BILL: *₹${order.total}*\n` +
      `----------------------------------------\n\n` +
      `Customer: ${order.customer.name}\n` +
      `Phone: ${order.customer.phone}\n\n` +
      `Please confirm and prepare my order.\n` +
      `Thank you!\n` +
      `----------------------------------------`
  );

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center animate-in zoom-in duration-500">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-2">
            Order Placed! 🥳
          </h1>
          <p className="text-muted-foreground mb-8">
            Your order has been received successfully
          </p>

          {/* Order Details Card */}
          <div className="bg-[#fdf6e9] rounded-xl p-6 mb-6 text-left border border-[#f5e6d3]">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-[#8b7e6d]">Order ID</span>
              <span className="text-sm font-bold text-black font-mono tracking-tight">
                {order.id}
              </span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-[#8b7e6d]">Type</span>
              <div className="flex items-center gap-1.5">
                 <span className="text-sm">{order.orderType === "dine-in" ? "🍽️" : "📦"}</span>
                 <span className="text-sm font-medium text-black">
                   {order.orderType === "dine-in" ? "Dine-in" : "Takeaway"}
                 </span>
              </div>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-[#8b7e6d]">Branch</span>
              <span className="text-sm font-bold text-[#b45309]">
                {branchInfo?.shortName || order.branch}
              </span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-base font-semibold text-[#8b7e6d]">Total Bill</span>
              <span className="text-xl font-bold text-[#b45309]">
                ₹{order.total}
              </span>
            </div>
            
            <div className="border-t border-[#f5e6d3] pt-4 mt-2">
              <p className="text-[10px] uppercase font-bold text-[#8b7e6d] mb-3 tracking-wider">Items:</p>
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm py-1">
                  <span className="text-black font-medium">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="text-black font-bold">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Status Badge */}
          <div className="bg-[#fffbeb] border border-[#fef3c7] rounded-xl p-4 mb-8 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#fef3c7] flex items-center justify-center flex-shrink-0">
              <span className="text-[#b45309] font-bold text-sm">₹</span>
            </div>
            <div className="text-left">
              <span className="text-sm font-bold text-[#92400e]">
                Cash on Delivery (COD)
              </span>
              <p className="text-xs text-[#b45309]/80 font-medium">
                Payment pending · Pay ₹{order.total} at pickup
              </p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            📲 Tap below to confirm your order via WhatsApp
          </p>

          <div className="space-y-3">
            <Button className="w-full h-12 bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold rounded-xl shadow-sm transition-all" size="lg" asChild>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5 mr-2" />
                Confirm on WhatsApp
              </a>
            </Button>

            <Button variant="outline" className="w-full h-12 bg-[#fafaf9] border-[#e7e5e4] text-[#44403c] font-bold rounded-xl hover:bg-[#f5f5f4] transition-all" size="lg" asChild>
              <a href={`tel:+${whatsappNumber}`}>
                <Phone className="h-4 w-4 mr-2" />
                Call Restaurant
              </a>
            </Button>

            <Button variant="ghost" className="w-full h-12 text-[#44403c] font-semibold hover:bg-transparent hover:underline transition-all" asChild>
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
