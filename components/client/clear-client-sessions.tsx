"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ClearClientSessions({ enabled }: { enabled?: boolean }) {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shouldKill =
      enabled || params.get("kill_sessions") === "1" || params.get("clear_sessions") === "1";
    if (!shouldKill) return;

    let cancelled = false;

    async function run() {
      const supabase = createClient();

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          // Revoke all sessions for the current user (global sign-out)
          try {
            await supabase.auth.signOut({ scope: "global" });
          } catch (e) {
            // ignore errors, we'll still attempt to clear cookies
          }
        }

        // Also call server endpoint to clear any Supabase cookies
        try {
          await fetch("/api/clear-cookies");
        } catch (e) {
          // ignore
        }

        // Remove the query params and reload to avoid repeated runs
        params.delete("kill_sessions");
        params.delete("clear_sessions");
        const newQuery = params.toString();
        const url = window.location.pathname + (newQuery ? `?${newQuery}` : "");
        if (!cancelled) window.location.replace(url);
      } catch (err) {
        // If anything goes wrong, still attempt to clear cookies server-side
        try {
          await fetch("/api/clear-cookies");
        } catch {}
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return null;
}
