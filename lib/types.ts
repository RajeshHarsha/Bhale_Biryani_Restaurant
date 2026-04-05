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

export const BRANCHES: Branch[] = [
  {
    id: "seethammadhara",
    name: "Bhale Biryani Seethammadhara",
    shortName: "Seethammadhara",
    address: "Near Alluri Seetharama Raju Statue, KRM Colony",
    area: "Visakhapatnam",
    rating: 4.0,
    reviews: 185,
    services: ["Dine-in", "Takeaway"],
    directionsUrl: "https://maps.app.goo.gl/ZeBG1iuLaKPWBGFy7",
  },
  {
    id: "diamond-park",
    name: "Bhale Biryani Diamond Park",
    shortName: "Diamond Park",
    address: "Diamond Park Area",
    area: "Visakhapatnam",
    rating: 4.4,
    reviews: 284,
    services: ["Dine-in", "Takeaway"],
    directionsUrl: "https://maps.app.goo.gl/fB2VrZeaqtRgHHoX8",
  },
  {
    id: "nad-junction",
    name: "Bhale Biryani NAD Junction",
    shortName: "NAD Junction",
    address: "NAD Junction",
    area: "Visakhapatnam",
    rating: 4.6,
    reviews: 86,
    services: ["Dine-in", "Takeaway", "No delivery"],
    directionsUrl: "https://maps.app.goo.gl/53EjUFy1e4v9tXEg7",
  },
  {
    id: "gajuwaka",
    name: "Bhale Biryani Gajuwaka",
    shortName: "Gajuwaka",
    address: "Gajuwaka Area",
    area: "Gajuwaka",
    rating: 4.4,
    reviews: 378,
    services: ["Dine-in", "Takeaway"],
    directionsUrl: "https://maps.app.goo.gl/8ktRRCTWWDfXuJqm9",
  },
];

export interface Order {
  id: string;
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
