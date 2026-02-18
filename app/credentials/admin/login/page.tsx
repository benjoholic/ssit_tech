"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Check if user already has an active session
    const checkSession = async () => {
      const supabase = createClient();
      try {
        const { data } = await supabase.auth.getSession();
        
        if (typeof window !== "undefined") {
          const params = new URLSearchParams(window.location.search);
          const reason = params.get("reason");
          
          // If there's an active session and we're NOT redirected due to session issues
          if (data.session && !reason) {
            setIsRedirecting(true);
            router.push("/admin/home");
            return;
          }
        }
      } catch {
        // Ignore "Refresh Token Not Found" and other session errors
        // User not logged in, stay on login page
      }
    };
    
    checkSession();
  }, [router]);

  useEffect(() => {
    // Read reason from URL search params directly
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const reason = params.get("reason");
      
      console.log("Admin login page - reason from URL:", reason); // Debug log
      
      if (reason === "session_expired") {
        toast.info("Session Expired", {
          description: "Your session has expired. Please log in again.",
        });
      } else if (reason === "unauthenticated") {
        toast.warning("Please Log In First", {
          description: "You need to sign in to access the admin dashboard.",
        });
      } else if (reason === "unauthorized") {
        toast.error("Access Denied", {
          description: "Your account does not have admin access. Please sign in with an admin account.",
        });
      }
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: usernameOrEmail.trim(),
      password,
    });

    if (signInError || !data.user) {
      setLoading(false);
      toast.error("Invalid credentials", {
        description: signInError?.message ?? "Please check your email and password.",
      });
      return;
    }

    const isAdmin = !!data.user.user_metadata?.is_admin;

    if (!isAdmin) {
      await supabase.auth.signOut();
      setLoading(false);
      toast.error("Invalid credentials", {
        description: "Please check your email and password.",
      });
      return;
    }

    setLoading(false);
    router.push("/admin/home");
    router.refresh();
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-12">
      <style>{`
        .redirecting-loader {
          width: fit-content;
          font-size: 40px;
          font-family: system-ui, sans-serif;
          font-weight: bold;
          text-transform: uppercase;
          color: #0000;
          -webkit-text-stroke: 1px #000;
          background: conic-gradient(#000 0 0) 50%/0 100% no-repeat text;
          animation: redirecting-loader-animation 1.5s linear infinite;
        }
        .redirecting-loader::before {
          content: "Redirecting";
        }
        @keyframes redirecting-loader-animation {
          to { background-size: 120% 100%; }
        }
      `}</style>

      {/* Loading overlay when redirecting */}
      {isRedirecting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 rounded-2xl bg-card p-8 shadow-lg">
            <div className="redirecting-loader"></div>
          </div>
        </div>
      )}

      {/* Subtle background */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,oklch(0.95_0.01_264_/_.4),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,oklch(0.98_0.005_264_/_.5)_100%)]"
        aria-hidden
      />

      <div className="relative w-full max-w-[400px]">
        {/* Back link - top left */}
        {!isRedirecting && (
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        )}

        {!isRedirecting && (
          <div className="rounded-2xl border border-border bg-card/80 p-8 shadow-lg shadow-black/[0.03] backdrop-blur-sm">
          <div className="mb-8">
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary">
              Admin
            </span>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
              Sign in
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Enter your credentials to access the dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="space-y-2">
              <label
                htmlFor="username-or-email"
                className="text-sm font-medium text-foreground"
              >
                Username or email
              </label>
              <input
                id="username-or-email"
                type="text"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="username"
                required
                className="w-full rounded-lg border border-input bg-background px-3.5 py-3 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full rounded-lg border border-input bg-background px-3.5 py-3 pr-11 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="text-right">
                <Link
                  href="/credentials/admin/forgot-password"
                  className="text-sm text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground"
                >
                  Forgot password?
                </Link>
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 active:scale-[0.99] disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>
        )}
      </div>
    </main>
  );
}
