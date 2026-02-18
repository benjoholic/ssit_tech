"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Search } from "lucide-react";
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
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [isFiltering, startFiltering] = useTransition();
  const [selectedProductForActions, setSelectedProductForActions] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

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

  const filteredProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return products;

    return products.filter((p) => {
      const name = p.name?.toLowerCase() ?? "";
      const description = p.description?.toLowerCase() ?? "";
      const category = CATEGORY_LABELS[p.category]?.toLowerCase() ?? "";
      return (
        name.includes(query) ||
        description.includes(query) ||
        category.includes(query)
      );
    });
  }, [products, searchTerm]);

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-3">
      <div className="sticky -top-6 z-20 flex flex-col gap-2 border-b-2 border-border bg-muted/80 px-3 py-2.5 backdrop-blur sm:py-3 lg:py-2.5">
        <Breadcrumb>
          <BreadcrumbList className="text-xs sm:text-sm lg:text-xs">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/admin/products" className="font-medium text-muted-foreground hover:text-foreground">
                  Products
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold text-foreground">Manage Products</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-2 sm:gap-3 lg:gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="w-full sm:max-w-xs lg:max-w-xs">
              <label htmlFor="manage-products-search" className="sr-only">
                Search products
              </label>
              <div className="relative w-full">
                <Search
                  className="pointer-events-none absolute left-2.5 sm:left-3 lg:left-2.5 top-1/2 h-3.5 sm:h-4 lg:h-3 w-3.5 sm:w-4 lg:w-3 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                <input
                  id="manage-products-search"
                  type="search"
                  value={searchTerm}
                  onChange={(e) => {
                    const value = e.target.value;
                    startFiltering(() => setSearchTerm(value));
                  }}
                  placeholder="Search…"
                  className="w-full rounded-full border border-input bg-muted/50 py-1.5 sm:py-2 lg:py-1.5 pl-8 sm:pl-9 lg:pl-8 pr-14 text-xs sm:text-sm lg:text-xs placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                />
                {searchTerm.trim().length > 0 && (
                  <button
                    type="button"
                    onClick={() => startFiltering(() => setSearchTerm(""))}
                    className="absolute right-2.5 sm:right-3 lg:right-2.5 top-1/2 -translate-y-1/2 rounded-full px-2 py-0.5 text-[10px] sm:text-xs lg:text-[10px] font-medium text-muted-foreground hover:text-foreground"
                    aria-label="Clear search"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
            <Button onClick={openAdd} size="sm" className="hidden sm:block text-xs lg:text-xs h-8 lg:h-8 px-2 lg:px-2 shrink-0">Add product</Button>
          </div>
        </CardHeader>
        <CardContent className={`p-0 transition-opacity duration-500 ${isFiltering ? "opacity-60" : "opacity-100"}`}>
          {loading ? (
            <p className="rounded-lg border border-dashed border-border bg-muted/30 py-6 sm:py-8 text-center text-xs sm:text-sm text-muted-foreground p-6 sm:p-8">
              Loading products…
            </p>
          ) : products.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border bg-muted/30 py-6 sm:py-8 lg:py-5 text-center text-xs sm:text-sm lg:text-xs text-muted-foreground p-6 sm:p-8 lg:p-5">
              No products yet. Click &quot;Add product&quot; to create one.
            </p>
          ) : filteredProducts.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border bg-muted/30 py-6 sm:py-8 lg:py-5 text-center text-xs sm:text-sm lg:text-xs text-muted-foreground p-6 sm:p-8 lg:p-5">
              No products match your search.
            </p>
          ) : (
            <>
            <table className="w-full text-left border-t border-border">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-3 py-2 lg:px-2 lg:py-1.5 text-left font-medium text-xs lg:text-xs text-foreground">Image</th>
                    <th className="px-3 py-2 lg:px-2 lg:py-1.5 text-left font-medium text-xs lg:text-xs text-foreground">Name</th>
                    <th className="hidden sm:table-cell px-3 py-2 lg:px-2 lg:py-1.5 text-left font-medium text-xs lg:text-xs text-foreground">Description</th>
                    <th className="hidden sm:table-cell px-3 py-2 lg:px-2 lg:py-1.5 text-left font-medium text-xs lg:text-xs text-foreground">Category</th>
                    <th className="hidden sm:table-cell px-3 py-2 lg:px-2 lg:py-1.5 text-left font-medium text-xs lg:text-xs text-foreground">Price</th>
                    <th className="hidden sm:table-cell px-3 py-2 lg:px-2 lg:py-1.5 text-left font-medium text-xs lg:text-xs text-foreground">Stocks</th>
                    <th className="hidden sm:table-cell px-3 py-2 lg:px-2 lg:py-1.5 text-right font-medium text-xs lg:text-xs text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.map((product) => (
                    <tr key={product.id} className={`border-b border-border last:border-0 transition-colors cursor-pointer sm:cursor-default ${
                      selectedProductForActions?.id === product.id
                        ? "bg-gray-500/20 hover:bg-gray-500/30"
                        : "hover:bg-muted/50"
                    }`} onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedProductForActions(product);
                    }}>
                      <td className="px-3 py-2 lg:px-2 lg:py-2">
                        <div className="h-14 w-14 lg:h-12 lg:w-12 shrink-0 overflow-hidden rounded-md bg-muted">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-muted-foreground text-xs">
                              No image
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-2 lg:px-2 lg:py-2">
                        <span className={`font-medium text-xs lg:text-xs ${
                          selectedProductForActions?.id === product.id
                            ? "text-gray-600 dark:text-gray-400"
                            : "text-foreground"
                        }`}>{product.name}</span>
                      </td>
                      <td className="hidden sm:table-cell px-3 py-2 lg:px-2 lg:py-2">
                        <span className="text-xs lg:text-[10px] text-muted-foreground line-clamp-2">
                          {product.description || "—"}
                        </span>
                      </td>
                      <td className="hidden sm:table-cell px-3 py-2 lg:px-2 lg:py-2">
                        <span className="rounded-full bg-muted px-2.5 py-1 text-xs lg:text-[10px] font-medium text-muted-foreground inline-block">
                          {CATEGORY_LABELS[product.category]}
                        </span>
                      </td>
                      <td className="hidden sm:table-cell px-3 py-2 lg:px-2 lg:py-2">
                        <span className="font-semibold text-xs lg:text-xs text-foreground">₱{typeof product.price === "number" ? product.price.toFixed(2) : "0.00"}</span>
                      </td>
                      <td className="hidden sm:table-cell px-3 py-2 lg:px-2 lg:py-2 tabular-nums text-xs lg:text-xs">
                        {typeof product.stocks === "number" ? product.stocks : 0}
                      </td>
                      <td className="hidden sm:table-cell px-3 py-2 lg:px-2 lg:py-2 text-right">
                        <div className="flex justify-end gap-1 sm:gap-2 lg:gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEdit(product)}
                            className="text-[10px] sm:text-xs lg:text-xs h-7 sm:h-8 lg:h-7 px-2 sm:px-2 lg:px-1.5"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => openDelete(product)}
                            className="text-[10px] sm:text-xs lg:text-xs h-7 sm:h-8 lg:h-7 px-2 sm:px-2 lg:px-1.5"
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
            </table>
            {filteredProducts.length > 0 && (
              <div className="flex items-center justify-between gap-2 border-t border-border px-4 py-3 sm:px-4 sm:py-4 lg:px-3 lg:py-3">
                <div className="text-xs sm:text-sm lg:text-xs text-muted-foreground">
                  {currentPage === 1 && filteredProducts.length <= ITEMS_PER_PAGE
                    ? `Showing ${filteredProducts.length} of ${filteredProducts.length}`
                    : `Showing ${(currentPage - 1) * ITEMS_PER_PAGE + 1}-${Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} of ${filteredProducts.length}`}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="text-xs h-8 px-2"
                  >
                    Previous
                  </Button>
                  <div className="text-xs sm:text-sm lg:text-xs text-muted-foreground font-medium min-w-max">
                    Page {currentPage} of {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="text-xs h-8 px-2"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Add / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="gap-0 p-0 sm:max-w-lg lg:sm:max-w-md overflow-hidden max-h-[90vh] sm:max-h-none overflow-y-auto sm:overflow-y-visible">
          <DialogHeader className="gap-0.5 lg:gap-0.25 border-b border-gray-400/30 bg-gray-400/10 px-3 sm:px-4 lg:px-3 py-2 sm:py-3 lg:py-2 dark:border-gray-500/30 dark:bg-gray-500/10">
            <DialogTitle className="text-sm sm:text-base lg:text-sm font-medium text-gray-400 dark:text-gray-400">{editingId ? "Edit product" : "Add product"}</DialogTitle>
            <DialogDescription className="mt-0.5 lg:mt-0.25 text-xs lg:text-[11px] text-gray-400 dark:text-gray-400">
              {editingId
                ? "Update the product details below."
                : "Fill in the details to add a new product."}
            </DialogDescription>
          </DialogHeader>
          <div className="px-3 sm:px-4 lg:px-3 pt-2 sm:pt-3 lg:pt-2">
          <div className="grid gap-2 sm:gap-2.5 lg:gap-1.5 py-1">
            <div className="grid gap-0.5 sm:gap-1 lg:gap-0.5">
              <label htmlFor="product-name" className="text-xs lg:text-[11px] text-muted-foreground">
                Name
              </label>
              <input
                id="product-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Dome Camera HD 1080p"
                className="w-full rounded-full border border-input bg-muted/50 py-1.5 sm:py-2 lg:py-1.5 px-2 sm:px-3 lg:px-2 text-xs sm:text-sm lg:text-xs placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div className="grid gap-0.5 sm:gap-1 lg:gap-0.5">
              <label htmlFor="product-description" className="text-xs lg:text-[11px] text-muted-foreground">
                Description
              </label>
              <textarea
                id="product-description"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Brief product description"
                rows={2}
                className="w-full resize-none rounded-2xl border border-input bg-muted/50 py-1.5 sm:py-2 lg:py-1.5 px-2 sm:px-3 lg:px-2 text-xs sm:text-sm lg:text-xs placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div className="grid gap-0.5 sm:gap-1 lg:gap-0.5">
              <label htmlFor="product-category" className="text-xs lg:text-[11px] text-muted-foreground">
                Category
              </label>
              <select
                id="product-category"
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value as ProductCategory }))
                }
                className="w-full rounded-full border border-input bg-muted/50 py-1.5 sm:py-2 lg:py-1.5 px-2 sm:px-3 lg:px-2 text-xs sm:text-sm lg:text-xs focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-0.5 sm:gap-1 lg:gap-0.5">
              <label htmlFor="product-price" className="text-xs lg:text-[11px] text-muted-foreground">
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
                className="w-full rounded-full border border-input bg-muted/50 py-1.5 sm:py-2 lg:py-1.5 px-2 sm:px-3 lg:px-2 text-xs sm:text-sm lg:text-xs placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div className="grid gap-0.5 sm:gap-1 lg:gap-0.5">
              <label htmlFor="product-stocks" className="text-xs lg:text-[11px] text-muted-foreground">
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
                className="w-full rounded-full border border-input bg-muted/50 py-1.5 sm:py-2 lg:py-1.5 px-2 sm:px-3 lg:px-2 text-xs sm:text-sm lg:text-xs placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div className="grid gap-0.5 sm:gap-1 lg:gap-0.5">
              <label htmlFor="product-image" className="text-xs lg:text-[11px] text-muted-foreground">
                Image
              </label>
              <input
                id="product-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={imageLoading}
                className="w-full rounded-full border border-input bg-muted/50 py-1.5 sm:py-2 lg:py-1.5 px-2 sm:px-3 lg:px-2 text-xs sm:text-sm lg:text-xs file:mr-1 sm:file:mr-2 lg:file:mr-1 file:rounded-full file:border-0 file:bg-primary file:px-2 sm:file:px-3 lg:file:px-2 file:py-0.5 sm:file:py-1 lg:file:py-0.5 file:text-xs sm:file:text-sm lg:file:text-xs file:font-medium file:text-primary-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
              />
              {imageLoading && (
                <p className="text-xs sm:text-[10px] lg:text-[10px] text-muted-foreground">Processing image…</p>
              )}
              {form.image && !imageLoading && (
                <div className="mt-1 sm:mt-0.5 lg:mt-0.5 flex flex-col items-center gap-1">
                  <img
                    src={form.image}
                    alt="Preview"
                    className="max-h-16 sm:max-h-20 lg:max-h-14 rounded border border-border object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <Button type="button" variant="outline" size="sm" className="h-6 sm:h-7 lg:h-6 text-xs lg:text-[10px]" onClick={clearImage}>
                    Remove image
                  </Button>
                </div>
              )}
            </div>
          </div>
          </div>
          <DialogFooter showCloseButton className="gap-1.5 px-3 sm:px-4 lg:px-3 pb-3 sm:pb-4 lg:pb-3 pt-2 sm:pt-3 lg:pt-2">
            <Button
              onClick={handleSave}
              size="sm"
              className="text-xs sm:text-sm lg:text-xs h-8 sm:h-9 lg:h-8 px-2 sm:px-3 lg:px-2"
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
          <DialogHeader className="gap-0.5 lg:gap-0.25 border-b border-gray-400/30 bg-gray-400/10 px-3 sm:px-4 lg:px-3 py-2 sm:py-3 lg:py-2 dark:border-gray-500/30 dark:bg-gray-500/10">
            <DialogTitle className="text-sm sm:text-base lg:text-sm font-medium text-gray-400 dark:text-gray-400">Delete product</DialogTitle>
            <DialogDescription className="mt-0.5 lg:mt-0.25 text-xs lg:text-[11px] text-gray-400 dark:text-gray-400">
              Are you sure you want to delete &quot;{deleteTarget?.name}&quot;? This cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter showCloseButton className="px-3 sm:px-4 lg:px-3 pb-3 sm:pb-4 lg:pb-3 pt-2 sm:pt-3 lg:pt-2">
            <Button variant="destructive" onClick={handleDelete} size="sm" className="text-xs sm:text-sm lg:text-xs h-8 sm:h-9 lg:h-8 px-2 sm:px-3 lg:px-2">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Floating action buttons for mobile */}
      {selectedProductForActions && (
        <div className="fixed inset-0 sm:hidden z-30 bg-black/20" onClick={() => setSelectedProductForActions(null)} />
      )}
      {selectedProductForActions && (
        <div className="sm:hidden fixed bottom-6 right-4 z-40 flex flex-col gap-3">
          <Button
            size="sm"
            onClick={() => {
              openEdit(selectedProductForActions);
              setSelectedProductForActions(null);
            }}
            className="text-xs h-10 px-4 rounded-lg shadow-lg"
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              openDelete(selectedProductForActions);
              setSelectedProductForActions(null);
            }}
            className="text-xs h-10 px-4 rounded-lg shadow-lg"
          >
            Delete
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedProductForActions(null)}
            className="text-xs h-9 px-4 rounded-lg shadow-lg"
          >
            Close
          </Button>
        </div>
      )}
      
      {/* Floating Add Product button for mobile */}
      {!selectedProductForActions && (
        <Button
          onClick={openAdd}
          size="sm"
          className="sm:hidden fixed bottom-6 right-4 z-40 h-14 w-14 rounded-full shadow-lg p-0 flex items-center justify-center"
        >
          <span className="text-xl">+</span>
        </Button>
      )}
    </div>
  );
}
