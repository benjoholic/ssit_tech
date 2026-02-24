"use client";

import { useMemo, useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutGrid,
  List,
  Search,
  X,
  ShoppingCart,
  Package,
} from "lucide-react";
import {
  getProductsAction,
  getCategoriesAction,
} from "@/app/admin/products/actions";
import {
  CATEGORY_LABELS,
  type Product,
  type ProductCategory,
  type CategoryEntry,
} from "@/lib/products";
import { NoResultsAnimation } from "@/components/admin/no-results-animation";
import { BarcodeDisplay } from "@/components/barcode-display";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

type ViewMode = "grid" | "list";

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [dbCategories, setDbCategories] = useState<CategoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFiltering, startFiltering] = useTransition();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([getProductsAction(), getCategoriesAction()]).then(
      ([prodRes, catRes]) => {
        if (mounted) {
          setLoading(false);
          if (!prodRes.error) setProducts(prodRes.data);
          if (!catRes.error) setDbCategories(catRes.data);
        }
      },
    );
    return () => {
      mounted = false;
    };
  }, []);

  const categoryLabels = useMemo(() => {
    const labels: Record<string, string> = { ...CATEGORY_LABELS };
    for (const entry of dbCategories) {
      labels[entry.name] = entry.label;
    }
    for (const p of products) {
      if (p.category && !labels[p.category]) {
        labels[p.category] = p.category
          .replace(/_/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());
      }
    }
    return labels;
  }, [dbCategories, products]);

  const filteredProducts = useMemo(() => {
    let result = products;

    const query = searchTerm.trim().toLowerCase();
    if (query) {
      result = result.filter((p) => {
        const name = p.name?.toLowerCase() ?? "";
        const description = p.description?.toLowerCase() ?? "";
        return name.includes(query) || description.includes(query);
      });
    }

    return result;
  }, [products, searchTerm]);

  const searchSuggestions = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return [];

    const byText = products.filter((p) => {
      const name = p.name?.toLowerCase() ?? "";
      const description = p.description?.toLowerCase() ?? "";
      return name.includes(query) || description.includes(query);
    });

    return byText.slice(0, 8);
  }, [products, searchTerm]);

  const groupedProducts = useMemo(() => {
    const allSlugs = Object.keys(categoryLabels);
    const sorted = allSlugs.sort((a, b) =>
      categoryLabels[a].localeCompare(categoryLabels[b]),
    );
    return sorted
      .map((cat) => ({
        category: cat,
        label: categoryLabels[cat],
        items: filteredProducts.filter((p) => p.category === cat),
      }))
      .filter((g) => g.items.length > 0);
  }, [filteredProducts, categoryLabels]);

  const priceStr = (p: Product) =>
    typeof p.price === "number" ? p.price.toFixed(2) : "0.00";
  const imageUrl = (p: Product) =>
    p.image && p.image.trim() ? p.image.trim() : null;

  return (
    <main className="min-h-full bg-muted/30 px-4 py-8 lg:px-3 lg:py-6">
      <div className="mx-auto max-w-6xl lg:max-w-5xl space-y-4 sm:space-y-6 lg:space-y-3">
        <div className="sticky top-0 z-20 flex flex-col gap-3 border-b-2 border-border bg-muted/80 px-3 py-2 backdrop-blur sm:gap-4 sm:flex-row sm:items-center sm:justify-between lg:gap-2">
          <div className="w-full sm:flex-1 sm:max-w-md">
            <label htmlFor="products-search" className="sr-only">
              Search products
            </label>
            <div className="relative w-full">
              <Search
                className="pointer-events-none absolute left-2.5 sm:left-3 lg:left-2.5 top-1/2 h-3.5 sm:h-4 lg:h-3 w-3.5 sm:w-4 lg:w-3 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <input
                id="products-search"
                type="search"
                value={searchTerm}
                onChange={(e) => {
                  const value = e.target.value;
                  startFiltering(() => setSearchTerm(value));
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => {
                  setTimeout(() => setShowSuggestions(false), 100);
                }}
                placeholder="Search…"
                className="w-full rounded-full border border-foreground/40 bg-background py-1.5 sm:py-2 lg:py-1.5 pl-8 sm:pl-9 lg:pl-8 pr-14 text-xs sm:text-sm lg:text-xs placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
              />
              {searchTerm.trim().length > 0 && (
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    startFiltering(() => setSearchTerm(""));
                    setShowSuggestions(false);
                  }}
                  className="absolute right-2.5 sm:right-3 lg:right-2.5 top-1/2 -translate-y-1/2 rounded-full px-2 py-0.5 text-[10px] sm:text-xs lg:text-[10px] font-medium text-muted-foreground hover:text-foreground"
                  aria-label="Clear search"
                >
                  Clear
                </button>
              )}
              {showSuggestions && searchSuggestions.length > 0 && (
                <ul className="absolute z-20 mt-1 max-h-64 w-full rounded-md border border-border bg-card py-1 text-xs sm:text-sm shadow-lg">
                  {searchSuggestions.map((product) => (
                    <li key={product.id}>
                      <button
                        type="button"
                        className="flex w-full items-start gap-1 sm:gap-2 lg:gap-1 px-2 sm:px-3 lg:px-2 py-1 sm:py-1.5 lg:py-1 text-left hover:bg-muted/70"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          startFiltering(() =>
                            setSearchTerm(product.name ?? ""),
                          );
                        }}
                      >
                        <span className="truncate font-medium text-foreground text-xs sm:text-sm lg:text-xs">
                          {product.name}
                        </span>
                        <span className="ml-auto shrink-0 text-xs lg:text-[10px] text-muted-foreground">
                          {categoryLabels[product.category] ?? product.category}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="flex w-full sm:w-auto shrink-0 items-center gap-2 sm:gap-3 lg:gap-2">
            <div className="flex rounded-md border border-border bg-muted/30 p-0.5">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`rounded border-0 bg-transparent p-1.5 sm:p-2 lg:p-1.5 transition-colors ${
                  viewMode === "grid"
                    ? "bg-background shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-label="Grid view"
              >
                <LayoutGrid className="size-3 sm:size-4 lg:size-3" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`rounded border-0 bg-transparent p-1.5 sm:p-2 lg:p-1.5 transition-colors ${
                  viewMode === "list"
                    ? "bg-background shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-label="List view"
              >
                <List className="size-3 sm:size-4 lg:size-3" />
              </button>
            </div>
          </div>
        </div>

        <div
          className={`transition-opacity duration-500 ${isFiltering ? "opacity-60" : "opacity-100"}`}
        >
          {loading && viewMode === "grid" && (
            <ul className="grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <li
                  key={i}
                  className="rounded-lg border border-border bg-card overflow-hidden shadow-sm"
                >
                  <div className="relative aspect-[4/3] w-full bg-muted animate-pulse" />
                  <div className="p-2 sm:p-4 space-y-2 sm:space-y-3">
                    <div className="h-4 sm:h-5 bg-muted rounded animate-pulse" />
                    <div className="space-y-1 sm:space-y-2">
                      <div className="h-3 sm:h-4 bg-muted rounded animate-pulse" />
                      <div className="h-3 sm:h-4 bg-muted rounded w-3/4 animate-pulse" />
                    </div>
                    <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                      <div className="h-5 w-20 bg-muted rounded-full animate-pulse" />
                      <div className="h-5 w-16 bg-muted rounded animate-pulse" />
                      <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {loading && viewMode === "list" && (
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-3 lg:px-3 lg:py-2 text-left font-medium text-sm lg:text-xs text-foreground">
                      Image
                    </th>
                    <th className="px-4 py-3 lg:px-3 lg:py-2 text-left font-medium text-sm lg:text-xs text-foreground">
                      Description
                    </th>
                    <th className="px-4 py-3 lg:px-3 lg:py-2 text-left font-medium text-sm lg:text-xs text-foreground">
                      Category
                    </th>
                    <th className="px-4 py-3 lg:px-3 lg:py-2 text-left font-medium text-sm lg:text-xs text-foreground">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <tr
                      key={i}
                      className="border-b border-border last:border-0"
                    >
                      <td className="px-4 py-4 lg:px-3 lg:py-3">
                        <div className="h-32 sm:h-40 w-32 sm:w-40 bg-muted rounded-md animate-pulse" />
                      </td>
                      <td className="px-4 py-4 lg:px-3 lg:py-3">
                        <div className="space-y-2">
                          <div className="h-4 bg-muted rounded animate-pulse w-48" />
                          <div className="h-3 bg-muted rounded animate-pulse w-full" />
                          <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
                        </div>
                      </td>
                      <td className="px-4 py-4 lg:px-3 lg:py-3">
                        <div className="h-6 bg-muted rounded-full animate-pulse w-24" />
                      </td>
                      <td className="px-4 py-4 lg:px-3 lg:py-3">
                        <div className="h-4 bg-muted rounded animate-pulse w-20" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {!loading && viewMode === "grid" && (
            <div className="space-y-8">
              {groupedProducts.map((group) => (
                <section key={group.category}>
                  <div className="flex items-center gap-3 mb-3 sm:mb-4">
                    <div className="flex items-center gap-2 shrink-0">
                      <h2 className="text-sm sm:text-base font-semibold text-foreground tracking-tight">
                        {group.label}
                      </h2>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] sm:text-xs font-medium text-muted-foreground">
                        {group.items.length}
                      </span>
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
                  </div>
                  <ul className="grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {group.items.map((product) => (
                      <li
                        key={product.id}
                        className="rounded-lg border border-border bg-card overflow-hidden shadow-sm transition-all hover:shadow-md hover:border-primary/30 cursor-pointer group"
                        onClick={() => setSelectedProduct(product)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setSelectedProduct(product);
                          }
                        }}
                      >
                        {imageUrl(product) && (
                          <div className="relative aspect-[4/3] w-full bg-muted overflow-hidden">
                            <img
                              src={imageUrl(product)!}
                              alt=""
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                        )}
                        <div className="p-2 sm:p-4 lg:p-2">
                          <p className="font-medium text-sm sm:text-base lg:text-sm text-foreground">
                            {product.name}
                          </p>
                          {product.description && (
                            <p className="mt-0.5 sm:mt-1 lg:mt-0.5 text-xs sm:text-sm lg:text-xs text-muted-foreground line-clamp-2">
                              {product.description}
                            </p>
                          )}
                          <div className="mt-1 sm:mt-2 lg:mt-1 flex flex-wrap items-center gap-1 sm:gap-2 lg:gap-1">
                            <span className="font-semibold text-xs sm:text-sm lg:text-xs text-foreground">
                              ₱{priceStr(product)}
                            </span>
                            <span className="text-muted-foreground text-xs lg:text-[10px]">
                              Stocks:{" "}
                              {typeof product.stocks === "number"
                                ? product.stocks
                                : 0}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                    {/* Skeleton placeholders to balance the last row */}
                    {(() => {
                      const count = group.items.length;
                      const remSm = count % 2;
                      const remLg = count % 3;
                      const padSm = remSm === 0 ? 0 : 2 - remSm;
                      const padLg = remLg === 0 ? 0 : 3 - remLg;
                      const maxPad = Math.max(padSm, padLg);
                      return Array.from({ length: maxPad }).map((_, i) => {
                        const showSm = i < padSm;
                        const showLg = i < padLg;
                        if (!showSm && !showLg) return null;
                        const vis =
                          showSm && showLg
                            ? "hidden sm:block"
                            : showSm
                              ? "hidden sm:block lg:hidden"
                              : "hidden lg:block";
                        return (
                          <li
                            key={`skel-${i}`}
                            className={`rounded-lg border border-dashed border-border bg-muted/30 overflow-hidden ${vis}`}
                            aria-hidden
                          >
                            <div className="p-2 sm:p-4 lg:p-2 space-y-2 sm:space-y-3">
                              <div className="h-4 sm:h-5 bg-muted/50 rounded w-3/4" />
                              <div className="space-y-1 sm:space-y-2">
                                <div className="h-3 sm:h-4 bg-muted/50 rounded w-full" />
                                <div className="h-3 sm:h-4 bg-muted/50 rounded w-2/3" />
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="h-4 w-16 bg-muted/50 rounded" />
                                <div className="h-3 w-20 bg-muted/50 rounded" />
                              </div>
                            </div>
                          </li>
                        );
                      });
                    })()}
                  </ul>
                </section>
              ))}
            </div>
          )}

          {!loading && viewMode === "list" && (
            <div className="space-y-8">
              {groupedProducts.map((group) => (
                <section key={group.category}>
                  <div className="flex items-center gap-3 mb-3 sm:mb-4">
                    <div className="flex items-center gap-2 shrink-0">
                      <h2 className="text-sm sm:text-base font-semibold text-foreground tracking-tight">
                        {group.label}
                      </h2>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] sm:text-xs font-medium text-muted-foreground">
                        {group.items.length}
                      </span>
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
                  </div>
                  <div className="rounded-lg border border-border bg-card overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border bg-muted/50">
                          <th className="px-4 py-3 lg:px-3 lg:py-2 text-left font-medium text-sm lg:text-xs text-foreground">
                            Image
                          </th>
                          <th className="px-4 py-3 lg:px-3 lg:py-2 text-left font-medium text-sm lg:text-xs text-foreground">
                            Description
                          </th>
                          <th className="px-4 py-3 lg:px-3 lg:py-2 text-left font-medium text-sm lg:text-xs text-foreground">
                            Price
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.items.map((product) => (
                          <tr
                            key={product.id}
                            className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors cursor-pointer"
                            onClick={() => setSelectedProduct(product)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                setSelectedProduct(product);
                              }
                            }}
                          >
                            <td className="px-4 py-4 lg:px-3 lg:py-3">
                              <div className="h-32 sm:h-40 w-32 sm:w-40 shrink-0 overflow-hidden rounded-md bg-muted">
                                {imageUrl(product) ? (
                                  <img
                                    src={imageUrl(product)!}
                                    alt=""
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-muted-foreground text-xs px-1">
                                    No image
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-4 lg:px-3 lg:py-3">
                              <div className="max-w-sm">
                                <p className="font-medium text-sm lg:text-xs text-foreground mb-1">
                                  {product.name}
                                </p>
                                {product.description && (
                                  <p className="text-xs lg:text-[10px] text-muted-foreground line-clamp-3">
                                    {product.description}
                                  </p>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-4 lg:px-3 lg:py-3">
                              <span className="font-semibold text-sm lg:text-xs text-foreground">
                                ₱{priceStr(product)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              ))}
            </div>
          )}

          {!loading && groupedProducts.length === 0 && (
            <NoResultsAnimation
              message="No products found"
              isSearching={searchTerm.trim().length > 0}
            />
          )}
        </div>
      </div>

      {/* Product Detail Modal */}
      <Dialog
        open={!!selectedProduct}
        onOpenChange={(open) => {
          if (!open) setSelectedProduct(null);
        }}
      >
        <DialogContent className="max-w-lg sm:max-w-xl max-h-[90vh] overflow-y-auto">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg">
                  {selectedProduct.name}
                </DialogTitle>
                <DialogDescription>Product Details</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Image */}
                {imageUrl(selectedProduct) && (
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-muted">
                    <img
                      src={imageUrl(selectedProduct)!}
                      alt={selectedProduct.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                {/* Info grid */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">
                      Category
                    </p>
                    <Badge variant="secondary">
                      {categoryLabels[selectedProduct.category] ??
                        selectedProduct.category}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">
                      Price
                    </p>
                    <p className="text-lg font-bold">
                      ₱{priceStr(selectedProduct)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">
                      Stocks Available
                    </p>
                    <p className="text-sm font-semibold">
                      {typeof selectedProduct.stocks === "number"
                        ? selectedProduct.stocks
                        : 0}{" "}
                      units
                    </p>
                  </div>
                  {selectedProduct.barcode && (
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground font-medium">
                        Barcode
                      </p>
                      <BarcodeDisplay
                        value={selectedProduct.barcode}
                        height={35}
                        barWidth={1.2}
                        fontSize={10}
                      />
                    </div>
                  )}
                </div>

                {/* Description */}
                {selectedProduct.description && (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">
                      Description
                    </p>
                    <p className="text-sm text-foreground leading-relaxed">
                      {selectedProduct.description}
                    </p>
                  </div>
                )}
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  variant="outline"
                  onClick={() => setSelectedProduct(null)}
                >
                  Close
                </Button>
                <Button
                  className="gap-2"
                  onClick={() => {
                    setSelectedProduct(null);
                    router.push(`/client/orders?product=${selectedProduct.id}`);
                  }}
                >
                  <ShoppingCart className="h-4 w-4" />
                  Submit Inquiry
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
