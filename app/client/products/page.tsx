"use client";

import React, { useRef, useState } from "react";

type Product = {
  id: number;
  name: string;
  description: string;
  priceLabel: string;
};

const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Product 1",
    description: "Short description of product 1.",
    priceLabel: "$0.00",
  },
  {
    id: 2,
    name: "Product 2",
    description: "Short description of product 2.",
    priceLabel: "$0.00",
  },
  {
    id: 3,
    name: "Product 3",
    description: "Short description of product 3.",
    priceLabel: "$0.00",
  },
  {
    id: 4,
    name: "Product 4",
    description: "Short description of product 4.",
    priceLabel: "$0.00",
  },
];

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term)
    );
  });

  const hasProducts = filteredProducts.length > 0;

  return (
    <main className="min-h-screen w-full px-4 py-6 md:px-8 lg:px-12">
      {/* Page header */}
      <section className="mb-6 flex flex-col gap-3 md:mb-8 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Products
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse all available products for SSIT Tech clients.
          </p>
        </div>

        {/* Search & filters */}
        <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
          {/* Search input */}
          <div className="relative w-full md:w-72">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
              {/* Search icon */}
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
              placeholder="Search products by name or description..."
              className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-16 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              type="button"
              onClick={() => {
                setSearch("");
                searchInputRef.current?.focus();
              }}
              disabled={!search}
              className="absolute inset-y-0 right-2 flex items-center text-xs text-muted-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
            >
              Clear
            </button>
          </div>

          {/* Simple placeholder filters (not wired yet) */}
          <div className="flex flex-wrap items-center gap-2 md:justify-end">
            <select className="h-9 min-w-[120px] rounded-md border border-input bg-background px-2 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <option value="">All categories</option>
              <option value="software">Software</option>
              <option value="hardware">Hardware</option>
              <option value="service">Service</option>
            </select>

            <select className="h-9 min-w-[140px] rounded-md border border-input bg-background px-2 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <option value="recent">Newest first</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
          </div>
        </div>
      </section>

      {/* Content section */}
      <section>
        {hasProducts ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="flex flex-col rounded-lg border bg-card p-4 shadow-sm transition hover:shadow-md"
              >
                <div className="mb-3 aspect-video w-full rounded-md bg-muted" />
                <h2 className="text-sm font-medium">{product.name}</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  {product.description}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm font-semibold">
                    {product.priceLabel}
                  </span>
                  <button className="rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                    View details
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed">
            <p className="text-sm font-medium">No products found</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Try adjusting your search or filters.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}