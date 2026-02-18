import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-[var(--foreground)]">
      {/* Page hero */}
      <section className="border-b border-zinc-200/80 bg-white px-6 py-16 md:px-12 lg:px-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-700 shadow-sm backdrop-blur-sm">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            Who we are
          </div>
          <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight text-zinc-800 md:text-5xl">
            About Us
          </h1>
          <p className="text-lg leading-relaxed text-zinc-600">
            Placeholder intro for the about section. Replace with your real copy.
          </p>
        </div>
      </section>

      {/* Story / mission skeleton */}
      <section className="px-6 py-16 md:px-12 lg:px-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-2xl font-semibold text-zinc-800">
            Our story
          </h2>
          <p className="mb-4 text-zinc-600">
            Placeholder paragraph for your company story or mission. Add real content here.
          </p>
          <p className="text-zinc-600">
            Second paragraph placeholder. Expand with history, values, or what drives you.
          </p>
        </div>
      </section>

      {/* Values or highlights placeholder */}
      <section className="border-t border-zinc-200/80 bg-zinc-50/50 px-6 py-16 md:px-12 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-10 text-center text-2xl font-semibold text-zinc-800">
            What we stand for
          </h2>
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <li key={i}>
                <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
                  <div className="mb-3 h-10 w-10 rounded-lg bg-zinc-200" />
                  <h3 className="mb-2 text-lg font-semibold text-zinc-800">
                    Value or highlight {i}
                  </h3>
                  <p className="text-sm text-zinc-600">
                    Short description placeholder. Replace with real copy.
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-zinc-200/80 px-6 py-16 md:px-12 lg:px-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-3 text-2xl font-semibold text-zinc-800">
            Get in touch
          </h2>
          <p className="mb-6 text-zinc-600">
            Have questions or want to work together? We’d love to hear from you.
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
