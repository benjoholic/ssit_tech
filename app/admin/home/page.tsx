export default function AdminHomePage() {
  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        <section className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            You are signed in as an administrator. Use this area to manage clients and system
            configuration.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Overview
            </p>
            <p className="mt-2 text-sm text-foreground">
              This is a starting point for your admin tools. You can add cards here for pending
              client applications, credential expirations, and more.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

