import fs from "fs";
import path from "path";
import { Order, MenuItem } from "./types";
import { defaultMenuItems } from "./menu-data";

const DATA_DIR = path.join(process.cwd(), "data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");
const MENU_FILE = path.join(DATA_DIR, "menu.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// ── Orders ──────────────────────────────────────────

export function getOrders(): Order[] {
  ensureDataDir();
  if (!fs.existsSync(ORDERS_FILE)) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2));
    return [];
  }
  const data = fs.readFileSync(ORDERS_FILE, "utf-8");
  return JSON.parse(data);
}

export function getOrderById(id: string): Order | undefined {
  const orders = getOrders();
  return orders.find((o) => o.id === id);
}

export function createOrder(order: Order): Order {
  ensureDataDir();
  const orders = getOrders();
  orders.unshift(order);
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
  return order;
}

export function updateOrder(
  id: string,
  updates: Partial<Order>
): Order | null {
  ensureDataDir();
  const orders = getOrders();
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) return null;
  orders[index] = { ...orders[index], ...updates, updatedAt: new Date().toISOString() };
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
  return orders[index];
}

// ── Menu ────────────────────────────────────────────

export function getMenuItems(): MenuItem[] {
  ensureDataDir();
  if (!fs.existsSync(MENU_FILE)) {
    fs.writeFileSync(MENU_FILE, JSON.stringify(defaultMenuItems, null, 2));
    return defaultMenuItems;
  }
  const data = fs.readFileSync(MENU_FILE, "utf-8");
  return JSON.parse(data);
}

export function saveMenuItems(items: MenuItem[]): MenuItem[] {
  ensureDataDir();
  fs.writeFileSync(MENU_FILE, JSON.stringify(items, null, 2));
  return items;
}

export function updateMenuItem(
  id: string,
  updates: Partial<MenuItem>
): MenuItem | null {
  const items = getMenuItems();
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;
  items[index] = { ...items[index], ...updates };
  saveMenuItems(items);
  return items[index];
}

export function addMenuItem(item: MenuItem): MenuItem {
  const items = getMenuItems();
  items.push(item);
  saveMenuItems(items);
  return item;
}

export function deleteMenuItem(id: string): boolean {
  const items = getMenuItems();
  const filtered = items.filter((item) => item.id !== id);
  if (filtered.length === items.length) return false;
  saveMenuItems(filtered);
  return true;
}
