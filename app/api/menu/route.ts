import { NextRequest, NextResponse } from "next/server";
import { getMenuItems, saveMenuItems, addMenuItem, deleteMenuItem, updateMenuItem } from "@/lib/db";

export async function GET() {
  try {
    const items = getMenuItems();
    return NextResponse.json(items);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch menu" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, item, items, id, updates } = body;

    switch (action) {
      case "update-all":
        if (!items) {
          return NextResponse.json({ error: "Missing items" }, { status: 400 });
        }
        const saved = saveMenuItems(items);
        return NextResponse.json(saved);

      case "add":
        if (!item) {
          return NextResponse.json({ error: "Missing item" }, { status: 400 });
        }
        const added = addMenuItem(item);
        return NextResponse.json(added, { status: 201 });

      case "update":
        if (!id || !updates) {
          return NextResponse.json(
            { error: "Missing id or updates" },
            { status: 400 }
          );
        }
        const updated = updateMenuItem(id, updates);
        if (!updated) {
          return NextResponse.json(
            { error: "Item not found" },
            { status: 404 }
          );
        }
        return NextResponse.json(updated);

      case "delete":
        if (!id) {
          return NextResponse.json({ error: "Missing id" }, { status: 400 });
        }
        const deleted = deleteMenuItem(id);
        if (!deleted) {
          return NextResponse.json(
            { error: "Item not found" },
            { status: 404 }
          );
        }
        return NextResponse.json({ success: true });

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch {
    return NextResponse.json(
      { error: "Failed to update menu" },
      { status: 500 }
    );
  }
}
