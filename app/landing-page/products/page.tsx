import Link from "next/link";

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-[var(--foreground)]">
      {/* Page hero */}
      <section className="border-b border-zinc-200/80 bg-white px-6 py-16 md:px-12 lg:px-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-600">
            What we offer
          </p>
          <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight text-zinc-800 md:text-5xl">
            Our Products
          </h1>
          <p className="text-lg leading-relaxed text-zinc-600">
            Placeholder intro for the products section. Replace with your real copy.
          </p>
        </div>
      </section>

      {/* Products grid skeleton */}
      <section className="px-6 py-16 md:px-12 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-zinc-800">Featured</h2>
            {/* Optional: filters or view toggle placeholder */}
          </div>
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <li key={i}>
                <article className="flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md">
                  {/* Image placeholder */}
                  <div className="aspect-[4/3] w-full bg-zinc-100" />
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="mb-2 text-lg font-semibold text-zinc-800">
                      Product name {i}
                    </h3>
                    <p className="mb-4 flex-1 text-sm text-zinc-600">
                      Short product description placeholder. Add real content here.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-zinc-800">—</span>
                      <button
                        type="button"
                        className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700"
                      >
                        Learn more
                      </button>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA or secondary section placeholder */}
      <section className="border-t border-zinc-200/80 bg-zinc-50/50 px-6 py-16 md:px-12 lg:px-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-3 text-2xl font-semibold text-zinc-800">
            Need something else?
          </h2>
          <p className="mb-6 text-zinc-600">
            Optional CTA or secondary products section. Replace or remove as needed.
          </p>
          <Link
            href="/landing-page/contact"
            className="inline-flex rounded-lg border-2 border-zinc-800 bg-transparent px-6 py-3 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-800 hover:text-white"
          >
            Contact us
          </Link>
        </div>
      </section>
    </div>
  );
}
