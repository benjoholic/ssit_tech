"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState, useEffect, useTransition } from "react";
import { LayoutGrid, List, Package, FilterX, Search } from "lucide-react";
import { getProductsAction } from "@/app/admin/products/actions";
import { CATEGORY_LABELS, type Product, type ProductCategory } from "@/lib/products";

function parseCategories(searchParams: ReturnType<typeof useSearchParams>): ProductCategory[] {
  const raw = searchParams.get("categories");
  if (!raw?.trim()) return [];
  const list = raw.split(",").map((s) => s.trim()).filter(Boolean);
  const valid: ProductCategory[] = ["cctv", "access_point", "switch"];
  return list.filter((c): c is ProductCategory => valid.includes(c as ProductCategory));
}

type ViewMode = "grid" | "list";

export default function AdminProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFiltering, startFiltering] = useTransition();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getProductsAction().then(({ data, error }) => {
      if (mounted) {
        setLoading(false);
        if (!error) setProducts(data);
      }
    });
    return () => { mounted = false; };
  }, []);

  const categories = useMemo(() => parseCategories(searchParams), [searchParams]);

  const filteredProducts = useMemo(() => {
    let result = products;

    if (categories.length > 0) {
      result = result.filter((p) => categories.includes(p.category));
    }

    const query = searchTerm.trim().toLowerCase();
    if (query) {
      result = result.filter((p) => {
        const name = p.name?.toLowerCase() ?? "";
        const description = p.description?.toLowerCase() ?? "";
        return name.includes(query) || description.includes(query);
      });
    }

    return result;
  }, [products, categories, searchTerm]);

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

  const priceStr = (p: Product) =>
    typeof p.price === "number" ? p.price.toFixed(2) : "0.00";
  const imageUrl = (p: Product) => (p.image && p.image.trim() ? p.image.trim() : null);

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-3">
      <div className="sticky -top-6 z-20 flex flex-col gap-3 border-b-2 border-border bg-muted/80 px-3 py-2 backdrop-blur sm:gap-4 sm:flex-row sm:items-center sm:justify-between lg:gap-2">
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
                // Small delay so click events on suggestions can fire
                setTimeout(() => setShowSuggestions(false), 100);
              }}
              placeholder="Search…"
              className="w-full rounded-full border border-input bg-muted/50 py-1.5 sm:py-2 lg:py-1.5 pl-8 sm:pl-9 lg:pl-8 pr-14 text-xs sm:text-sm lg:text-xs placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
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
                        startFiltering(() => setSearchTerm(product.name ?? ""));
                      }}
                    >
                      <span className="truncate font-medium text-foreground text-xs sm:text-sm lg:text-xs">
                        {product.name}
                      </span>
                      <span className="ml-auto shrink-0 text-xs lg:text-[10px] text-muted-foreground">
                        {CATEGORY_LABELS[product.category]}
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
                viewMode === "grid" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
              aria-label="Grid view"
            >
              <LayoutGrid className="size-3 sm:size-4 lg:size-3" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`rounded border-0 bg-transparent p-1.5 sm:p-2 lg:p-1.5 transition-colors ${
                viewMode === "list" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
              aria-label="List view"
            >
              <List className="size-3 sm:size-4 lg:size-3" />
            </button>
          </div>
          <Link
            href="/admin/products/manage-products"
            className="flex-1 sm:flex-none inline-flex shrink-0 items-center justify-center rounded-md bg-primary px-3 sm:px-4 lg:px-3 py-1.5 sm:py-2 lg:py-1 text-xs sm:text-sm lg:text-xs font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Manage products
          </Link>
        </div>
      </div>

      <div className={`transition-opacity duration-500 ${isFiltering ? "opacity-60" : "opacity-100"}`}>
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
                  <th className="px-4 py-3 lg:px-3 lg:py-2 text-left font-medium text-sm lg:text-xs text-foreground">Image</th>
                  <th className="px-4 py-3 lg:px-3 lg:py-2 text-left font-medium text-sm lg:text-xs text-foreground">Description</th>
                  <th className="px-4 py-3 lg:px-3 lg:py-2 text-left font-medium text-sm lg:text-xs text-foreground">Category</th>
                  <th className="px-4 py-3 lg:px-3 lg:py-2 text-left font-medium text-sm lg:text-xs text-foreground">Price</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
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
          <ul className="grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <li
                key={product.id}
                className="rounded-lg border border-border bg-card overflow-hidden shadow-sm transition-shadow hover:shadow"
              >
                {imageUrl(product) && (
                  <div className="relative aspect-[4/3] w-full bg-muted">
                    <img
                      src={imageUrl(product)!}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="p-2 sm:p-4 lg:p-2">
                  <p className="font-medium text-sm sm:text-base lg:text-sm text-foreground">{product.name}</p>
                  {product.description && (
                    <p className="mt-0.5 sm:mt-1 lg:mt-0.5 text-xs sm:text-sm lg:text-xs text-muted-foreground line-clamp-2">{product.description}</p>
                  )}
                  <div className="mt-1 sm:mt-2 lg:mt-1 flex flex-wrap items-center gap-1 sm:gap-2 lg:gap-1">
                    <span className="rounded-full bg-muted px-1.5 sm:px-2 lg:px-1 py-0.5 text-xs lg:text-[10px] font-medium text-muted-foreground">
                      {CATEGORY_LABELS[product.category]}
                    </span>
                    <span className="font-semibold text-xs sm:text-sm lg:text-xs text-foreground">₱{priceStr(product)}</span>
                    <span className="text-muted-foreground text-xs lg:text-[10px]">Stocks: {typeof product.stocks === "number" ? product.stocks : 0}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {!loading && viewMode === "list" && (
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 lg:px-3 lg:py-2 text-left font-medium text-sm lg:text-xs text-foreground">Image</th>
                  <th className="px-4 py-3 lg:px-3 lg:py-2 text-left font-medium text-sm lg:text-xs text-foreground">Description</th>
                  <th className="px-4 py-3 lg:px-3 lg:py-2 text-left font-medium text-sm lg:text-xs text-foreground">Category</th>
                  <th className="px-4 py-3 lg:px-3 lg:py-2 text-left font-medium text-sm lg:text-xs text-foreground">Price</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
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
                        <p className="font-medium text-sm lg:text-xs text-foreground mb-1">{product.name}</p>
                        {product.description && (
                          <p className="text-xs lg:text-[10px] text-muted-foreground line-clamp-3">{product.description}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 lg:px-3 lg:py-3">
                      <span className="rounded-full bg-muted px-2.5 py-1 text-xs lg:text-[10px] font-medium text-muted-foreground inline-block">
                        {CATEGORY_LABELS[product.category]}
                      </span>
                    </td>
                    <td className="px-4 py-4 lg:px-3 lg:py-3">
                      <span className="font-semibold text-sm lg:text-xs text-foreground">₱{priceStr(product)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-4 sm:px-6 lg:px-4 py-12 sm:py-16 lg:py-10 text-center">
            {categories.length > 0 ? (
              <>
                <div className="flex h-12 sm:h-14 lg:h-11 w-12 sm:w-14 lg:w-11 items-center justify-center rounded-full bg-muted/60 text-muted-foreground">
                  <FilterX className="h-5 sm:h-7 lg:h-5 w-5 sm:w-7 lg:w-5" aria-hidden />
                </div>
                <h2 className="mt-3 sm:mt-4 lg:mt-3 text-base sm:text-lg lg:text-base font-semibold text-foreground">
                  No products match your filters
                </h2>
                <p className="mt-1 sm:mt-1.5 lg:mt-1 max-w-sm text-xs sm:text-sm lg:text-xs text-muted-foreground">
                  No products found for {categories.map((c) => CATEGORY_LABELS[c]).join(", ")}. Try clearing the category checkboxes in the sidebar or choose different categories.
                </p>
                <Link
                  href="/admin/products"
                  className="mt-4 sm:mt-6 lg:mt-3 inline-flex items-center gap-1.5 sm:gap-2 lg:gap-1 rounded-md bg-primary px-3 sm:px-4 lg:px-3 py-1.5 sm:py-2 lg:py-1 text-xs sm:text-sm lg:text-xs font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <FilterX className="h-3.5 sm:h-4 lg:h-3 w-3.5 sm:w-4 lg:w-3" aria-hidden />
                  Clear filters
                </Link>
              </>
            ) : (
              <>
                <div className="flex h-12 sm:h-14 lg:h-11 w-12 sm:w-14 lg:w-11 items-center justify-center rounded-full bg-muted/60 text-muted-foreground">
                  <Package className="h-5 sm:h-7 lg:h-5 w-5 sm:w-7 lg:w-5" aria-hidden />
                </div>
                <h2 className="mt-3 sm:mt-4 lg:mt-3 text-base sm:text-lg lg:text-base font-semibold text-foreground">
                  No products yet
                </h2>
                <p className="mt-1 sm:mt-1.5 lg:mt-1 max-w-sm text-xs sm:text-sm lg:text-xs text-muted-foreground">
                  Get started by adding products. Use the button above to manage your product catalog.
                </p>
                <Link
                  href="/admin/products/manage-products"
                  className="mt-4 sm:mt-6 lg:mt-3 inline-flex items-center justify-center rounded-md bg-primary px-3 sm:px-4 lg:px-3 py-1.5 sm:py-2 lg:py-1 text-xs sm:text-sm lg:text-xs font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Manage products
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
