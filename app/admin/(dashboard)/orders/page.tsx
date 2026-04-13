"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Order,
  OrderStatus,
  STATUS_LABELS,
  STATUS_COLORS,
  ORDER_STATUS_FLOW,
  Branch,
} from "@/lib/types";
import {
  Search,
  ChevronRight,
  Phone,
  Clock,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  XCircle,
  MapPin,
  UtensilsCrossed,
  Download,
} from "lucide-react";
import * as XLSX from "xlsx";

const statusTabs: { label: string; value: OrderStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Preparing", value: "preparing" },
  { label: "Ready", value: "ready" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<OrderStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchBranches = useCallback(() => {
    fetch("/api/branches")
      .then((res) => res.json())
      .then((data) => setBranches(data))
      .catch(() => {});
  }, []);

  const fetchOrders = useCallback(() => {
    setLoading(true);
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchOrders();
    fetchBranches();
    const interval = setInterval(fetchOrders, 15000);
    return () => clearInterval(interval);
  }, [fetchOrders, fetchBranches]);

  const updateStatus = async (orderId: string, newStatus: OrderStatus) => {
    setUpdating(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? updated : o))
        );
      }
    } catch {
      // silently fail
    } finally {
      setUpdating(null);
    }
  };

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    const idx = ORDER_STATUS_FLOW.indexOf(currentStatus);
    if (idx === -1 || idx >= ORDER_STATUS_FLOW.length - 1) return null;
    return ORDER_STATUS_FLOW[idx + 1];
  };

  const filteredOrders = orders.filter((order) => {
    const matchesTab = activeTab === "all" || order.status === activeTab;
    const matchesSearch =
      search === "" ||
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.phone.includes(search);
    return matchesTab && matchesSearch;
  });

  const downloadExcelReport = () => {
    const data = filteredOrders.map((order) => ({
      "Order ID": order.id,
      Date: new Date(order.createdAt).toLocaleDateString("en-IN"),
      Time: new Date(order.createdAt).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      Customer: order.customer.name,
      Phone: order.customer.phone,
      Branch: branches.find((b: Branch) => b.id === order.branch)?.name || order.branch,
      Type: order.orderType,
      Status: STATUS_LABELS[order.status],
      Total: order.total,
      Items: order.items
        .map((i) => `${i.name} x ${i.quantity}`)
        .join(", "),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    
    // Set column widths for better readability
    const wscols = [
      { wch: 15 }, // Order ID
      { wch: 12 }, // Date
      { wch: 10 }, // Time
      { wch: 20 }, // Customer
      { wch: 15 }, // Phone
      { wch: 25 }, // Branch
      { wch: 12 }, // Type
      { wch: 12 }, // Status
      { wch: 10 }, // Total
      { wch: 50 }, // Items
    ];
    worksheet["!cols"] = wscols;

    const fileName = `bhale_biryani_orders_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const tabCounts = statusTabs.map((tab) => ({
    ...tab,
    count:
      tab.value === "all"
        ? orders.length
        : orders.filter((o) => o.status === tab.value).length,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Orders</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and track all customer orders
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={downloadExcelReport}
            className="gap-2 text-green-700 border-green-200 hover:bg-green-50"
            disabled={filteredOrders.length === 0}
          >
            <Download className="h-4 w-4" />
            Download Excel
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchOrders}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by order ID, name, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabCounts.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.value
                    ? "bg-primary-foreground/20"
                    : "bg-background"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">No orders found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const nextStatus = getNextStatus(order.status);
            const isExpanded = expandedOrder === order.id;

            return (
              <Card key={order.id} className="overflow-hidden">
                <CardContent className="p-0">
                  {/* Order Row */}
                  <button
                    onClick={() =>
                      setExpandedOrder(isExpanded ? null : order.id)
                    }
                    className="w-full p-4 flex items-center gap-4 hover:bg-muted/30 transition-colors text-left"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-bold text-sm text-foreground">
                          {order.id}
                        </span>
                        <Badge
                          variant="outline"
                          className={`text-xs ${STATUS_COLORS[order.status]}`}
                        >
                          {STATUS_LABELS[order.status]}
                        </Badge>
                        <span className="text-xs text-muted-foreground capitalize px-2 py-0.5 bg-muted rounded">
                          {order.orderType}
                        </span>
                        {order.branch && (
                          <Badge variant="secondary" className="text-[10px] h-5">
                            {branches.find((b: Branch) => b.id === order.branch)?.shortName || order.branch}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">
                          {order.customer?.name || "Guest"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(order.createdAt).toLocaleTimeString(
                            "en-IN",
                            { hour: "2-digit", minute: "2-digit" }
                          )}
                        </span>
                        <span className="font-semibold text-primary">
                          ₹{order.total}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {nextStatus && order.status !== "cancelled" && (
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateStatus(order.id, nextStatus);
                          }}
                          disabled={updating === order.id}
                          className="gap-1 text-xs"
                        >
                          {updating === order.id ? (
                            <RefreshCw className="h-3 w-3 animate-spin" />
                          ) : (
                            <ChevronRight className="h-3 w-3" />
                          )}
                          {STATUS_LABELS[nextStatus]}
                        </Button>
                      )}
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t border-border p-4 bg-muted/20">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-semibold text-foreground mb-2">
                            Items
                          </h4>
                          {order.items.map((item, i) => (
                            <div
                              key={i}
                              className="flex justify-between text-sm py-1"
                            >
                              <span className="text-muted-foreground">
                                {item.name} × {item.quantity}
                              </span>
                              <span className="font-medium text-foreground">
                                ₹{item.price * item.quantity}
                              </span>
                            </div>
                          ))}
                          <div className="border-t border-border mt-2 pt-2 flex justify-between">
                            <span className="font-bold text-foreground text-sm">
                              Total
                            </span>
                            <span className="font-bold text-primary">
                              ₹{order.total}
                            </span>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold text-foreground mb-2">
                            Customer
                          </h4>
                          <p className="text-sm text-foreground font-medium">
                            {order.customer?.name || "Guest"}
                          </p>
                          <a
                            href={`tel:${order.customer?.phone || ""}`}
                            className="flex items-center gap-1 text-sm text-primary hover:underline mt-1"
                          >
                            <Phone className="h-3 w-3" />
                            {order.customer?.phone || "N/A"}
                          </a>
                          <p className="text-sm text-muted-foreground mt-2 capitalize flex items-center gap-1">
                            <UtensilsCrossed className="h-3 w-3" />
                            {order.orderType}
                          </p>
                          <div className="mt-3 p-2 bg-background border border-border rounded text-xs">
                            <p className="font-semibold text-primary flex items-center gap-1 mb-1">
                              <MapPin className="h-3 w-3" />
                              {branches.find((b: Branch) => b.id === order.branch)?.name || order.branch}
                            </p>
                            <p className="text-muted-foreground">
                              {branches.find((b: Branch) => b.id === order.branch)?.address}
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-3 italic">
                            Placed:{" "}
                            {new Date(order.createdAt).toLocaleString("en-IN")}
                          </p>

                          {/* Status Actions */}
                          <div className="flex gap-2 mt-4 flex-wrap">
                            {order.status !== "cancelled" &&
                              order.status !== "completed" && (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() =>
                                    updateStatus(order.id, "cancelled")
                                  }
                                  disabled={updating === order.id}
                                  className="gap-1 text-xs"
                                >
                                  <XCircle className="h-3 w-3" />
                                  Cancel
                                </Button>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
