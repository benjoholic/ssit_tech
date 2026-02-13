import { Skeleton } from "@/components/ui/skeleton";
import ClientSettingsStatusPage from "./status/page";

export default function ClientSettingsPage() {
  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
        {/* Header skeleton */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Stats / cards row */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>

        {/* Main content area */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-64 rounded-xl" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Skeleton className="h-40 rounded-xl" />
              <Skeleton className="h-40 rounded-xl" />
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-80 rounded-xl" />
            <Skeleton className="h-24 rounded-lg" />
          </div>
        </div>

        {/* Status section */}
        <div className="rounded-xl border border-border bg-card p-6">
          <ClientSettingsStatusPage />
        </div>
      </div>
    </main>
  );
}
