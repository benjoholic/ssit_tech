export default function AdminHomePage() {
  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-6xl lg:max-w-5xl space-y-6 lg:space-y-4 px-4 py-8 lg:px-3 lg:py-6">
        <section className="space-y-2 lg:space-y-1.5">
          <h1 className="text-3xl lg:text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-sm lg:text-xs text-muted-foreground">
            You are signed in as an administrator. Use this area to manage clients and system
            configuration.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-3 lg:gap-3">
          <div className="rounded-xl border border-border bg-card p-5 lg:p-3 shadow-sm">
            <p className="text-xs lg:text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Overview
            </p>
            <p className="mt-2 lg:mt-1.5 text-sm lg:text-xs text-foreground">
              This is a starting point for your admin tools. You can add cards here for pending
              client applications, credential expirations, and more.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

