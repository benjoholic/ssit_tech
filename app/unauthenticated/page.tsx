import Link from "next/link";
import { ShieldAlert, ArrowRight } from "lucide-react";

export default function UnauthenticatedPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-[420px] rounded-2xl border border-border bg-card p-8 text-center shadow-lg">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <h1 className="mt-6 text-xl font-semibold tracking-tight text-foreground">
          Sign in required
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You need to be signed in to access this page. Please log in with your
          client account to continue.
        </p>
        <Link
          href="/credentials/client/login"
          className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          Go to sign in
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/"
          className="mt-3 inline-block text-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
