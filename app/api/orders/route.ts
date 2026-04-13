import { NextRequest, NextResponse } from "next/server";
import { createOrder, getOrders } from "@/lib/db";
import { Order } from "@/lib/types";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { CreateOrderSchema } from "@/lib/schemas";
import { sanitizeObject } from "@/lib/security";

export async function GET() {
  try {
    const orders = await getOrders();
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
    const session = await getServerSession(authOptions);
    const rawBody = await request.json();
    
    // 1. Validate against schema
    const validation = CreateOrderSchema.safeParse(rawBody);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid order data", details: validation.error.format() },
        { status: 400 }
      );
    }

    // 2. Sanitize and extract
    const { items, customer, orderType, branch } = sanitizeObject(validation.data);

    const total = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    );

    // Generate a purely numeric 6-digit Order ID
    const order: Order = {
      id: Math.floor(100000 + Math.random() * 900000).toString(),
      userId: (session?.user as any)?.id, // Link to user if logged in
      items,
      customer,
      branch,
      orderType: orderType || "dine-in",
      status: "pending",
      total,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const created = await createOrder(order);
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
