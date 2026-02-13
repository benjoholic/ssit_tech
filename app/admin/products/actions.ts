"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import type { Product, ProductCategory } from "@/lib/products";

const TABLE = "products";

type Row = {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stocks: number;
  image: string;
};

function rowToProduct(r: Row): Product {
  const category = r.category as ProductCategory;
  return {
    id: r.id,
    name: r.name ?? "",
    description: r.description ?? "",
    category: category === "cctv" || category === "access_point" || category === "switch" ? category : "cctv",
    price: Number(r.price) >= 0 ? Number(r.price) : 0,
    stocks: Number.isInteger(r.stocks) && r.stocks >= 0 ? r.stocks : 0,
    image: r.image ?? "",
  };
}

export async function getProductsAction(): Promise<{ data: Product[]; error: string | null }> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from(TABLE)
      .select("id, name, description, category, price, stocks, image")
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
      })
      .select("id, name, description, category, price, stocks, image")
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
