"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import {
  Search,
  Package,
  X,
  ArrowRight,
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
import { fetchProductsCached, fetchCategoriesCached } from "@/lib/productsClient";
import { NoResultsAnimation } from "@/components/admin/no-results-animation";
import {
  type Product,
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
                className="object-contain"
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
            <h2 className="mb-2 text-2xl font-extrabold tracking-tight text-zinc-900 leading-snug">
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

            <p className="mb-5 text-base leading-relaxed text-zinc-600">
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
/*  Main Page                                                          */
/* ================================================================== */

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [dbCategories, setDbCategories] = useState<CategoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const [isFiltering, startFiltering] = useTransition();

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* -------- Derived data -------- */
  const categoryLabels = useMemo(() => {
    const labels: Record<string, string> = {};
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

  const categoryList = useMemo(() => {
    const seen = new Set<string>();
    const list: { key: string; label: string }[] = [];
    for (const p of products) {
      const k = p.category || "uncategorized";
      if (!seen.has(k)) {
        seen.add(k);
        list.push({ key: k, label: categoryLabels[k] ?? k });
      }
    }
    return list;
  }, [products, categoryLabels]);

  /* -------- Data fetching -------- */
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([fetchProductsCached(), fetchCategoriesCached()])
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
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* -------- Search suggestions & filtered products -------- */
  const searchSuggestions = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter((p) => {
        const n = p.name?.toLowerCase() ?? "";
        const d = p.description?.toLowerCase() ?? "";
        return n.includes(q) || d.includes(q);
      })
      .slice(0, 8);
  }, [products, searchTerm]);

  /* -------- Keyboard navigation for suggestions -------- */
  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!showSuggestions || searchSuggestions.length === 0) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, searchSuggestions.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        if (activeIndex >= 0 && activeIndex < searchSuggestions.length) {
          e.preventDefault();
          const chosen = searchSuggestions[activeIndex];
          startFiltering(() => setSearchTerm(chosen.name));
          setShowSuggestions(false);
          setActiveIndex(-1);
          inputRef.current?.blur();
        }
      } else if (e.key === "Escape") {
        setShowSuggestions(false);
        setActiveIndex(-1);
      }
    },
    [showSuggestions, searchSuggestions, activeIndex]
  );

  /* -------- Highlight matching substring -------- */
  const highlightMatch = useCallback(
    (text: string, query: string) => {
      if (!query.trim()) return <span>{text}</span>;
      const idx = text.toLowerCase().indexOf(query.trim().toLowerCase());
      if (idx === -1) return <span>{text}</span>;
      return (
        <span>
          {text.slice(0, idx)}
          <mark className="bg-amber-100 text-amber-800 rounded-[2px] px-0.5">
            {text.slice(idx, idx + query.trim().length)}
          </mark>
          {text.slice(idx + query.trim().length)}
        </span>
      );
    },
    []
  );

  const filteredProducts = useMemo(() => {
    let result = products;
    const q = searchTerm.trim().toLowerCase();
    if (q)
      result = result.filter((p) => {
        const n = p.name?.toLowerCase() ?? "";
        const d = p.description?.toLowerCase() ?? "";
        return n.includes(q) || d.includes(q);
      });
    if (selectedCategory !== "all")
      result = result.filter(
        (p) => (p.category || "uncategorized") === selectedCategory
      );
    return result;
  }, [products, searchTerm, selectedCategory]);

  const imageUrl = (p: Product) =>
    p.image && p.image.trim() ? p.image.trim() : null;

  const handleQuickView = useCallback((p: Product) => {
    setQuickViewProduct(p);
  }, []);

  /* ================================================================== */
  /*  Render                                                             */
  /* ================================================================== */
  return (
    <div className="min-h-screen bg-gray-200 pb-20 font-sans text-foreground lg:pb-0">
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
      <div className="border-b border-gray-300/70 bg-gray-100/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center gap-1.5 px-8 md:px-14 lg:px-20 py-3 text-xs text-zinc-400">
          <Link href="/" className="transition-colors hover:text-zinc-600">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="font-medium text-zinc-700">Products</span>
        </div>
      </div>

      {/* ====== Page header ====== */}
      <section className="bg-transparent px-8 md:px-14 lg:px-20 pt-8 pb-0 md:pt-10">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-900 via-teal-950 to-gray-950 px-6 py-10 shadow-xl ring-1 ring-teal-400/10 md:px-10 md:py-12"
          >
            <div className="relative z-10">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-300/80">SSIT Technology</p>
              <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                All Products
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-200/80">
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

      {/* ====== Category filter + Products grid ====== */}
      <section className="min-h-[50vh] bg-transparent px-4 sm:px-8 md:px-14 lg:px-20 pt-6 pb-16">
        <div className="mx-auto max-w-7xl">

          {/* ---- Search + Category filter pills ---- */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              {/* Search */}
              <div ref={searchRef} className="relative w-full sm:w-72 shrink-0">
                <label htmlFor="landing-search" className="sr-only">Search products</label>
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400"
                  aria-hidden
                />
                <input
                  ref={inputRef}
                  id="landing-search"
                  type="text"
                  autoComplete="off"
                  spellCheck={false}
                  value={searchTerm}
                  onChange={(e) => {
                    const v = e.target.value;
                    setActiveIndex(-1);
                    startFiltering(() => setSearchTerm(v));
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => {
                    setTimeout(() => {
                      setShowSuggestions(false);
                      setActiveIndex(-1);
                    }, 150);
                  }}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Search products…"
                  className="w-full rounded-xl border border-zinc-200 bg-white py-2 pl-9 pr-10 text-sm shadow-sm placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200 transition-all"
                />
                {searchTerm.trim().length > 0 && (
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      startFiltering(() => setSearchTerm(""));
                      setShowSuggestions(false);
                      setActiveIndex(-1);
                      inputRef.current?.focus();
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-zinc-400 hover:text-zinc-700 transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}

                <AnimatePresence>
                  {showSuggestions && searchSuggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 right-0 top-full z-30 mt-1.5 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl"
                    >
                      <ul id="products-search-listbox">
                        {searchSuggestions.map((product, idx) => (
                          <li
                            key={product.id}
                            onMouseEnter={() => setActiveIndex(idx)}
                            className={`flex items-center transition-colors ${
                              idx === activeIndex ? "bg-zinc-50" : "hover:bg-zinc-50"
                            } ${idx < searchSuggestions.length - 1 ? "border-b border-zinc-100" : ""}`}
                          >
                            <button
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                startFiltering(() => setSearchTerm(product.name));
                                setShowSuggestions(false);
                                setActiveIndex(-1);
                              }}
                              className="flex min-w-0 flex-1 items-center gap-3 px-3 py-2 text-left"
                            >
                              <div className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-lg border border-zinc-100 bg-zinc-50">
                                {imageUrl(product) ? (
                                  <Image
                                    src={imageUrl(product)!}
                                    alt=""
                                    width={36}
                                    height={36}
                                    className="h-full w-full object-contain p-0.5"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center">
                                    <Package className="h-4 w-4 text-zinc-300" />
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-zinc-800">
                                  {highlightMatch(product.name, searchTerm)}
                                </p>
                                <p className="truncate text-[11px] capitalize text-zinc-400">
                                  {categoryLabels[product.category] ?? product.category}
                                </p>
                              </div>
                            </button>
                            <button
                              type="button"
                              aria-label="Quick view"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                handleQuickView(product);
                                setShowSuggestions(false);
                                setActiveIndex(-1);
                              }}
                              className="mr-3 flex-shrink-0 rounded-lg border border-zinc-200 p-1.5 text-zinc-400 transition-colors hover:border-zinc-400 hover:text-zinc-700"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>
                          </li>
                        ))}
                      </ul>
                      <div className="flex items-center border-t border-zinc-100 px-3 py-1.5">
                        <span className="text-[10px] text-zinc-400">
                          ↑↓ navigate &nbsp;·&nbsp; Enter to select &nbsp;·&nbsp; Esc to close
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Category pills */}
              {!loading && products.length > 0 && (
              <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
                  selectedCategory === "all"
                    ? "bg-zinc-900 text-white shadow-sm"
                    : "border border-zinc-300 bg-white text-zinc-600 hover:border-zinc-500 hover:text-zinc-900"
                }`}
              >
                All
              </button>
              {categoryList.map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition-all duration-200 ${
                    selectedCategory === cat.key
                      ? "bg-zinc-900 text-white shadow-sm"
                      : "border border-zinc-300 bg-white text-zinc-600 hover:border-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
              </div>
              )}
            </div>

          {/* ---- States ---- */}
          {loading ? (
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm"
                >
                  <div className="aspect-square w-full animate-pulse bg-zinc-100" />
                  <div className="flex flex-col gap-2.5 p-4">
                    <div className="h-2.5 w-14 animate-pulse rounded-full bg-zinc-100" />
                    <div className="h-4 w-full animate-pulse rounded bg-zinc-100" />
                    <div className="h-3 w-3/4 animate-pulse rounded bg-zinc-100" />
                    <div className="mt-1 h-3 w-1/2 animate-pulse rounded bg-zinc-100" />
                    <div className="mt-2 flex gap-2">
                      <div className="h-8 flex-1 animate-pulse rounded-lg bg-zinc-100" />
                      <div className="h-8 flex-1 animate-pulse rounded-lg bg-zinc-100" />
                    </div>
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
                isSearching={!!searchTerm.trim()}
              />
              <div className="mt-4 flex justify-center gap-3">
                {searchTerm.trim() && (
                  <button
                    type="button"
                    onClick={() => startFiltering(() => setSearchTerm(""))}
                    className="rounded-lg border border-zinc-300 bg-white px-5 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
                  >
                    Clear search
                  </button>
                )}
                {selectedCategory !== "all" && (
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("all")}
                    className="rounded-lg bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
                  >
                    Show all categories
                  </button>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={`${searchTerm}-${selectedCategory}`}
              initial="hidden"
              animate="visible"
              className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
            >
              {filteredProducts.map((product, i) => (
                <motion.article
                  key={product.id}
                  variants={cardVariants}
                  custom={i}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:border-zinc-200"
                >
                  {/* Image */}
                  <div className="relative aspect-square w-full overflow-hidden bg-zinc-50">
                    {imageUrl(product) ? (
                      <Image
                        src={imageUrl(product)!}
                        alt={product.name}
                        fill
                        className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-2">
                        <Package className="h-12 w-12 text-zinc-200" />
                        <span className="text-[11px] font-medium text-zinc-300">No image</span>
                      </div>
                    )}

                    {/* Stock badges */}
                    <div className="absolute left-2.5 top-2.5 flex flex-col gap-1">
                      {product.stocks === 0 && (
                        <span className="rounded-md bg-red-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                          Sold Out
                        </span>
                      )}
                      {product.stocks > 0 && product.stocks <= 5 && (
                        <span className="rounded-md bg-amber-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                          Low Stock
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="flex flex-1 flex-col p-4">
                    {/* Category label */}
                    <span className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                      {categoryLabels[product.category] ?? product.category}
                    </span>

                    {/* Name */}
                    <h3 className="mb-1.5 line-clamp-2 text-sm font-bold leading-snug text-zinc-900 sm:text-[15px]">
                      {product.name}
                    </h3>

                    {/* Description */}
                    <p className="mb-4 line-clamp-2 flex-1 text-xs leading-relaxed text-zinc-400">
                      {product.description}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleQuickView(product)}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 py-2 text-xs font-semibold text-zinc-600 transition-colors hover:border-zinc-300 hover:bg-zinc-100"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Quick View</span>
                        <span className="sm:hidden">View</span>
                      </button>
                      <Link
                        href="/landing-page/contact"
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-zinc-900 py-2 text-xs font-semibold text-white transition-colors hover:bg-zinc-700"
                      >
                        <ShoppingBag className="h-3.5 w-3.5" />
                        Inquire
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
      <section className="border-y border-gray-300/60 bg-white/60 px-8 backdrop-blur-sm md:px-14 lg:px-20 py-10 md:py-14">
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
              className="flex items-start gap-4 rounded-xl border border-gray-200/70 bg-white p-4 shadow-sm"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                <item.icon className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-800">
                  {item.title}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-zinc-400">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ====== CTA ====== */}
      <section className="bg-zinc-900 px-8 md:px-14 lg:px-20 py-16 md:py-20">
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
