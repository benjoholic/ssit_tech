"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function DealerResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [hasRecoverySession, setHasRecoverySession] = useState<boolean | null>(null);

  useEffect(() => {
    // Supabase redirects here with #access_token=...&type=recovery; session is set when client parses the hash
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    const fromRecoveryLink = /type=recovery|access_token=/.test(hash);
    if (fromRecoveryLink) {
      setHasRecoverySession(true);
      return;
    }
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setHasRecoverySession(!!session);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setSuccess(true);
    setTimeout(() => {
      router.push("/credentials/dealer/login");
      router.refresh();
    }, 2000);
  }

  if (hasRecoverySession === null) {
    return (
      <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-12">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading…</span>
        </div>
      </main>
    );
  }

  if (!hasRecoverySession) {
    return (
      <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-12">
        <div className="relative w-full max-w-[400px]">
          <Link
            href="/credentials/dealer/login"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Link>
          <div className="rounded-2xl border border-border bg-card/80 p-8 shadow-lg shadow-black/[0.03] backdrop-blur-sm">
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary">
              Dealer
            </span>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
              Invalid or expired link
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Use the link from your password reset email, or request a new one.
            </p>
            <Link
              href="/credentials/dealer/forgot-password"
              className="mt-6 inline-block text-sm font-medium text-primary underline-offset-2 hover:underline"
            >
              Request new reset link
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-12">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,oklch(0.95_0.01_264_/_.4),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,oklch(0.98_0.005_264_/_.5)_100%)]"
        aria-hidden
      />

      <div className="relative w-full max-w-[400px]">
        <Link
          href="/credentials/dealer/login"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>

        <div className="rounded-2xl border border-border bg-card/80 p-8 shadow-lg shadow-black/[0.03] backdrop-blur-sm">
          <div className="mb-8">
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary">
              Dealer
            </span>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
              Set new password
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Enter your new password below
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && (
              <p className="rounded-lg border border-destructive/50 bg-destructive/10 px-3.5 py-3 text-sm text-destructive">
                {error}
              </p>
            )}
            {success && (
              <p className="rounded-lg border border-green-500/50 bg-green-500/10 px-3.5 py-3 text-sm text-green-700 dark:text-green-400">
                Password updated. Redirecting to sign in…
              </p>
            )}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                New password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                  disabled={success}
                  className="w-full rounded-lg border border-input bg-background px-3.5 py-3 pr-11 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 disabled:opacity-70"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirm-password"
                className="text-sm font-medium text-foreground"
              >
                Confirm new password
              </label>
              <div className="relative">
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                  disabled={success}
                  className="w-full rounded-lg border border-input bg-background px-3.5 py-3 pr-11 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 disabled:opacity-70"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 active:scale-[0.99] disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating…
                </>
              ) : (
                "Update password"
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
