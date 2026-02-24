import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SettingsContent from "./settings-client";

export default async function ClientSettingsPage() {
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

  const email = user.email ?? "";
  const fullName = user.user_metadata?.full_name ?? "";
  const provider =
    user.app_metadata?.provider ?? user.app_metadata?.providers?.[0] ?? "email";
  const createdAt = user.created_at ?? "";

  return (
    <SettingsContent
      email={email}
      fullName={fullName}
      provider={provider}
      createdAt={createdAt}
    />
  );
}
