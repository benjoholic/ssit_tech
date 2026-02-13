"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  getProductsAction,
  addProductAction,
  updateProductAction,
  deleteProductAction,
} from "@/app/admin/products/actions";
import { CATEGORY_LABELS, type Product, type ProductCategory } from "@/lib/products";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CATEGORY_OPTIONS: { value: ProductCategory; label: string }[] = [
  { value: "cctv", label: "CCTV" },
  { value: "access_point", label: "Access point" },
  { value: "switch", label: "Switch" },
];

type FormState = {
  name: string;
  description: string;
  category: ProductCategory;
  price: string;
  stocks: string;
  image: string;
};

const emptyForm: FormState = {
  name: "",
  description: "",
  category: "cctv",
  price: "",
  stocks: "0",
  image: "",
};

const MAX_IMAGE_SIZE = 800;
const JPEG_QUALITY = 0.85;

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function resizeImageIfNeeded(dataUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      let { width, height } = img;
      if (width <= MAX_IMAGE_SIZE && height <= MAX_IMAGE_SIZE) {
        resolve(dataUrl);
        return;
      }
      const scale = MAX_IMAGE_SIZE / Math.max(width, height);
      width = Math.round(width * scale);
      height = Math.round(height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(dataUrl);
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      try {
        resolve(canvas.toDataURL("image/jpeg", JPEG_QUALITY));
      } catch {
        resolve(dataUrl);
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

export default function ManageProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [imageLoading, setImageLoading] = useState(false);

  const fetchProducts = useCallback(async () => {
    const { data, error } = await getProductsAction();
    if (error) {
      toast.error("Failed to load products", { description: error });
      return;
    }
    setProducts(data);
  }, []);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getProductsAction().then(({ data, error }) => {
      if (mounted) {
        setLoading(false);
        if (error) {
          toast.error("Failed to load products", { description: error });
          return;
        }
        setProducts(data);
      }
    });
    return () => { mounted = false; };
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description ?? "",
      category: product.category,
      price: typeof product.price === "number" ? String(product.price) : "",
      stocks: typeof product.stocks === "number" ? String(product.stocks) : "0",
      image: product.image ?? "",
    });
    setDialogOpen(true);
  };

  const openDelete = (product: Product) => {
    setDeleteTarget(product);
    setDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    const name = form.name.trim();
    if (!name) return;
    const price = parseFloat(form.price.trim());
    if (form.price.trim() === "" || Number.isNaN(price) || price < 0) return;

    const description = form.description.trim();
    const image = form.image.trim();
    const stocks = Math.max(0, Math.floor(parseInt(form.stocks.trim(), 10) || 0));
    setSaving(true);

    if (editingId) {
      const updated: Product = {
        id: editingId,
        name,
        description,
        category: form.category,
        price,
        stocks,
        image,
      };
      const { error } = await updateProductAction(updated);
      setSaving(false);
      if (error) {
        toast.error("Update failed", { description: error });
        return;
      }
      toast.success("Product updated.", { description: `"${name}" has been updated.` });
      setDialogOpen(false);
      setForm(emptyForm);
      fetchProducts();
    } else {
      const { data, error } = await addProductAction({
        name,
        description,
        category: form.category,
        price,
        stocks,
        image,
      });
      setSaving(false);
      if (error) {
        toast.error("Add failed", { description: error });
        return;
      }
      toast.success("Product added.", { description: `"${name}" has been added.` });
      setDialogOpen(false);
      setForm(emptyForm);
      if (data) setProducts((prev) => [...prev, data]);
      else fetchProducts();
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setImageLoading(true);
    try {
      let dataUrl = await fileToDataUrl(file);
      dataUrl = await resizeImageIfNeeded(dataUrl);
      setForm((f) => ({ ...f, image: dataUrl }));
    } finally {
      setImageLoading(false);
      e.target.value = "";
    }
  };

  const clearImage = () => setForm((f) => ({ ...f, image: "" }));

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const deletedName = deleteTarget.name;
    const id = deleteTarget.id;
    const { error } = await deleteProductAction(id);
    if (error) {
      toast.error("Delete failed", { description: error });
      return;
    }
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast.success("Product deleted.", { description: `"${deletedName}" has been removed.` });
    setDeleteDialogOpen(false);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Manage products</h1>
          <p className="text-sm text-muted-foreground">
            Add, edit, or remove products. Changes are saved locally.
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/products">Back to products</Link>
          </Button>
          <Button onClick={openAdd}>Add product</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product list</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="rounded-lg border border-dashed border-border bg-muted/30 py-8 text-center text-sm text-muted-foreground">
              Loading products…
            </p>
          ) : products.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border bg-muted/30 py-8 text-center text-sm text-muted-foreground">
              No products yet. Click &quot;Add product&quot; to create one.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 font-medium">Image</th>
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 font-medium">Description</th>
                    <th className="pb-3 font-medium">Category</th>
                    <th className="pb-3 font-medium">Price</th>
                    <th className="pb-3 font-medium">Stocks</th>
                    <th className="pb-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-border last:border-0">
                      <td className="py-3">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt=""
                            className="h-10 w-10 rounded-md object-cover"
                          />
                        ) : (
                          <span className="text-muted-foreground text-xs">—</span>
                        )}
                      </td>
                      <td className="py-3 font-medium">{product.name}</td>
                      <td className="max-w-[200px] py-3 text-muted-foreground">
                        <span className="line-clamp-2">{product.description || "—"}</span>
                      </td>
                      <td className="py-3">
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                          {CATEGORY_LABELS[product.category]}
                        </span>
                      </td>
                      <td className="py-3 font-medium">
                        ₱{typeof product.price === "number" ? product.price.toFixed(2) : "0.00"}
                      </td>
                      <td className="py-3 tabular-nums">
                        {typeof product.stocks === "number" ? product.stocks : 0}
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEdit(product)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => openDelete(product)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="gap-0 p-0 sm:max-w-lg overflow-hidden">
          <DialogHeader className="gap-0.5 border-b border-gray-400/30 bg-gray-400/10 px-4 py-3 dark:border-gray-500/30 dark:bg-gray-500/10">
            <DialogTitle className="text-base font-medium text-gray-400 dark:text-gray-400">{editingId ? "Edit product" : "Add product"}</DialogTitle>
            <DialogDescription className="mt-0.5 text-xs text-gray-400 dark:text-gray-400">
              {editingId
                ? "Update the product details below."
                : "Fill in the details to add a new product."}
            </DialogDescription>
          </DialogHeader>
          <div className="px-4 pt-3">
          <div className="grid gap-2.5 py-1">
            <div className="grid gap-1">
              <label htmlFor="product-name" className="text-xs text-muted-foreground">
                Name
              </label>
              <input
                id="product-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Dome Camera HD 1080p"
                className="w-full rounded-full border border-input bg-muted/50 py-2 px-3 text-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div className="grid gap-1">
              <label htmlFor="product-description" className="text-xs text-muted-foreground">
                Description
              </label>
              <textarea
                id="product-description"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Brief product description"
                rows={2}
                className="w-full resize-none rounded-2xl border border-input bg-muted/50 py-2 px-3 text-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div className="grid gap-1">
              <label htmlFor="product-category" className="text-xs text-muted-foreground">
                Category
              </label>
              <select
                id="product-category"
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value as ProductCategory }))
                }
                className="w-full rounded-full border border-input bg-muted/50 py-2 px-3 text-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-1">
              <label htmlFor="product-price" className="text-xs text-muted-foreground">
                Price
              </label>
              <input
                id="product-price"
                type="number"
                min={0}
                step={0.01}
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                placeholder="0.00"
                className="w-full rounded-full border border-input bg-muted/50 py-2 px-3 text-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div className="grid gap-1">
              <label htmlFor="product-stocks" className="text-xs text-muted-foreground">
                Stocks
              </label>
              <input
                id="product-stocks"
                type="number"
                min={0}
                step={1}
                value={form.stocks}
                onChange={(e) => setForm((f) => ({ ...f, stocks: e.target.value }))}
                placeholder="0"
                className="w-full rounded-full border border-input bg-muted/50 py-2 px-3 text-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div className="grid gap-1">
              <label htmlFor="product-image" className="text-xs text-muted-foreground">
                Image
              </label>
              <input
                id="product-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={imageLoading}
                className="w-full rounded-full border border-input bg-muted/50 py-2 px-3 text-sm file:mr-2 file:rounded-full file:border-0 file:bg-primary file:px-3 file:py-1 file:text-sm file:font-medium file:text-primary-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
              />
              {imageLoading && (
                <p className="text-[10px] text-muted-foreground">Processing image…</p>
              )}
              {form.image && !imageLoading && (
                <div className="mt-0.5 flex flex-col items-center gap-1">
                  <img
                    src={form.image}
                    alt="Preview"
                    className="max-h-20 rounded border border-border object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <Button type="button" variant="outline" size="sm" className="h-7 text-xs" onClick={clearImage}>
                    Remove image
                  </Button>
                </div>
              )}
            </div>
          </div>
          </div>
          <DialogFooter showCloseButton className="gap-1.5 px-4 pb-4 pt-3">
            <Button
              onClick={handleSave}
              disabled={
                saving ||
                !form.name.trim() ||
                form.price.trim() === "" ||
                Number.isNaN(parseFloat(form.price)) ||
                parseFloat(form.price) < 0
              }
            >
              {saving ? "Saving…" : editingId ? "Save changes" : "Add product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md gap-0 p-0 overflow-hidden">
          <DialogHeader className="gap-0.5 border-b border-gray-400/30 bg-gray-400/10 px-4 py-3 dark:border-gray-500/30 dark:bg-gray-500/10">
            <DialogTitle className="text-base font-medium text-gray-400 dark:text-gray-400">Delete product</DialogTitle>
            <DialogDescription className="mt-0.5 text-xs text-gray-400 dark:text-gray-400">
              Are you sure you want to delete &quot;{deleteTarget?.name}&quot;? This cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter showCloseButton className="px-4 pb-4 pt-3">
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
