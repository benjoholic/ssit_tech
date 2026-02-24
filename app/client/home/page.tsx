import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  getProductsAction,
  getCategoriesAction,
} from "@/app/admin/products/actions";
import ClientDashboard from "./dashboard-client";

export default async function ClientHomePage() {
  const supabase = await createClient();
  let user = null;

  try {
    const { data } = await supabase.auth.getUser();
    user = data?.user ?? null;
  } catch {
    user = null;
  }

  if (!user) {
    redirect("/unauthenticated");
  }

  const [prodRes, catRes] = await Promise.all([
    getProductsAction(),
    getCategoriesAction(),
  ]);

  const products = prodRes.data ?? [];
  const categories = catRes.data ?? [];

  const email = user.email ?? "";
  const fullName = user.user_metadata?.full_name ?? "";
  const avatarUrl = user.user_metadata?.avatar_url ?? "";
  const emailVerified = !!user.email_confirmed_at;
  const createdAt = user.created_at ?? "";

  return (
    <ClientDashboard
      products={products}
      categories={categories}
      email={email}
      fullName={fullName}
      avatarUrl={avatarUrl}
      emailVerified={emailVerified}
      createdAt={createdAt}
    />
  );
}
