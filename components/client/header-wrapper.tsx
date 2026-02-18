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
    
    // Get initial user data
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserData({
          email: user.email,
          name: user.user_metadata?.full_name || user.user_metadata?.name,
          avatar: user.user_metadata?.avatar_url,
          company: user.user_metadata?.company,
          phone: user.user_metadata?.phone,
          location: user.user_metadata?.location,
          emailVerified: user.email_confirmed_at !== null,
        });
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUserData({
          email: session.user.email,
          name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
          avatar: session.user.user_metadata?.avatar_url,
          company: session.user.user_metadata?.company,
          phone: session.user.user_metadata?.phone,
          location: session.user.user_metadata?.location,
          emailVerified: session.user.email_confirmed_at !== null,
        });
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
