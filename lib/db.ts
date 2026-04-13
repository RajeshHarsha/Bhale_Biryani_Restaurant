import { supabaseAdmin as supabase } from "./supabase-admin";
import { Order, MenuItem, User, Branch } from "./types";

// ── Users ───────────────────────────────────────────

export async function getUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching users:", error);
    return [];
  }
  return data as User[];
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("email", email.toLowerCase())
    .single();

  if (error && error.code !== "PGRST116") { // PGRST116 is code for "no rows returned"
    console.error("Error fetching user by email:", error);
    return undefined;
  }
  return data as User || undefined;
}

export async function createUser(user: User): Promise<User> {
  const { data, error } = await supabase
    .from("profiles")
    .insert([
      {
        id: user.id,
        name: user.name,
        email: user.email.toLowerCase(),
        password: user.password,
        phone: user.phone,
        role: user.role || "user",
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user");
  }
  return data as User;
}

// ── Orders ──────────────────────────────────────────

// Helper to transform Supabase order structure to our Order type
function transformOrder(data: any): Order {
  return {
    id: data.id,
    userId: data.user_id,
    items: data.order_items?.map((item: any) => ({
      menuItemId: item.menu_item_id,
      name: item.name,
      price: item.price,
      quantity: item.quantity
    })) || [],
    customer: {
      name: data.customer_name,
      phone: data.customer_phone
    },
    branch: data.branch_id,
    orderType: data.order_type,
    status: data.status,
    total: data.total_amount,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

export async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (*)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
  
  return data.map(transformOrder);
}

export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (*)
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user orders:", error);
    return [];
  }
  
  return data.map(transformOrder);
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (*)
    `)
    .eq("id", id)
    .single();

  if (error) {
    if (error.code !== "PGRST116") {
      console.error("Error fetching order by ID:", error);
    }
    return undefined;
  }
  
  return transformOrder(data);
}

export async function createOrder(order: Order): Promise<Order> {
  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .insert([
      {
        id: order.id,
        user_id: order.userId,
        customer_name: order.customer.name,
        customer_phone: order.customer.phone,
        branch_id: order.branch,
        order_type: order.orderType,
        status: order.status,
        total_amount: order.total,
        created_at: order.createdAt,
        updated_at: order.updatedAt,
      },
    ])
    .select()
    .single();

  if (orderError) {
    console.error("Error creating order:", orderError);
    throw new Error("Failed to create order");
  }

  const orderItems = order.items.map((item) => ({
    order_id: order.id,
    menu_item_id: item.menuItemId,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    console.error("Error creating order items:", itemsError);
  }

  return order;
}

// ── Branches ──────────────────────────────────────────

export async function getBranches(): Promise<Branch[]> {
  const { data, error } = await supabase
    .from("branches")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching branches:", error);
    return [];
  }

  return data.map((branch) => ({
    id: branch.id,
    name: branch.name,
    shortName: branch.short_name,
    address: branch.address,
    area: branch.area,
    rating: Number(branch.rating),
    reviews: branch.reviews,
    services: branch.services as string[],
    directionsUrl: branch.directions_url,
  })) as Branch[];
}

export async function updateOrder(
  id: string,
  updates: Partial<Order>
): Promise<Order | null> {
  const supabaseUpdates: any = {
    updated_at: new Date().toISOString(),
  };

  if (updates.status) supabaseUpdates.status = updates.status;
  if (updates.total) supabaseUpdates.total_amount = updates.total;

  const { data, error } = await supabase
    .from("orders")
    .update(supabaseUpdates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating order:", error);
    return null;
  }

  return data as unknown as Order;
}

// ── Menu ────────────────────────────────────────────

export async function getMenuItems(): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching menu items:", error);
    return [];
  }
  
  return data.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
    originalPrice: Number(item.original_price),
    price: Number(item.price),
    image: item.image_url,
    category: item.category,
    popular: item.is_popular,
    available: item.is_available,
    branchId: item.branch_id
  })) as MenuItem[];
}

export async function addMenuItem(item: MenuItem): Promise<MenuItem> {
  const { data, error } = await supabase
    .from("menu_items")
    .insert([
      {
        name: item.name,
        description: item.description,
        category: item.category,
        price: item.price,
        original_price: item.originalPrice,
        image_url: item.image,
        is_popular: item.popular,
        is_available: item.available,
        branch_id: item.branchId,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error adding menu item:", error);
    throw new Error("Failed to add menu item");
  }

  return data as unknown as MenuItem;
}

export async function deleteMenuItem(id: string): Promise<boolean> {
  const { error } = await supabase.from("menu_items").delete().eq("id", id);
  if (error) {
    console.error("Error deleting menu item:", error);
    return false;
  }
  return true;
}

export async function saveMenuItems(items: MenuItem[]): Promise<MenuItem[]> {
  // Clear existing items and insert new ones
  // Note: This is a destructive operation similar to the previous JSON implementation
  const { error: deleteError } = await supabase.from("menu_items").delete().neq("id", "placeholder"); // Delete all

  if (deleteError) {
    console.error("Error clearing menu items:", deleteError);
    throw new Error("Failed to clear existing menu items");
  }

  const supabaseItems = items.map(item => ({
    name: item.name,
    description: item.description,
    category: item.category,
    price: item.price,
    original_price: item.originalPrice,
    image_url: item.image,
    is_popular: item.popular,
    is_available: item.available,
    branch_id: item.branchId,
  }));

  const { data, error: insertError } = await supabase
    .from("menu_items")
    .insert(supabaseItems)
    .select();

  if (insertError) {
    console.error("Error saving menu items:", insertError);
    throw new Error("Failed to save menu items");
  }

  return data as unknown as MenuItem[];
}

export async function updateMenuItem(
  id: string,
  updates: Partial<MenuItem>
): Promise<MenuItem | null> {
  const supabaseUpdates: any = {};
  if (updates.name) supabaseUpdates.name = updates.name;
  if (updates.description) supabaseUpdates.description = updates.description;
  if (updates.category) supabaseUpdates.category = updates.category;
  if (updates.price) supabaseUpdates.price = updates.price;
  if (updates.originalPrice) supabaseUpdates.original_price = updates.originalPrice;
  if (updates.image) supabaseUpdates.image_url = updates.image;
  if (updates.popular !== undefined) supabaseUpdates.is_popular = updates.popular;
  if (updates.available !== undefined) supabaseUpdates.is_available = updates.available;
  if (updates.branchId !== undefined) supabaseUpdates.branch_id = updates.branchId;

  const { data, error } = await supabase
    .from("menu_items")
    .update(supabaseUpdates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating menu item:", error);
    return null;
  }

  return data as unknown as MenuItem;
}
