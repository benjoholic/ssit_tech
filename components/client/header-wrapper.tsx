"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ClientHeader } from "@/components/client/header";

export function ClientHeaderWrapper() {
  const [userData, setUserData] = useState<{
    email?: string;
    name?: string;
    avatar?: string;
    company?: string;
    phone?: string;
    location?: string;
    emailVerified?: boolean;
  }>({});

  useEffect(() => {
    const supabase = createClient();

    async function loadUserData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Load extended profile from the profiles table (silently ignore if table doesn't exist)
      let profile: { company?: string; phone?: string; location?: string } | null = null;
      try {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("company, phone, location")
          .eq("id", user.id)
          .single();
        profile = profileData;
      } catch {
        // profiles table may not exist yet — ignore
      }

      setUserData({
        email: user.email,
        name: user.user_metadata?.full_name || user.user_metadata?.name,
        avatar: user.user_metadata?.avatar_url,
        company: profile?.company || "",
        phone: profile?.phone || "",
        location: profile?.location || "",
        emailVerified: user.email_confirmed_at !== null,
      });
    }

    loadUserData();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        // Reload profile data on auth change
        loadUserData();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <ClientHeader
      userEmail={userData.email}
      userName={userData.name}
      userAvatar={userData.avatar}
      userCompany={userData.company}
      userPhone={userData.phone}
      userLocation={userData.location}
      emailVerified={userData.emailVerified}
    />
  );
}
