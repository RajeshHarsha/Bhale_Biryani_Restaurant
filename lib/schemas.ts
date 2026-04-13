import { z } from "zod";

// ── User / Auth ──────────────────────────────────────

export const UserSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
  phone: z.string().regex(/^\+?[\d\s-]{10,15}$/, "Invalid phone number format"),
  role: z.enum(["user", "admin"]).default("user"),
  createdAt: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// ── Menu ─────────────────────────────────────────────

export const MenuItemSchema = z.object({
  id: z.string().min(1, "ID is required"),
  name: z.string().min(2).max(100),
  description: z.string().max(500),
  originalPrice: z.number().min(0),
  price: z.number().min(0),
  image: z.string().regex(/^(\/|http)/, "Image must be a relative path or URL"),
  category: z.enum(["biryani", "sides", "extras"]),
  popular: z.boolean().default(false),
  available: z.boolean().default(true),
  branchId: z.string().optional().nullable(),
});

// ── Orders ───────────────────────────────────────────

export const OrderItemSchema = z.object({
  menuItemId: z.string().min(1),
  name: z.string().min(1),
  price: z.number().min(0),
  quantity: z.number().int().min(1),
});

export const CreateOrderSchema = z.object({
  items: z.array(OrderItemSchema).min(1, "At least one item is required"),
  customer: z.object({
    name: z.string().min(2).max(100),
    phone: z.string().regex(/^\+?[\d\s-]{10,15}$/, "Invalid phone number format"),
  }),
  branch: z.string().min(1, "Branch selection is required"),
  orderType: z.enum(["dine-in", "takeaway"]),
});

export const OrderStatusUpdateSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["pending", "confirmed", "preparing", "ready", "completed", "cancelled"]),
});
