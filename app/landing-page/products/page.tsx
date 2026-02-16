"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Search, Package, Grid2x2, Grid3x3, LayoutGrid } from "lucide-react";
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
  const [activeCategory, setActiveCategory] = useState<ProductCategory | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [gridCols, setGridCols] = useState<2 | 3 | 4>(3);

  const gridClass =
    gridCols === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : gridCols === 3
        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4";

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getProductsAction().then(({ data, error }) => {
      if (mounted) {
        setLoading(false);
        if (!error) setProducts(data);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    let result = products;

    if (activeCategory !== "all") {
      result = result.filter((p) => p.category === activeCategory);
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
  }, [products, activeCategory, searchTerm]);

  const imageUrl = (p: Product) =>
    p.image && p.image.trim() ? p.image.trim() : null;

  return (
    <div className="min-h-screen bg-white font-sans text-[var(--foreground)]">
      {/* Page hero */}
      <section className="border-b border-zinc-200/80 bg-white px-6 py-16 md:px-12 lg:px-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-600">
            What we offer
          </p>
          <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight text-zinc-800 md:text-5xl">
            Our Products
          </h1>
          <p className="text-lg leading-relaxed text-zinc-600">
            Browse our selection of CCTV cameras, access points, and network
            switches — built for reliability and performance.
          </p>
        </div>
      </section>

      {/* Filters + search */}
      <section className="border-b border-zinc-200/60 bg-zinc-50/50 px-6 py-6 md:px-12 lg:px-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Category pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                activeCategory === "all"
                  ? "bg-zinc-900 text-white shadow-sm"
                  : "bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-100 hover:text-zinc-900"
              }`}
            >
              All
            </button>
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-zinc-900 text-white shadow-sm"
                    : "bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-100 hover:text-zinc-900"
                }`}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>

          {/* Grid + Search */}
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

          <div className="relative w-full max-w-xs">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
              aria-hidden
            />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products…"
              className="w-full rounded-full border border-zinc-200 bg-white py-2 pl-9 pr-3 text-sm placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-300"
            />
          </div>
          </div>
        </div>
      </section>

      {/* Products grid */}
      <section className="px-6 py-16 md:px-12 lg:px-20">
        <div className="mx-auto max-w-6xl">
          {loading ? (
            /* Skeleton loader */
            <ul className={`grid gap-6 ${gridClass}`}>
              {Array.from({ length: 6 }).map((_, i) => (
                <li key={i}>
                  <article className="flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
                    <div className="aspect-[4/3] w-full animate-pulse bg-zinc-100" />
                    <div className="space-y-3 p-6">
                      <div className="h-5 w-3/4 animate-pulse rounded bg-zinc-100" />
                      <div className="h-4 w-full animate-pulse rounded bg-zinc-100" />
                      <div className="h-4 w-2/3 animate-pulse rounded bg-zinc-100" />
                      <div className="flex items-center justify-between pt-2">
                        <div className="h-5 w-16 animate-pulse rounded bg-zinc-100" />
                        <div className="h-6 w-20 animate-pulse rounded-full bg-zinc-100" />
                      </div>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          ) : filteredProducts.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Package className="mb-4 h-12 w-12 text-zinc-300" />
              <h3 className="mb-1 text-lg font-semibold text-zinc-700">
                No products found
              </h3>
              <p className="text-sm text-zinc-500">
                Try adjusting your filters or search term.
              </p>
            </div>
          ) : (
            /* Product cards */
            <ul className={`grid gap-6 ${gridClass}`}>
              {filteredProducts.map((product) => (
                <li key={product.id}>
                  <article className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md">
                    {/* Image */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100">
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
                    <div className="flex flex-1 flex-col p-6">
                      <span className="mb-2 inline-block w-fit rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600">
                        {CATEGORY_LABELS[product.category]}
                      </span>
                      <h3 className="mb-2 text-lg font-semibold text-zinc-800">
                        {product.name}
                      </h3>
                      <p className="mb-4 flex-1 text-sm leading-relaxed text-zinc-600">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-zinc-800">
                          ₱{product.price.toFixed(2)}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
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
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* CTA section */}
      <section className="border-t border-zinc-200/80 bg-zinc-50/50 px-6 py-16 md:px-12 lg:px-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-3 text-2xl font-semibold text-zinc-800">
            Need something else?
          </h2>
          <p className="mb-6 text-zinc-600">
            Can&apos;t find what you&apos;re looking for? Get in touch and
            we&apos;ll help you find the right solution.
          </p>
          <Link
            href="/landing-page/contact"
            className="inline-flex rounded-lg border-2 border-zinc-800 bg-transparent px-6 py-3 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-800 hover:text-white"
          >
            Contact us
          </Link>
        </div>
      </section>
    </div>
  );
}
