import { NextRequest, NextResponse } from "next/server";
import { createOrder, getOrders } from "@/lib/db";
import { Order } from "@/lib/types";

export async function GET() {
  try {
    const orders = getOrders();
    return NextResponse.json(orders);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, customer, orderType, branch } = body;

    if (!items || !items.length || !customer?.name || !customer?.phone || !branch) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const total = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    );

    // Generate a purely numeric 6-digit Order ID
    const order: Order = {
      id: Math.floor(100000 + Math.random() * 900000).toString(),
      items,
      customer,
      branch,
      orderType: orderType || "dine-in",
      status: "pending",
      total,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const created = createOrder(order);
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
