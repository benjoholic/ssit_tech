export default function AdminArchivePage() {
  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-6xl lg:max-w-5xl space-y-6 lg:space-y-4 px-4 py-8 lg:px-3 lg:py-6">
        <section className="space-y-2 lg:space-y-1.5">
          <h1 className="text-3xl lg:text-2xl font-bold tracking-tight">Archive</h1>
          <p className="text-sm lg:text-xs text-muted-foreground">
            View and manage archived items.
          </p>
        </section>

        <section className="rounded-xl border border-border bg-card p-5 lg:p-3 shadow-sm">
          <p className="text-sm lg:text-xs text-muted-foreground">
            Archive content will be displayed here.
          </p>
        </section>
      </div>
    </main>
  );
}
