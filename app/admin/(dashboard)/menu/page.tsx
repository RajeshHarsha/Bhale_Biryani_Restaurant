"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MenuItem, Branch } from "@/lib/types";
import { MenuItemSchema } from "@/lib/schemas";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Plus,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Loader2,
  Save,
  ImageIcon,
  Filter,
} from "lucide-react";

export default function AdminMenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filterBranch, setFilterBranch] = useState<string>("all");

  const emptyItem: MenuItem = {
    id: "",
    name: "",
    description: "",
    price: 0,
    originalPrice: 0,
    image: "/images/hero-biryani.jpg",
    category: "biryani",
    popular: false,
    available: true,
    branchId: null,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menuRes, branchRes] = await Promise.all([
          fetch("/api/menu"),
          fetch("/api/branches"),
        ]);
        const menuData = await menuRes.json();
        const branchData = await branchRes.json();
        setMenuItems(menuData);
        setBranches(branchData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleAvailability = async (item: MenuItem) => {
    try {
      const res = await fetch("/api/menu", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update",
          id: item.id,
          updates: { available: !item.available },
        }),
      });
      if (res.ok) {
        setMenuItems((prev) =>
          prev.map((i) =>
            i.id === item.id ? { ...i, available: !i.available } : i
          )
        );
      }
    } catch {
      // silently fail
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditItem({ ...item });
    setIsNew(false);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditItem({ ...emptyItem });
    setIsNew(true);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editItem || !editItem.name.trim()) return;
    setSaving(true);

    try {
      // 1. Client-side validation
      const itemToValidate = {
        ...editItem,
        branchId: editItem.branchId === "" ? null : editItem.branchId
      };
      
      const validation = MenuItemSchema.safeParse(itemToValidate);
      if (!validation.success) {
        toast.error(validation.error.errors[0].message);
        setSaving(false);
        return;
      }

      const payload = {
        ...validation.data,
        branchId: editItem.branchId || null
      };

      if (isNew) {
        const id = editItem.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
        const newItem = { ...payload, id };
        const res = await fetch("/api/menu", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "add", item: newItem }),
        });
        if (res.ok) {
          setMenuItems((prev) => [...prev, newItem as MenuItem]);
        }
      } else {
        const res = await fetch("/api/menu", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "update",
            id: editItem.id,
            updates: payload,
          }),
        });
        if (res.ok) {
          setMenuItems((prev) =>
            prev.map((i) => (i.id === editItem.id ? { ...i, ...payload } : i))
          );
        }
      }
      setIsDialogOpen(false);
    } catch {
      // silently fail
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      const res = await fetch("/api/menu", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id }),
      });
      if (res.ok) {
        setMenuItems((prev) => prev.filter((i) => i.id !== id));
      }
    } catch {
      // silently fail
    }
  };

  const filteredItems = menuItems.filter((item) => {
    if (filterBranch === "all") return true;
    if (filterBranch === "global") return !item.branchId;
    return item.branchId === filterBranch;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Menu Management</h1>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Menu Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Add, edit, or disable menu items
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-md text-sm">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={filterBranch}
              onChange={(e) => setFilterBranch(e.target.value)}
              className="bg-transparent border-none outline-none text-sm font-medium"
            >
              <option value="all">All Branches</option>
              <option value="global">Global Items (No Branch)</option>
              {branches.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
          <Button onClick={handleAdd} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Menu Items List */}
      <div className="space-y-3">
        {filteredItems.map((item) => (
          <Card
            key={item.id}
            className={`transition-opacity ${!item.available ? "opacity-60" : ""}`}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0 relative">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground truncate">
                      {item.name}
                    </h3>
                    {item.popular && (
                      <Badge variant="default" className="text-xs">
                        Popular
                      </Badge>
                    )}
                    {!item.available && (
                      <Badge variant="destructive" className="text-xs">
                        Unavailable
                      </Badge>
                    )}
                    {item.branchId ? (
                      <Badge variant="secondary" className="text-[10px] h-5 bg-blue-100 text-blue-800 border-blue-200">
                        {branches.find(b => b.id === item.branchId)?.shortName || "Branch"}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] h-5">
                        Global
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-primary">
                        ₹{item.price}
                      </span>
                      {item.originalPrice > item.price && (
                        <span className="text-[10px] text-muted-foreground line-through">
                          ₹{item.originalPrice}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground capitalize px-1.5 py-0.5 bg-muted rounded">
                      {item.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => toggleAvailability(item)}
                    title={item.available ? "Mark unavailable" : "Mark available"}
                  >
                    {item.available ? (
                      <ToggleRight className="h-5 w-5 text-green-600" />
                    ) : (
                      <ToggleLeft className="h-5 w-5 text-muted-foreground" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleEdit(item)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleDelete(item.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredItems.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground mb-4">
                No menu items found for this branch.
              </p>
              <Button onClick={handleAdd} className="gap-2">
                <Plus className="h-4 w-4" />
                Add First Item
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit/Add Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isNew ? "Add Menu Item" : "Edit Menu Item"}
            </DialogTitle>
          </DialogHeader>

          {editItem && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    Item Name
                  </label>
                  <Input
                    value={editItem.name}
                    onChange={(e) =>
                      setEditItem({ ...editItem, name: e.target.value })
                    }
                    placeholder="e.g., Chicken Dum Biryani"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  Description
                </label>
                <textarea
                  value={editItem.description}
                  onChange={(e) =>
                    setEditItem({ ...editItem, description: e.target.value })
                  }
                  placeholder="Describe the dish..."
                  className="w-full min-h-[80px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    Original Price (₹)
                  </label>
                  <Input
                    type="number"
                    value={editItem.originalPrice}
                    onChange={(e) =>
                      setEditItem({
                        ...editItem,
                        originalPrice: Number(e.target.value),
                      })
                    }
                    min={0}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    Offer Price (₹)
                  </label>
                  <Input
                    type="number"
                    value={editItem.price}
                    onChange={(e) =>
                      setEditItem({
                        ...editItem,
                        price: Number(e.target.value),
                      })
                    }
                    min={0}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    Category
                  </label>
                  <select
                    value={editItem.category}
                    onChange={(e) =>
                      setEditItem({
                        ...editItem,
                        category: e.target.value as MenuItem["category"],
                      })
                    }
                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                  >
                    <option value="biryani">Biryani</option>
                    <option value="sides">Sides</option>
                    <option value="extras">Extras</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    Assign to Branch
                  </label>
                  <select
                    value={editItem.branchId || ""}
                    onChange={(e) =>
                      setEditItem({
                        ...editItem,
                        branchId: e.target.value === "" ? null : e.target.value,
                      })
                    }
                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                  >
                    <option value="">All Branches (Global)</option>
                    {branches.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  Image Path
                </label>
                <Input
                  value={editItem.image}
                  onChange={(e) =>
                    setEditItem({ ...editItem, image: e.target.value })
                  }
                  placeholder="/images/dish-name.jpg"
                />
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editItem.popular}
                    onChange={(e) =>
                      setEditItem({ ...editItem, popular: e.target.checked })
                    }
                    className="rounded border-input text-primary focus:ring-primary h-4 w-4"
                  />
                  <span className="text-sm text-foreground">Popular</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editItem.available}
                    onChange={(e) =>
                      setEditItem({ ...editItem, available: e.target.checked })
                    }
                    className="rounded border-input text-primary focus:ring-primary h-4 w-4"
                  />
                  <span className="text-sm text-foreground">Available</span>
                </label>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isNew ? "Add Item" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
