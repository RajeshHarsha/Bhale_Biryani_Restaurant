export interface MenuItem {
  id: string;
  name: string;
  description: string;
  originalPrice: number;
  price: number;
  image: string;
  category: "biryani" | "sides" | "extras";
  popular: boolean;
  available: boolean;
  branchId?: string | null;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled";

export type OrderType = "dine-in" | "takeaway";

export interface Branch {
  id: string;
  name: string;
  shortName: string;
  address: string;
  area: string;
  rating: number;
  reviews: number;
  services: string[];
  directionsUrl: string;
}


export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Hashed
  phone?: string;
  address?: string;
  role: "user" | "admin";
  createdAt: string;
}

export interface Order {
  id: string;
  userId?: string; // Optional for guests
  items: {
    menuItemId: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  customer: {
    name: string;
    phone: string;
  };
  branch: string;
  orderType: OrderType;
  status: OrderStatus;
  total: number;
  createdAt: string;
  updatedAt: string;
}

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "completed",
];

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  ready: "Ready",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  preparing: "bg-orange-100 text-orange-800 border-orange-200",
  ready: "bg-green-100 text-green-800 border-green-200",
  completed: "bg-gray-100 text-gray-800 border-gray-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
};
