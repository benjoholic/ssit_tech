"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import type { Product, ProductCategory, CategoryEntry } from "@/lib/products";

const TABLE = "products";

type Row = {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stocks: number;
  image: string;
  barcode: string;
};

function rowToProduct(r: Row): Product {
  const category = (r.category ?? "cctv") as ProductCategory;
  return {
    id: r.id,
    name: r.name ?? "",
    description: r.description ?? "",
    category,
    price: Number(r.price) >= 0 ? Number(r.price) : 0,
    stocks: Number.isInteger(r.stocks) && r.stocks >= 0 ? r.stocks : 0,
    image: r.image ?? "",
    barcode: r.barcode ?? "",
  };
}

export async function getProductsAction(): Promise<{ data: Product[]; error: string | null }> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from(TABLE)
      .select("id, name, description, category, price, stocks, image, barcode")
      .order("created_at", { ascending: true });

    if (error) {
      return { data: [], error: error.message };
    }
    const list = (data ?? []) as Row[];
    return { data: list.map(rowToProduct), error: null };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to fetch products";
    return { data: [], error: message };
  }
}

export async function addProductAction(product: Omit<Product, "id">): Promise<{ data: Product | null; error: string | null }> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from(TABLE)
      .insert({
        name: product.name,
        description: product.description,
        category: product.category,
        price: product.price,
        stocks: product.stocks,
        image: product.image,
        barcode: product.barcode,
      })
      .select("id, name, description, category, price, stocks, image, barcode")
      .single();

    if (error) {
      return { data: null, error: error.message };
    }
    return { data: rowToProduct(data as Row), error: null };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to add product";
    return { data: null, error: message };
  }
}

export async function updateProductAction(product: Product): Promise<{ error: string | null }> {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from(TABLE)
      .update({
        name: product.name,
        description: product.description,
        category: product.category,
        price: product.price,
        stocks: product.stocks,
        image: product.image,
        barcode: product.barcode,
      })
      .eq("id", product.id);

    return { error: error?.message ?? null };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to update product";
    return { error: message };
  }
}

export async function deleteProductAction(id: string): Promise<{ error: string | null }> {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from(TABLE).delete().eq("id", id);
    return { error: error?.message ?? null };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to delete product";
    return { error: message };
  }
}

// ─── Product Category Actions ─────────────────────────────────────────────────

const CATEGORIES_TABLE = "product_categories";

export async function getCategoriesAction(): Promise<{
  data: CategoryEntry[];
  error: string | null;
}> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from(CATEGORIES_TABLE)
      .select("id, name, label")
      .order("created_at", { ascending: true });

    if (error) return { data: [], error: error.message };
    return { data: (data ?? []) as CategoryEntry[], error: null };
  } catch (e) {
    return { data: [], error: e instanceof Error ? e.message : "Failed to fetch categories" };
  }
}

export async function addCategoryAction(
  name: string,
  label: string
): Promise<{ data: CategoryEntry | null; error: string | null }> {
  const slug = name.trim().toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
  const displayLabel = label.trim();
  if (!slug || !displayLabel) return { data: null, error: "Name and label are required." };

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from(CATEGORIES_TABLE)
      .insert({ name: slug, label: displayLabel })
      .select("id, name, label")
      .single();

    if (error) {
      if (error.code === "23505") return { data: null, error: "A category with that name already exists." };
      return { data: null, error: error.message };
    }
    return { data: data as CategoryEntry, error: null };
  } catch (e) {
    return { data: null, error: e instanceof Error ? e.message : "Failed to add category" };
  }
}

export async function updateCategoryAction(
  name: string,
  newLabel: string
): Promise<{ error: string | null }> {
  const label = newLabel.trim();
  if (!label) return { error: "Label cannot be empty." };
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from(CATEGORIES_TABLE)
      .update({ label })
      .eq("name", name);
    return { error: error?.message ?? null };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to update category" };
  }
}

export async function deleteCategoryAction(
  name: string
): Promise<{ error: string | null }> {
  try {
    const supabase = createAdminClient();

    // Guard: reject if products still use this category
    const { count } = await supabase
      .from(TABLE)
      .select("id", { count: "exact", head: true })
      .eq("category", name);

    if ((count ?? 0) > 0) {
      return { error: `Cannot delete: ${count} product(s) still use this category.` };
    }

    const { error } = await supabase.from(CATEGORIES_TABLE).delete().eq("name", name);
    return { error: error?.message ?? null };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to delete category" };
  }
}
