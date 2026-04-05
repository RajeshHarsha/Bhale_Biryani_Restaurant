"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Order, STATUS_LABELS, STATUS_COLORS } from "@/lib/types";
import {
  ShoppingBag,
  IndianRupee,
  Clock,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const today = new Date().toDateString();
  const todayOrders = orders.filter(
    (o) => new Date(o.createdAt).toDateString() === today
  );
  const todayRevenue = todayOrders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter(
    (o) => o.status === "pending" || o.status === "confirmed"
  );
  const completedToday = todayOrders.filter(
    (o) => o.status === "completed"
  ).length;

  const stats = [
    {
      label: "Today's Orders",
      value: todayOrders.length,
      icon: ShoppingBag,
      color: "text-blue-600 bg-blue-100",
    },
    {
      label: "Today's Revenue",
      value: `₹${todayRevenue}`,
      icon: IndianRupee,
      color: "text-green-600 bg-green-100",
    },
    {
      label: "Pending Orders",
      value: pendingOrders.length,
      icon: Clock,
      color: "text-yellow-600 bg-yellow-100",
    },
    {
      label: "Completed Today",
      value: completedToday,
      icon: CheckCircle,
      color: "text-emerald-600 bg-emerald-100",
    },
  ];

  const statusStats = [
    { label: "All", value: "all", count: orders.length, color: "bg-[#b44b2b] text-white" },
    { label: "Pending", value: "pending", count: orders.filter(o => o.status === "pending").length, color: "bg-[#f5f0eb] text-[#4a4a4a]" },
    { label: "Confirmed", value: "confirmed", count: orders.filter(o => o.status === "confirmed").length, color: "bg-[#f5f0eb] text-[#4a4a4a]" },
    { label: "Preparing", value: "preparing", count: orders.filter(o => o.status === "preparing").length, color: "bg-[#f5f0eb] text-[#4a4a4a]" },
    { label: "Ready", value: "ready", count: orders.filter(o => o.status === "ready").length, color: "bg-[#f5f0eb] text-[#4a4a4a]" },
    { label: "Completed", value: "completed", count: orders.filter(o => o.status === "completed").length, color: "bg-[#f5f0eb] text-[#4a4a4a]" },
    { label: "Cancelled", value: "cancelled", count: orders.filter(o => o.status === "cancelled").length, color: "bg-[#f5f0eb] text-[#4a4a4a]" },
  ];

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

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-6 pb-12"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="flex items-center justify-between" variants={itemVariants}>
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1 font-medium">
            Overview of your restaurant metrics
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground font-bold">
          <TrendingUp className="h-4 w-4" />
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={containerVariants}
      >
        {stats.map((stat) => (
          <motion.div key={stat.label} variants={itemVariants}>
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow cursor-default group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                    {stat.label}
                  </span>
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300 ${stat.color}`}
                  >
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-3xl font-black text-foreground">{stat.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      
      {/* Status Statistics */}
      <motion.div 
        className="flex gap-3 overflow-x-auto pb-4 scrollbar-none"
        variants={itemVariants}
      >
        {statusStats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: idx * 0.05 + 0.4 }}
            className={`flex items-center gap-3 px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-bold shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer ${stat.color}`}
          >
            {stat.label}
            <span className={`flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-black ${stat.value === 'all' ? 'bg-white/20' : 'bg-white shadow-inner text-foreground'}`}>
              {stat.count}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Orders */}
      <motion.div variants={itemVariants}>
        <Card className="border-none shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="p-6 border-b border-border bg-muted/30">
              <h2 className="text-xl font-black text-foreground tracking-tight">
                Recent Orders
              </h2>
            </div>
            {orders.length === 0 ? (
              <p className="text-center text-muted-foreground py-12 font-medium">
                No orders discovered yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/10">
                      <th className="text-left py-4 px-6 text-muted-foreground font-bold uppercase tracking-widest text-[10px]">
                        Order ID
                      </th>
                      <th className="text-left py-4 px-6 text-muted-foreground font-bold uppercase tracking-widest text-[10px]">
                        Customer
                      </th>
                      <th className="text-left py-4 px-6 text-muted-foreground font-bold uppercase tracking-widest text-[10px]">
                        Items
                      </th>
                      <th className="text-left py-4 px-6 text-muted-foreground font-bold uppercase tracking-widest text-[10px]">
                        Total
                      </th>
                      <th className="text-left py-4 px-6 text-muted-foreground font-bold uppercase tracking-widest text-[10px]">
                        Type
                      </th>
                      <th className="text-left py-4 px-6 text-muted-foreground font-bold uppercase tracking-widest text-[10px]">
                        Status
                      </th>
                      <th className="text-left py-4 px-6 text-muted-foreground font-bold uppercase tracking-widest text-[10px]">
                        Time
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 10).map((order, idx) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.03 + 0.5 }}
                        className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors group"
                      >
                        <td className="py-4 px-6 font-mono font-bold text-foreground text-xs">
                          #{order.id}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex flex-col">
                            <p className="font-bold text-foreground group-hover:text-primary transition-colors">
                              {order.customer.name}
                            </p>
                            <p className="text-[10px] font-bold text-muted-foreground opacity-60">
                              {order.customer.phone}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-muted-foreground font-medium">
                          <Badge variant="secondary" className="font-bold text-[10px]">
                            {order.items.reduce((sum, i) => sum + i.quantity, 0)} items
                          </Badge>
                        </td>
                        <td className="py-4 px-6 font-bold text-foreground">
                          ₹{order.total}
                        </td>
                        <td className="py-4 px-6 text-muted-foreground">
                          <span className="px-2 py-1 rounded bg-muted/50 text-[10px] font-black uppercase">
                            {order.orderType}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <Badge
                            className={`font-black text-[10px] uppercase px-3 py-1 ${STATUS_COLORS[order.status]}`}
                          >
                            {STATUS_LABELS[order.status]}
                          </Badge>
                        </td>
                        <td className="py-4 px-6 text-muted-foreground font-bold text-xs">
                          {new Date(order.createdAt).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
