"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Package,
  Tag,
  Loader2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  getProductsAction,
  getCategoriesAction,
} from "@/app/admin/products/actions";
import type { Product, CategoryEntry } from "@/lib/products";
import { CATEGORY_LABELS } from "@/lib/products";

const PREVIEW_COUNT = 8;

export function ProductsShowcase() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    Promise.all([
      getProductsAction(),
      getCategoriesAction(),
      createClient().auth.getUser(),
    ])
      .then(([prodRes, catRes, { data }]) => {
        setProducts(prodRes.data);
        setCategories(catRes.data ?? []);
        if (data.user) {
          setIsLoggedIn(true);
          setIsAdmin(!!data.user.user_metadata?.is_admin);
        }
        setLoading(false);
      })
      .catch((err) => {
        // If fetching fails (e.g. missing env keys or server error), stop the loading state
        // and keep products empty so the UI shows the empty state instead of an infinite loader.
        // eslint-disable-next-line no-console
        console.error("ProductsShowcase fetch error:", err);
        setProducts([]);
        setCategories([]);
        setLoading(false);
      });
  }, []);

  function getCategoryLabel(slug: string) {
    const entry = categories.find((c) => c.name === slug);
    if (entry) return entry.label;
    return CATEGORY_LABELS[slug] ?? slug.replace(/_/g, " ");
  }

  function handleSeeMore() {
    if (!isLoggedIn) {
      router.push("/credentials/client/signup");
    } else if (isAdmin) {
      router.push("/admin/products");
    } else {
      router.push("/client/products");
    }
  }

  const visible = products.slice(0, PREVIEW_COUNT);
  const hasMore = products.length > PREVIEW_COUNT;

  return (
    <section className="bg-white px-6 py-16 md:px-10 md:py-24">
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <div className="mb-12 flex flex-col items-center text-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-zinc-500">
            <Package className="h-3.5 w-3.5" />
            Our Products
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 md:text-5xl">
            Everything you need
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-zinc-500 md:text-lg">
            From telephone systems to enterprise networking — explore our full
            range of premium tech solutions.
          </p>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: PREVIEW_COUNT }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl border border-zinc-100 bg-zinc-100 h-72"
              />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-zinc-400">
            <Package className="h-10 w-10" />
            <p className="text-sm">No products available yet.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {visible.map((product) => {
              const img = product.image?.trim() || null;
              const categoryLabel = getCategoryLabel(product.category);
              return (
                <div
                  key={product.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all hover:border-zinc-300 hover:shadow-lg"
                >
                  {/* Image */}
                  <div className="relative h-48 w-full overflow-hidden bg-zinc-50">
                    {img ? (
                      <Image
                        src={img}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Package className="h-12 w-12 text-zinc-300" />
                      </div>
                    )}
                    {/* Category badge */}
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-zinc-700 shadow-sm backdrop-blur-sm">
                      <Tag className="h-3 w-3" />
                      {categoryLabel}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <h3 className="text-sm font-bold leading-snug text-zinc-900 line-clamp-2 group-hover:text-zinc-700 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs leading-relaxed text-zinc-500 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <span className="text-base font-bold text-zinc-900">
                        ₱{product.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </span>
                      <span
                        className={`text-xs font-medium ${
                          product.stocks > 0
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        {product.stocks > 0 ? `${product.stocks} in stock` : "Out of stock"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* See More */}
        {(hasMore || (!loading && products.length > 0)) && (
          <div className="mt-12 flex flex-col items-center gap-3">
            {hasMore && (
              <p className="text-sm text-zinc-400">
                Showing {PREVIEW_COUNT} of {products.length} products
              </p>
            )}
            <button
              type="button"
              onClick={handleSeeMore}
              className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-8 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-zinc-700 hover:shadow-lg active:scale-[0.98]"
            >
              {isLoggedIn ? "View All Products" : "Sign Up to See All Products"}
              <ArrowRight className="h-4 w-4" />
            </button>
            {!isLoggedIn && (
              <p className="text-xs text-zinc-400">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/credentials/client/login")}
                  className="font-medium text-zinc-600 underline underline-offset-2 hover:text-zinc-900"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
