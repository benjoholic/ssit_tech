"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const SESSION_TIMEOUT_MS = 5 * 60 * 60 * 1000; // 5 hours in milliseconds

export function SessionMonitor() {
  const router = useRouter();
  const supabase = createClient();
  const [showSessionExpired, setShowSessionExpired] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);

  useEffect(() => {
    // Check if there's an existing valid session
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session) {
          // Session exists - start monitoring
          const now = Date.now();
          setSessionStartTime(now);
          
          // Set timeout for 5 hours
          const timer = setTimeout(() => {
            setShowSessionExpired(true);
          }, SESSION_TIMEOUT_MS);

          return () => clearTimeout(timer);
        }
      } catch (error) {
        // Silently ignore "Refresh Token Not Found" and other session errors
        // These are expected when no valid session exists (e.g., on initial load)
        if (error instanceof Error && !error.message.includes("refresh_token_not_found")) {
          console.error("Error checking session:", error);
        }
      }
    };

    checkSession();

    // Also listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        // Session ended, redirect to login
        router.push("/credentials/admin/login?reason=session_expired");
      } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        // New session or token refreshed
        const now = Date.now();
        setSessionStartTime(now);
        setShowSessionExpired(false);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [router, supabase]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/credentials/admin/login?reason=session_expired");
    } catch (error) {
      console.error("Error signing out:", error);
      // Force redirect even if logout fails
      router.push("/credentials/admin/login?reason=session_expired");
    }
  };

  return (
    <Dialog open={showSessionExpired} onOpenChange={setShowSessionExpired}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Session Expired</DialogTitle>
          <DialogDescription>
            Your session has expired due to inactivity. Please log in again to continue.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3">
          <Button
            variant="default"
            onClick={handleLogout}
          >
            Log In Again
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
