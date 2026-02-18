import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ClientSidebar } from "@/components/client/sidebar";

export default async function ClientLayout({
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

  if (!user) {
    redirect("/unauthenticated");
  }

  const isAdmin = !!session?.user?.user_metadata?.is_admin;

  if (isAdmin) {
    redirect("/unauthenticated");
  }

  return (
    <div className="fixed inset-0 top-14 z-0 flex overflow-hidden">
      <ClientSidebar />
      <div className="min-h-0 min-w-0 flex-1 overflow-auto">{children}</div>
    </div>
  );
}
