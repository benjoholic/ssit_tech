import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ClientProfilePage from "./profile-page-client";

export default async function ClientProfilePageRoute() {
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

  const meta = user.user_metadata || {};
  const fullName = (meta.full_name as string | undefined) || "";
  const avatarUrl = (meta.avatar_url as string | undefined) || "";

  // Load extended profile from the profiles table (silently ignore if table doesn't exist yet)
  let profile: {
    company?: string;
    phone?: string;
    location?: string;
    website?: string;
    bio?: string;
  } | null = null;
  try {
    const { data } = await supabase
      .from("profiles")
      .select("company, phone, location, website, bio")
      .eq("id", user.id)
      .single();
    profile = data;
  } catch {
    // profiles table may not exist yet — treat as empty
  }

  return (
    <ClientProfilePage
      userId={user.id}
      email={user.email || ""}
      emailVerified={user.email_confirmed_at !== null}
      createdAt={user.created_at || ""}
      provider={(user.app_metadata?.provider as string | undefined) || "email"}
      initialProfile={{
        fullName,
        avatarUrl,
        company: profile?.company || "",
        phone: profile?.phone || "",
        location: profile?.location || "",
        website: profile?.website || "",
        bio: profile?.bio || "",
      }}
    />
  );
}
