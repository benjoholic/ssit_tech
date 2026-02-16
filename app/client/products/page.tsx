"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { Package, Grid2x2, Grid3x3, LayoutGrid } from "lucide-react";
import { getProductsAction } from "@/app/admin/products/actions";
import {
  CATEGORY_LABELS,
  type Product,
  type ProductCategory,
} from "@/lib/products";

const ALL_CATEGORIES: ProductCategory[] = ["cctv", "access_point", "switch"];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<ProductCategory | "all">("all");
  const [gridCols, setGridCols] = useState<2 | 3 | 4>(3);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
'['
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

  const filteredProducts = useMemo(() => {
    let result = products;

    if (activeCategory !== "all") {
      result = result.filter((p) => p.category === activeCategory);
    }

    const query = search.trim().toLowerCase();
    if (query) {
      result = result.filter((p) => {
        const name = p.name?.toLowerCase() ?? "";
        const description = p.description?.toLowerCase() ?? "";
        return name.includes(query) || description.includes(query);
      });
    }

    return result;
  }, [products, activeCategory, search]);

  const gridClass =
    gridCols === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : gridCols === 3
        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4";

  const imageUrl = (p: Product) =>
    p.image && p.image.trim() ? p.image.trim() : null;

  return (
    <main className="min-h-screen w-full px-4 py-6 md:px-8 lg:px-12">
      {/* Page header */}
      <section className="mb-6 md:mb-8">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Products
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {loading
            ? "Loading…"
            : `Showing ${filteredProducts.length} product${filteredProducts.length !== 1 ? "s" : ""}.`}
        </p>
      </section>

      {/* Filters bar */}
      <section className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Category pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
              activeCategory === "all"
                ? "bg-zinc-900 text-white shadow-sm"
                : "border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100"
            }`}
          >
            All
          </button>
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                activeCategory === cat
                  ? "bg-zinc-900 text-white shadow-sm"
                  : "border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        {/* Grid toggle + Search */}
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border border-zinc-200 bg-white p-0.5">
            {(
              [
                { cols: 2, icon: Grid2x2, label: "2 columns" },
                { cols: 3, icon: Grid3x3, label: "3 columns" },
                { cols: 4, icon: LayoutGrid, label: "4 columns" },
              ] as const
            ).map(({ cols, icon: Icon, label }) => (
              <button
                key={cols}
                type="button"
                aria-label={label}
                onClick={() => setGridCols(cols)}
                className={`rounded-md p-1.5 transition-colors ${
                  gridCols === cols
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-400 hover:text-zinc-700"
                }`}
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
              <svg
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M9.5 3.5a6 6 0 1 0 3.78 10.68l2.77 2.77a.75.75 0 1 0 1.06-1.06l-2.77-2.77A6 6 0 0 0 9.5 3.5Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search products..."
              className="h-9 w-full rounded-full border border-input bg-background pl-9 pr-16 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  searchInputRef.current?.focus();
                }}
                className="absolute inset-y-0 right-3 flex items-center text-xs text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section>
        {loading ? (
          <div className={`grid gap-4 ${gridClass}`}>
            {Array.from({ length: 6 }).map((_, i) => (
              <article
                key={i}
                className="flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm"
              >
                <div className="aspect-[4/3] w-full animate-pulse bg-muted" />
                <div className="space-y-2 p-4">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-full animate-pulse rounded bg-muted" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
                </div>
              </article>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed py-16">
            <Package className="mb-3 h-10 w-10 text-zinc-300" />
            <p className="text-sm font-medium">No products found</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <div className={`grid gap-4 ${gridClass}`}>
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="group flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm transition hover:shadow-md"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                  {imageUrl(product) ? (
                    <Image
                      src={imageUrl(product)!}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes={
                        gridCols === 2
                          ? "(max-width: 640px) 100vw, 50vw"
                          : gridCols === 3
                            ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      }
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-zinc-50">
                      <Package className="h-10 w-10 text-zinc-300" />
                      <span className="text-xs font-medium text-zinc-400">
                        No image available
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex flex-1 flex-col p-4">
                  <span className="mb-1.5 inline-block w-fit rounded-full bg-zinc-100 px-2 py-0.5 text-[0.65rem] font-medium text-zinc-600">
                    {CATEGORY_LABELS[product.category]}
                  </span>
                  <h2 className="text-sm font-semibold">{product.name}</h2>
                  <p className="mt-1 flex-1 text-xs leading-relaxed text-muted-foreground">
                    {product.description}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm font-bold">
                      ₱{product.price.toFixed(2)}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[0.65rem] font-medium ${
                        product.stocks > 0
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {product.stocks > 0
                        ? `${product.stocks} in stock`
                        : "Out of stock"}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}