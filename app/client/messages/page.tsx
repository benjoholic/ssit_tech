import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { MessageSquare } from "lucide-react";

export default async function ClientMessagesPage() {
  const supabase = await createClient();

  try {
    const { data } = await supabase.auth.getUser();
    if (!data?.user) redirect("/unauthenticated");
  } catch {
    redirect("/unauthenticated");
  }

  return (
    <main className="flex min-h-full flex-col items-center justify-center bg-muted/30 px-4 py-16">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <MessageSquare className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          Direct messaging is coming soon. You&apos;ll be able to communicate
          with the SSIT Tech team right here.
        </p>
        <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          Coming Soon
        </span>
      </div>
    </main>
  );
}
