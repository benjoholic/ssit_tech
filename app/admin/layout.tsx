import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/sidebar";
import { SessionMonitor } from "@/components/admin/session-monitor";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  let user = null;

  try {
    const { data } = await supabase.auth.getUser();
    user = data?.user ?? null;
  } catch {
    // Error getting user from auth server
    user = null;
  }

  const isAdmin = !!user?.user_metadata?.is_admin;

  if (!user) {
    redirect("/credentials/admin/login?reason=unauthenticated");
  }

  if (!isAdmin) {
    redirect("/credentials/admin/login?reason=unauthorized");
  }

  return (
    <>
      <SessionMonitor />
      <div className="fixed inset-0 top-14 z-0 flex overflow-hidden bg-muted/30">
        <AdminSidebar />
        <main className="min-h-0 min-w-0 flex-1 overflow-auto px-4 py-8 lg:px-3 lg:py-6">
          <div className="mx-auto max-w-6xl lg:max-w-5xl">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}

