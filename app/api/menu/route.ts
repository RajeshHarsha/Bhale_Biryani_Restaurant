import { NextRequest, NextResponse } from "next/server";
import { getMenuItems, saveMenuItems, addMenuItem, deleteMenuItem, updateMenuItem } from "@/lib/db";
import { MenuItemSchema } from "@/lib/schemas";
import { sanitizeObject } from "@/lib/security";

export async function GET() {
  try {
    const items = await getMenuItems();
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
    const rawBody = await request.json();
    const { action, id } = rawBody;

    switch (action) {
      case "update-all":
        const itemsValidation = MenuItemSchema.array().safeParse(rawBody.items);
        if (!itemsValidation.success) {
          return NextResponse.json({ error: "Invalid items data" }, { status: 400 });
        }
        const saved = await saveMenuItems(sanitizeObject(itemsValidation.data));
        return NextResponse.json(saved);

      case "add":
        const addValidation = MenuItemSchema.safeParse(rawBody.item);
        if (!addValidation.success) {
          return NextResponse.json({ error: "Invalid item data" }, { status: 400 });
        }
        const added = await addMenuItem(sanitizeObject(addValidation.data));
        return NextResponse.json(added, { status: 201 });

      case "update":
        if (!id || !rawBody.updates) {
          return NextResponse.json({ error: "Missing id or updates" }, { status: 400 });
        }
        const updateValidation = MenuItemSchema.partial().safeParse(rawBody.updates);
        if (!updateValidation.success) {
          return NextResponse.json({ error: "Invalid update data" }, { status: 400 });
        }
        const updated = await updateMenuItem(id, sanitizeObject(updateValidation.data));
        if (!updated) {
          return NextResponse.json({ error: "Item not found" }, { status: 404 });
        }
        return NextResponse.json(updated);

      case "delete":
        if (!id) {
          return NextResponse.json({ error: "Missing id" }, { status: 400 });
        }
        const deleted = await deleteMenuItem(id);
        if (!deleted) {
          return NextResponse.json({ error: "Item not found" }, { status: 404 });
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
