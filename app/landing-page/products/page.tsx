"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  Package,
  X,
  ArrowRight,
  SlidersHorizontal,
  Star,
  Eye,
  ShoppingBag,
  ChevronRight,
  Tag,
  Truck,
  Shield,
  Headphones,
  Cctv,
  Wifi,
  Router,
  Cable,
  Monitor,
  Phone,
  Radio,
  Server,
  Cpu,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import FloatingMarketplace from "@/components/ui/floating-marketplace";
import {
  getProductsAction,
  getCategoriesAction,
} from "@/app/admin/products/actions";
import { NoResultsAnimation } from "@/components/admin/no-results-animation";
import {
  CATEGORY_LABELS,
  type Product,
  type ProductCategory,
  type CategoryEntry,
} from "@/lib/products";

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                  */
/* ------------------------------------------------------------------ */
const cardVariants: any = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

/* ------------------------------------------------------------------ */
/*  Quick-view modal                                                   */
/* ------------------------------------------------------------------ */
function QuickView({
  product,
  categoryLabel,
  onClose,
}: {
  product: Product;
  categoryLabel: string;
  onClose: () => void;
}) {
  const img = product.image?.trim() || null;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: "spring", stiffness: 350, damping: 30 }}
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close quick view"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 text-zinc-500 shadow-sm transition-colors hover:bg-zinc-100 hover:text-zinc-800"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid md:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-square bg-gradient-to-br from-zinc-50 to-zinc-100">
            {img ? (
              <Image
                src={img}
                alt={product.name}
                fill
                className="object-contain p-8"
                sizes="400px"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Package className="h-16 w-16 text-zinc-200" />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col p-6 md:p-8">
            <span className="mb-2 inline-block w-fit rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-600">
              {categoryLabel}
            </span>
            <h2 className="mb-2 text-xl font-bold text-zinc-900 leading-tight">
              {product.name}
            </h2>

            {/* Rating placeholder */}
            <div className="mb-3 flex items-center gap-1.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${i < 4 ? "fill-amber-400 text-amber-400" : "fill-zinc-200 text-zinc-200"}`}
                />
              ))}
              <span className="ml-1 text-xs text-zinc-400">4.0</span>
            </div>

            <p className="mb-5 text-sm leading-relaxed text-zinc-500">
              {product.description}
            </p>

            <div className="mb-5 flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                  product.stocks > 0
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-600"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${product.stocks > 0 ? "bg-emerald-500" : "bg-red-500"}`}
                />
                {product.stocks > 0
                  ? `${product.stocks} in stock`
                  : "Out of stock"}
              </span>
            </div>

            <div className="mt-auto flex gap-2.5">
              <Link
                href="/landing-page/contact"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-800"
              >
                <ShoppingBag className="h-4 w-4" />
                Inquire Now
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ================================================================== */
/*  Main Page                                                          */
/* ================================================================== */
export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [dbCategories, setDbCategories] = useState<CategoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<ProductCategory | "all">(
    "all",
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResultsOpen, setSearchResultsOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc" | "name">("default");

  const searchRef = useRef<HTMLDivElement>(null);

  /* -------- Derived data -------- */
  const categoryLabels = useMemo(() => {
    const labels: Record<string, string> = { ...CATEGORY_LABELS };
    for (const entry of dbCategories) labels[entry.name] = entry.label;
    for (const p of products) {
      if (p.category && !labels[p.category]) {
        labels[p.category] = p.category
          .replace(/_/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());
      }
    }
    return labels;
  }, [dbCategories, products]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of products) {
      counts[p.category] = (counts[p.category] ?? 0) + 1;
    }
    return counts;
  }, [products]);

  const allCategories = useMemo(() => {
    return Object.keys(categoryLabels)
      .sort((a, b) => categoryLabels[a].localeCompare(categoryLabels[b]));
  }, [categoryLabels]);

  /* -------- Data fetching -------- */
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([getProductsAction(), getCategoriesAction()])
      .then(([prodRes, catRes]) => {
        if (mounted) {
          setLoading(false);
          if (!prodRes.error) setProducts(prodRes.data);
          if (!catRes.error) setDbCategories(catRes.data);
        }
      })
      .catch((err) => {
        // Ensure we clear loading state on errors (e.g. missing env or server failure)
        // eslint-disable-next-line no-console
        console.error("Products page fetch error:", err);
        if (mounted) {
          setLoading(false);
          setProducts([]);
          setDbCategories([]);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);


  /* -------- Click-outside for search -------- */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchResultsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* -------- Filtered & sorted -------- */
  const searchResults = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter((p) => {
        const n = p.name?.toLowerCase() ?? "";
        const d = p.description?.toLowerCase() ?? "";
        return n.includes(q) || d.includes(q);
      })
      .slice(0, 6);
  }, [products, searchTerm]);

  const filteredProducts = useMemo(() => {
    let result = products;
    if (activeCategory !== "all")
      result = result.filter((p) => p.category === activeCategory);
    const q = searchTerm.trim().toLowerCase();
    if (q)
      result = result.filter((p) => {
        const n = p.name?.toLowerCase() ?? "";
        const d = p.description?.toLowerCase() ?? "";
        return n.includes(q) || d.includes(q);
      });

    // Sort
    if (sortBy === "price-asc") result = [...result].sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") result = [...result].sort((a, b) => b.price - a.price);
    else if (sortBy === "name") result = [...result].sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [products, activeCategory, searchTerm, sortBy]);

  const imageUrl = (p: Product) =>
    p.image && p.image.trim() ? p.image.trim() : null;

  const handleQuickView = useCallback((p: Product) => {
    setQuickViewProduct(p);
  }, []);

  /* ================================================================== */
  /*  Render                                                             */
  /* ================================================================== */
  return (
    <div className="min-h-screen bg-white pb-20 font-sans text-foreground lg:pb-0">
      {/* ====== Quick-view modal ====== */}
      <AnimatePresence>
        {quickViewProduct && (
          <QuickView
            product={quickViewProduct}
            categoryLabel={
              categoryLabels[quickViewProduct.category] ??
              quickViewProduct.category
            }
            onClose={() => setQuickViewProduct(null)}
          />
        )}
      </AnimatePresence>

      {/* ====== Breadcrumb ====== */}
      <div className="border-b border-zinc-100 bg-zinc-50/60">
        <div className="mx-auto flex max-w-7xl items-center gap-1.5 px-6 py-3 text-xs text-zinc-400 md:px-10">
          <Link href="/" className="transition-colors hover:text-zinc-600">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="font-medium text-zinc-700">Products</span>
        </div>
      </div>

      {/* ====== Page header ====== */}
      <section className="bg-white px-6 pt-8 pb-0 md:px-10 md:pt-10">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-8 md:px-10 md:py-10"
          >
            <div className="relative z-10">
              <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                All Products
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-300">
                Reliable wired and wireless technology solutions — designed for
                resale, deployment, and large-scale installations.
              </p>
            </div>

            {/* Animated floating icons */}
            <div className="pointer-events-none absolute right-2 top-0 bottom-0 hidden w-72 items-center md:flex lg:right-6 lg:w-96">
              {[
                { Icon: Cctv, x: 0, y: -35, delay: 0, size: "h-6 w-6" },
                { Icon: Wifi, x: 70, y: 10, delay: 0.15, size: "h-5 w-5" },
                { Icon: Router, x: 25, y: 40, delay: 0.3, size: "h-5 w-5" },
                { Icon: Cable, x: 120, y: -20, delay: 0.45, size: "h-5 w-5" },
                { Icon: Monitor, x: 160, y: 30, delay: 0.6, size: "h-6 w-6" },
                { Icon: Phone, x: 50, y: -10, delay: 0.1, size: "h-5 w-5" },
                { Icon: Radio, x: 200, y: -30, delay: 0.25, size: "h-5 w-5" },
                { Icon: Server, x: 95, y: 50, delay: 0.5, size: "h-5 w-5" },
                { Icon: Cpu, x: 230, y: 15, delay: 0.7, size: "h-5 w-5" },
                { Icon: Shield, x: 170, y: -5, delay: 0.35, size: "h-5 w-5" },
                { Icon: Headphones, x: 140, y: 55, delay: 0.55, size: "h-5 w-5" },
                { Icon: Truck, x: 250, y: -15, delay: 0.8, size: "h-5 w-5" },
              ].map(({ Icon, x, y, delay, size }, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0.5, scale: 0.9 }}
                  animate={{
                    opacity: [0.35, 0.55, 0.35],
                    y: [y, y - 8, y + 8, y],
                    scale: [1, 1.05, 0.97, 1],
                  }}
                  transition={{
                    delay,
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute"
                  style={{ left: x, top: `calc(50% + ${y}px)` }}
                >
                  <Icon className={`${size} text-white/60 drop-shadow-lg`} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ====== Toolbar: search + sort + filter ====== */}
      <section className="sticky top-14 z-40 border-b border-zinc-100 bg-white/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-2 md:px-10">
          <div className="flex items-center gap-2">
            {/* Search */}
            <div ref={searchRef} className="relative w-full max-w-[200px]">
              <Search
                className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400"
                aria-hidden
              />
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setSearchResultsOpen(true);
                }}
                onFocus={() => searchTerm.trim() && setSearchResultsOpen(true)}
                placeholder="Search…"
                className="h-7 w-full rounded-md border border-zinc-200 bg-zinc-50 pl-8 pr-7 text-xs placeholder:text-zinc-400 transition-all focus:border-zinc-300 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-200"
              />
              {searchTerm && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => {
                    setSearchTerm("");
                    setSearchResultsOpen(false);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                >
                  <X className="h-3 w-3" />
                </button>
              )}

              {/* Search overlay */}
              <AnimatePresence>
                {searchResultsOpen && searchTerm.trim() && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.12 }}
                    className="absolute left-0 right-0 top-full z-50 mt-1 max-h-72 overflow-y-auto rounded-md border border-zinc-200 bg-white shadow-lg"
                  >
                    {searchResults.length > 0 ? (
                      <ul className="py-0.5">
                        {searchResults.map((product) => (
                          <li key={product.id}>
                            <button
                              type="button"
                              onClick={() => {
                                handleQuickView(product);
                                setSearchResultsOpen(false);
                              }}
                              className="flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors hover:bg-zinc-50"
                            >
                              <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded bg-zinc-100">
                                {imageUrl(product) ? (
                                  <Image
                                    src={imageUrl(product)!}
                                    alt={product.name}
                                    fill
                                    className="object-contain p-0.5"
                                    sizes="32px"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center">
                                    <Package className="h-3.5 w-3.5 text-zinc-300" />
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-xs font-medium text-zinc-700">
                                  {product.name}
                                </p>
                              </div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="px-3 py-4 text-center text-xs text-zinc-400">
                        No results for &ldquo;{searchTerm.trim()}&rdquo;
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Separator */}
            <div className="hidden h-4 w-px bg-zinc-200 md:block" />

            {/* Category pills — inline on desktop */}
            <div className="hidden items-center gap-1 md:flex">
              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-all ${
                  activeCategory === "all"
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700"
                }`}
              >
                All
                <span className="ml-1 text-[10px] opacity-50">{products.length}</span>
              </button>
              {allCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-all ${
                    activeCategory === cat
                      ? "bg-zinc-900 text-white"
                      : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700"
                  }`}
                >
                  {categoryLabels[cat]}
                  <span className="ml-1 text-[10px] opacity-50">{categoryCounts[cat] ?? 0}</span>
                </button>
              ))}
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Sort */}
            <select
              aria-label="Sort products"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="hidden h-7 rounded-md border border-zinc-200 bg-zinc-50 px-2 text-[11px] text-zinc-500 transition-all focus:border-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-200 sm:block"
            >
              <option value="default">Default</option>
              <option value="price-asc">Price ↑</option>
              <option value="price-desc">Price ↓</option>
              <option value="name">A–Z</option>
            </select>

            {/* Result count */}
            {!loading && (
              <span className="hidden text-[11px] text-zinc-400 md:inline">
                {filteredProducts.length} {filteredProducts.length === 1 ? "item" : "items"}
              </span>
            )}

            {/* Mobile filter toggle */}
            <button
              type="button"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="flex items-center gap-1 rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1 text-[11px] font-medium text-zinc-500 transition-colors hover:bg-zinc-100 md:hidden"
            >
              <SlidersHorizontal className="h-3 w-3" />
              Filter
            </button>
          </div>

          {/* Category pills — mobile */}
          <AnimatePresence>
            {mobileFilterOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden md:hidden"
              >
                <div className="flex flex-wrap gap-1.5 pt-2 pb-1">
                  <select
                    aria-label="Sort products"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    className="mb-1.5 w-full h-7 rounded-md border border-zinc-200 bg-white px-2 text-xs text-zinc-600"
                  >
                    <option value="default">Sort: Default</option>
                    <option value="price-asc">Price: Low → High</option>
                    <option value="price-desc">Price: High → Low</option>
                    <option value="name">Name: A–Z</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveCategory("all");
                      setMobileFilterOpen(false);
                    }}
                    className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-all ${
                      activeCategory === "all"
                        ? "bg-zinc-900 text-white"
                        : "bg-zinc-100 text-zinc-500"
                    }`}
                  >
                    All ({products.length})
                  </button>
                  {allCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setActiveCategory(cat);
                        setMobileFilterOpen(false);
                      }}
                      className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-all ${
                        activeCategory === cat
                          ? "bg-zinc-900 text-white"
                          : "bg-zinc-100 text-zinc-500"
                      }`}
                    >
                      {categoryLabels[cat]} ({categoryCounts[cat] ?? 0})
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ====== Products grid ====== */}
      <section className="bg-zinc-50/40 px-6 py-10 md:px-10 md:py-14">
        <div className="mx-auto max-w-7xl">
          {loading ? (
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white"
                >
                  <div className="aspect-square w-full animate-pulse bg-zinc-100" />
                  <div className="flex flex-col gap-2.5 p-4">
                    <div className="h-3 w-16 animate-pulse rounded bg-zinc-100" />
                    <div className="h-4 w-full animate-pulse rounded bg-zinc-100" />
                    <div className="h-3 w-3/4 animate-pulse rounded bg-zinc-100" />
                    <div className="mt-2 h-5 w-20 animate-pulse rounded bg-zinc-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <NoResultsAnimation
                message="No products found"
                isSearching={!!searchTerm.trim() || activeCategory !== "all"}
              />
              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory("all");
                    setSearchTerm("");
                    setSortBy("default");
                  }}
                  className="rounded-lg bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
                >
                  Reset all filters
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={activeCategory + searchTerm + sortBy}
              initial="hidden"
              animate="visible"
              className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            >
              {filteredProducts.map((product, i) => (
                <motion.article
                  key={product.id}
                  variants={cardVariants}
                  custom={i}
                  className="group relative flex flex-col overflow-hidden rounded-xl border border-zinc-200/80 bg-white transition-all duration-200 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:border-zinc-300"
                >
                  {/* Badges */}
                  <div className="absolute left-2.5 top-2.5 z-10 flex flex-col gap-1">
                    {product.stocks === 0 && (
                      <span className="rounded bg-red-500 px-2 py-0.5 text-[10px] font-bold uppercase text-white shadow-sm">
                        Sold Out
                      </span>
                    )}
                    {product.stocks > 0 && product.stocks <= 5 && (
                      <span className="rounded bg-amber-500 px-2 py-0.5 text-[10px] font-bold uppercase text-white shadow-sm">
                        Low Stock
                      </span>
                    )}
                  </div>

                  {/* Image container */}
                  <div className="relative aspect-square w-full overflow-hidden bg-zinc-50">
                    {imageUrl(product) ? (
                      <Image
                        src={imageUrl(product)!}
                        alt={product.name}
                        fill
                        className="object-contain p-5 transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-1.5">
                        <Package className="h-10 w-10 text-zinc-200" />
                        <span className="text-[10px] font-medium text-zinc-300">
                          No image
                        </span>
                      </div>
                    )}

                    {/* Hover action buttons */}
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 p-3 opacity-100 translate-y-0 md:opacity-0 md:translate-y-2 md:transition-all md:duration-200 md:group-hover:opacity-100 md:group-hover:translate-y-0">
                      <button
                        type="button"
                        aria-label="Quick view"
                        onClick={() => handleQuickView(product)}
                        className="flex items-center gap-1.5 rounded-lg bg-white/90 px-3 py-2 text-xs font-semibold text-zinc-700 shadow-lg backdrop-blur-sm transition-colors hover:bg-zinc-900 hover:text-white"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Quick View
                      </button>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col p-3.5 sm:p-4">
                    {/* Category */}
                    <span className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                      {categoryLabels[product.category] ?? product.category}
                    </span>

                    {/* Name */}
                    <h3 className="mb-1 line-clamp-2 text-sm font-semibold leading-snug text-zinc-800">
                      {product.name}
                    </h3>

                    {/* Description — hidden on very small screens */}
                    <p className="mb-3 hidden line-clamp-2 text-xs leading-relaxed text-zinc-400 sm:block">
                      {product.description}
                    </p>

                    {/* Rating */}
                    <div className="mb-2 flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          className={`h-3 w-3 ${idx < 4 ? "fill-amber-400 text-amber-400" : "fill-zinc-200 text-zinc-200"}`}
                        />
                      ))}
                      <span className="ml-1 text-[10px] text-zinc-400">
                        (4.0)
                      </span>
                    </div>

                    {/* CTA */}
                    <div className="mt-auto">
                      <Link
                        href="/landing-page/contact"
                        className="hidden shrink-0 items-center gap-1 rounded-lg bg-zinc-900 px-3 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-zinc-700 sm:inline-flex"
                      >
                        Inquire
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ====== Trust Badges ====== */}
      <section className="border-y border-zinc-200/60 bg-white px-6 py-10 md:px-10">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          {[
            {
              icon: Truck,
              title: "Fast Delivery",
              desc: "Nationwide shipping available",
            },
            {
              icon: Shield,
              title: "Warranty Included",
              desc: "All products covered",
            },
            {
              icon: Tag,
              title: "Best Prices",
              desc: "Competitive market rates",
            },
            {
              icon: Headphones,
              title: "24/7 Support",
              desc: "We're here to help",
            },
          ].map((item) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4 }}
              className="flex items-start gap-3"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100">
                <item.icon className="h-5 w-5 text-zinc-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-800">
                  {item.title}
                </p>
                <p className="text-xs text-zinc-400">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ====== CTA ====== */}
      <section className="bg-zinc-900 px-6 py-16 md:px-10 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="mb-3 text-2xl font-bold text-white md:text-3xl">
            Can't find what you need?
          </h2>
          <p className="mb-8 text-sm leading-relaxed text-zinc-400 md:text-base">
            Our team can source the right product or design a custom solution
            for your specific requirements.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/landing-page/contact"
              className="group inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition-all hover:bg-zinc-100"
            >
              Contact Us
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/landing-page/about"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-zinc-800"
            >
              About Us
            </Link>
          </div>
        </motion.div>
      </section>
      <FloatingMarketplace />
    </div>
  );
}
