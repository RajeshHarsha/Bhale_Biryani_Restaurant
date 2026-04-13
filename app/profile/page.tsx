"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { User, ShoppingBag, Clock, MapPin, ChevronRight, UserCircle, LogOut } from "lucide-react";
import { Order, STATUS_LABELS, STATUS_COLORS } from "@/lib/types";
import { signOut } from "next-auth/react";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/profile");
    }

    if (session?.user) {
      fetch("/api/orders")
        .then((res) => res.json())
        .then((data) => {
          // Filter orders for this user - in a real app, the API would do this
          const userOrders = data.filter((o: Order) => o.customer.phone === (session.user as any).phone || o.userId === (session.user as any).id);
          setOrders(userOrders);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [session, status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen items-center justify-center flex">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (!session) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Sidebar / User Info */}
          <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
            <Card className="border-none shadow-xl bg-card overflow-hidden">
              <div className="h-32 bg-primary relative">
                <div className="absolute -bottom-12 left-6">
                  <div className="w-24 h-24 rounded-3xl bg-card p-1 shadow-lg">
                    <div className="w-full h-full rounded-2xl bg-muted flex items-center justify-center text-primary">
                      <UserCircle className="h-12 w-12" />
                    </div>
                  </div>
                </div>
              </div>
              <CardContent className="pt-16 pb-8 px-6">
                  <div className="mb-6">
                  <h2 className="text-2xl font-black text-foreground tracking-tight">{session?.user?.name}</h2>
                  <p className="text-muted-foreground font-medium">{session?.user?.email}</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm font-semibold text-muted-foreground bg-muted/50 p-3 rounded-xl border border-border/50">
                    <User className="h-4 w-4 text-primary" />
                    <span>User since {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</span>
                  </div>
                  <Button variant="outline" className="w-full justify-start font-bold border-2" onClick={() => signOut()}>
                    <LogOut className="h-4 w-4 mr-2 text-red-500" />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-card p-6">
              <h3 className="font-black text-lg mb-4 tracking-tight">Need assistance?</h3>
              <p className="text-sm text-muted-foreground font-medium mb-6">
                Our support team is available from 11 AM to 10 PM for any order-related queries.
              </p>
              <Button asChild variant="secondary" className="w-full font-bold">
                <a href="tel:+919100888983">Call Support</a>
              </Button>
            </Card>
          </motion.div>

          {/* Main Content / Orders */}
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
                <ShoppingBag className="h-8 w-8 text-primary" />
                My Orders
              </h2>
              <Badge variant="secondary" className="font-black px-3 py-1 bg-primary/10 text-primary border-none">
                {orders.length} Total
              </Badge>
            </div>

            {orders.length === 0 ? (
              <Card className="border-none shadow-xl bg-card py-20 text-center">
                <CardContent>
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShoppingBag className="h-10 w-10 text-muted-foreground/40" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">No orders yet</h3>
                  <p className="text-muted-foreground mb-8 max-w-sm mx-auto font-medium">
                    Looks like you haven't indulged in our biryanis yet. Treat yourself today!
                  </p>
                  <Button asChild size="lg" className="font-bold shadow-lg shadow-primary/20 rounded-full px-8">
                    <Link href="/order">Order Now</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {orders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 + 0.3 }}
                  >
                    <Card className="border-none shadow-md bg-card group hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer active:scale-[0.99] border-l-4 border-l-primary/0 hover:border-l-primary">
                      <CardContent className="p-0">
                        <div className="p-6">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                            <div className="flex items-center gap-4">
                              <div className="p-3 bg-muted rounded-2xl text-primary font-black shadow-inner">
                                #{order.id}
                              </div>
                              <div>
                                <h4 className="font-black text-foreground">{order.branch}</h4>
                                <p className="text-xs text-muted-foreground font-bold flex items-center gap-1 opacity-70 mt-0.5">
                                  <Clock className="h-3 w-3" />
                                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                            </div>
                            <Badge className={`font-black text-[10px] uppercase px-3 py-1 rounded-full ${STATUS_COLORS[order.status]}`}>
                              {STATUS_LABELS[order.status]}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center justify-between pt-4 border-t border-border/50">
                            <div className="flex items-center gap-2">
                              <div className="flex -space-x-3">
                                {order.items.slice(0, 3).map((item, i) => (
                                  <div key={i} className="w-8 h-8 rounded-full bg-muted border-2 border-card flex items-center justify-center text-[10px] font-black">
                                    {item.name[0]}
                                  </div>
                                ))}
                              </div>
                              <span className="text-sm font-bold text-muted-foreground ml-1">
                                {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                              </span>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest opacity-60">Total Amount</p>
                                <p className="text-xl font-black text-foreground">₹{order.total}</p>
                              </div>
                              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
