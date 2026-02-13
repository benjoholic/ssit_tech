import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ClientProfilePage from "./profile-page-client";

export default async function ClientProfilePageRoute() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/unauthenticated");
  }

  const user = session.user;
  const meta = user.user_metadata || {};

  const fullName = (meta.full_name as string | undefined) || "";
  const avatarUrl = (meta.avatar_url as string | undefined) || "";
  const company = (meta.company as string | undefined) || "";
  const phone = (meta.phone as string | undefined) || "";
  const location = (meta.location as string | undefined) || "";
  const website = (meta.website as string | undefined) || "";
  const bio = (meta.bio as string | undefined) || "";

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
        company,
        phone,
        location,
        website,
        bio,
      }}
    />
  );
}
