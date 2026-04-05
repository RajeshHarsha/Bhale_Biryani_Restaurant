"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Smartphone,
  CreditCard,
  ArrowLeft,
  Shield,
  CheckCircle,
  Clock,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const paymentMethods = [
  {
    id: "phonepe",
    name: "PhonePe",
    icon: "📱",
    color: "bg-purple-100 border-purple-200 hover:border-purple-400",
    textColor: "text-purple-700",
    enabled: false,
  },
  {
    id: "gpay",
    name: "Google Pay",
    icon: "💳",
    color: "bg-blue-100 border-blue-200 hover:border-blue-400",
    textColor: "text-blue-700",
    enabled: false,
  },
  {
    id: "paytm",
    name: "Paytm",
    icon: "📲",
    color: "bg-sky-100 border-sky-200 hover:border-sky-400",
    textColor: "text-sky-700",
    enabled: false,
  },
  {
    id: "bharatpe",
    name: "BharatPe",
    icon: "🇮🇳",
    color: "bg-orange-100 border-orange-200 hover:border-orange-400",
    textColor: "text-orange-700",
    enabled: false,
  },
];

export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <Image
              src="/images/bb_logo.png"
              alt="Bhale Biryani"
              width={100}
              height={100}
              className="object-contain"
              style={{ width: "100px", height: "100px" }}
              priority
            /></Link>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-12">
        {/* Coming Soon Banner */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
            <CreditCard className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">
            Online Payments
          </h1>
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Clock className="h-4 w-4" />
            Coming Soon
          </div>
          <p className="text-muted-foreground max-w-sm mx-auto">
            We are working on adding secure online payment options. Currently, we
            accept <strong>Cash on Delivery (COD)</strong> only.
          </p>
        </div>

        {/* Payment Methods Preview */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" />
              Upcoming Payment Options
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 opacity-60 cursor-not-allowed ${method.color}`}
                >
                  <span className="text-2xl">{method.icon}</span>
                  <div>
                    <span className={`text-sm font-semibold ${method.textColor}`}>
                      {method.name}
                    </span>
                    <p className="text-xs text-muted-foreground">Coming soon</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Current Payment Info */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Currently Available
            </h2>
            <div className="flex items-center gap-4 p-4 rounded-lg border-2 border-green-200 bg-green-50">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <span className="text-green-700 font-bold text-lg">₹</span>
              </div>
              <div>
                <span className="text-base font-semibold text-green-800">
                  Cash on Delivery (COD)
                </span>
                <p className="text-sm text-green-600">
                  Pay when you collect or receive your order
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="flex items-start gap-3 bg-secondary/50 rounded-lg p-4 mb-8">
          <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground mb-1">
              Secure Payments
            </p>
            <p className="text-xs text-muted-foreground">
              When online payments launch, all transactions will be processed
              through secure, RBI-certified payment gateways. Your financial
              data will be fully encrypted.
            </p>
          </div>
        </div>

        <Button className="w-full" size="lg" asChild>
          <Link href="/order">
            Order Now (COD)
          </Link>
        </Button>
      </main>
    </div>
  );
}
