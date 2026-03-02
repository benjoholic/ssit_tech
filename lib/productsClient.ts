import type { Product, CategoryEntry } from "./products";
import { getProductsAction, getCategoriesAction } from "@/app/admin/products/actions";

type Result<T> = { data: T; error: string | null };

const DEFAULT_TTL = 60_000; // 60s

declare global {
  interface Window {
    __ssit_products_cache?: {
      products?: Result<Product[]> | Promise<Result<Product[]>>;
      categories?: Result<CategoryEntry[]> | Promise<Result<CategoryEntry[]>>;
      ts?: number;
    };
  }
}

function now() {
  return Date.now();
}

export function clearProductsCache() {
  if (typeof window === "undefined") return;
  window.__ssit_products_cache = undefined;
}

export async function fetchProductsCached(ttl = DEFAULT_TTL): Promise<Result<Product[]>> {
  if (typeof window === "undefined") {
    return getProductsAction();
  }

  const cache = window.__ssit_products_cache ??= { ts: 0 };
  const valid = cache.ts && now() - cache.ts < ttl;

  // If we have a resolved result, return it
  if (valid && cache.products && !(cache.products instanceof Promise)) {
    return cache.products as Result<Product[]>;
  }

  // If an in-flight promise exists, return that
  if (cache.products instanceof Promise) return cache.products as Promise<Result<Product[]>>;

  // Otherwise start a fetch and store the promise
  const p = getProductsAction()
    .then((res) => {
      cache.products = res;
      cache.ts = now();
      return res;
    })
    .catch((err) => {
      const res: Result<Product[]> = { data: [], error: err instanceof Error ? err.message : String(err) };
      cache.products = res;
      cache.ts = now();
      return res;
    });

  cache.products = p;
  return p;
}

export async function fetchCategoriesCached(ttl = DEFAULT_TTL): Promise<Result<CategoryEntry[]>> {
  if (typeof window === "undefined") {
    return getCategoriesAction();
  }

  const cache = window.__ssit_products_cache ??= { ts: 0 };
  const valid = cache.ts && now() - cache.ts < ttl;

  if (valid && cache.categories && !(cache.categories instanceof Promise)) {
    return cache.categories as Result<CategoryEntry[]>;
  }

  if (cache.categories instanceof Promise) return cache.categories as Promise<Result<CategoryEntry[]>>;

  const p = getCategoriesAction()
    .then((res) => {
      cache.categories = res;
      cache.ts = now();
      return res;
    })
    .catch((err) => {
      const res: Result<CategoryEntry[]> = { data: [], error: err instanceof Error ? err.message : String(err) };
      cache.categories = res;
      cache.ts = now();
      return res;
    });

  cache.categories = p;
  return p;
}
