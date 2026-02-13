import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  let session: Awaited<ReturnType<typeof supabase.auth.getSession>>["data"]["session"] = null;

  try {
    const { data } = await supabase.auth.getSession();
    session = data?.session ?? null;
  } catch {
    // Corrupted or truncated session in cookies (e.g. "Cannot create property 'user' on string")
    session = null;
  }

  const isAdmin = !!session?.user?.user_metadata?.is_admin;

  if (!session || !isAdmin) {
    redirect("/unauthenticated");
  }

  return (
    <div className="fixed inset-0 top-14 z-0 flex overflow-hidden bg-muted/30">
      <AdminSidebar />
      <main className="min-h-0 min-w-0 flex-1 overflow-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}

