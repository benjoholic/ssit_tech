import Link from "next/link";
import { HeroCarousel } from "@/components/hero-carousel";

export default function Home() {
  return (
    <main className="min-h-screen bg-white font-sans text-zinc-900">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-6 pb-20 pt-16 md:flex-row md:gap-14 md:px-10 md:pt-24 lg:gap-20">
          {/* Copy */}
          <div className="flex max-w-lg flex-1 flex-col">
            <h1 className="text-3xl font-bold leading-[1.15] tracking-tight text-zinc-900 md:text-4xl lg:text-5xl">
              A modern portal for&nbsp;growing client networks
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-zinc-500">
              Centralize applications, credentials, and approvals in one
              place — smooth for clients, full visibility for your team.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <Link
                href="/credentials/client/login"
                className="rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800"
              >
                Get started
              </Link>
              <Link
                href="#features"
                className="rounded-full border border-zinc-200 px-6 py-2.5 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50"
              >
                Learn more
              </Link>
            </div>
          </div>

          {/* Carousel */}
          <div className="flex flex-1 items-center justify-center">
            <HeroCarousel />
          </div>
        </div>

        {/* Subtle divider */}
        <div className="h-px bg-zinc-100" />
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-20 md:px-10">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-semibold tracking-tight text-zinc-900 md:text-3xl">
            Everything you need
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm leading-relaxed text-zinc-500 md:text-base">
            Onboard clients, manage credentials, and stay audit-ready — all
            without spreadsheets or email threads.
          </p>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Guided applications",
                desc: "Collect the right information the first time with clear steps and document uploads.",
              },
              {
                title: "Live credentials",
                desc: "See expirations, missing documents, and approval status at a glance.",
              },
              {
                title: "Custom workflows",
                desc: "Route applications to the right reviewers and capture a full audit trail.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-zinc-100 p-6 transition hover:border-zinc-200 hover:shadow-sm"
              >
                <h3 className="text-sm font-semibold text-zinc-900">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
