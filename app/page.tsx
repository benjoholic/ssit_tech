import Link from "next/link";

function IsometricHeroIllustration() {
  return (
    <div className="relative h-full min-h-[420px] w-full max-w-[520px]" aria-hidden>
      <svg
        viewBox="0 0 400 320"
        className="h-full w-full object-contain drop-shadow-lg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Wavy ground / platform */}
        <path
          d="M50 280 Q120 260 200 270 Q280 260 350 280 L350 320 L50 320 Z"
          fill="#f5f0e8"
          opacity={0.95}
        />
        {/* Back monitor */}
        <g transform="translate(180, 80) rotate(-2)">
          <path
            d="M0 0 L70 0 L70 50 L0 50 Z"
            fill="#a8d4e6"
            stroke="#7eb8cc"
            strokeWidth="2"
          />
          <path d="M10 8 L60 8 L60 42 L10 42 Z" fill="#fff" opacity={0.9} />
          <line x1="15" y1="18" x2="55" y2="18" stroke="#c4e0ec" strokeWidth="1.5" />
          <line x1="15" y1="26" x2="45" y2="26" stroke="#c4e0ec" strokeWidth="1.5" />
          <line x1="15" y1="34" x2="50" y2="34" stroke="#c4e0ec" strokeWidth="1.5" />
          <rect x="30" y="50" width="10" height="15" fill="#8bc4d9" />
        </g>
        {/* Front monitor */}
        <g transform="translate(120, 100) rotate(4)">
          <path
            d="M0 0 L90 0 L90 60 L0 60 Z"
            fill="#a8d4e6"
            stroke="#7eb8cc"
            strokeWidth="2"
          />
          <path d="M8 8 L82 8 L82 52 L8 52 Z" fill="#fff" opacity={0.9} />
          <line x1="18" y1="20" x2="72" y2="20" stroke="#c4e0ec" strokeWidth="1.5" />
          <line x1="18" y1="30" x2="65" y2="30" stroke="#c4e0ec" strokeWidth="1.5" />
          <line x1="18" y1="40" x2="55" y2="40" stroke="#c4e0ec" strokeWidth="1.5" />
          <rect x="38" y="60" width="14" height="18" fill="#8bc4d9" />
        </g>
        {/* Hexagonal pillars */}
        <ellipse cx="280" cy="255" rx="18" ry="6" fill="#a8d4e6" opacity={0.8} />
        <path
          d="M262 255 L268 235 L280 228 L292 235 L298 255 L292 275 L280 282 L268 275 Z"
          fill="#b8dce8"
          stroke="#8bc4d9"
          strokeWidth="1"
        />
        <ellipse cx="320" cy="268" rx="14" ry="5" fill="#a8d4e6" opacity={0.7} />
        <path
          d="M306 268 L311 253 L320 249 L329 253 L334 268 L329 283 L320 287 L311 283 Z"
          fill="#b8dce8"
          stroke="#8bc4d9"
          strokeWidth="1"
        />
        {/* Open book (vertical) */}
        <g transform="translate(255, 95)">
          <path d="M0 0 L22 0 L22 55 L0 55 Z" fill="#a8d4e6" stroke="#8bc4d9" strokeWidth="1" />
          <path d="M2 4 L20 4 L20 51 L2 51 Z" fill="#fff" opacity={0.9} />
          <line x1="6" y1="12" x2="16" y2="12" stroke="#e8c4c4" strokeWidth="1" />
          <line x1="6" y1="20" x2="14" y2="20" stroke="#e8c4c4" strokeWidth="1" />
          <rect x="20" y="0" width="4" height="55" fill="#d94a4a" />
        </g>
        {/* Person standing with paper */}
        <g transform="translate(200, 155)">
          <ellipse cx="12" cy="8" rx="8" ry="6" fill="#e8a8b8" />
          <path d="M8 18 L16 18 L16 55 L8 55 Z" fill="#2a4a6a" />
          <path d="M16 28 L24 28 L28 45 L20 48 L16 38 Z" fill="#e8a8b8" />
          <path d="M22 32 L30 30 L30 38 L24 40 Z" fill="#fff" opacity={0.9} stroke="#e0e0e0" strokeWidth="0.5" />
        </g>
        {/* Person on stool reading */}
        <g transform="translate(100, 195)">
          <ellipse cx="14" cy="10" rx="9" ry="7" fill="#90c090" />
          <path d="M6 22 L22 22 L22 58 L6 58 Z" fill="#8b6914" />
          <path d="M2 58 L26 58 L28 62 L0 62 Z" fill="#a8d4e6" />
          <path d="M18 35 L28 32 L28 50 L20 52 Z" fill="#fff" opacity={0.95} />
          <line x1="20" y1="38" x2="26" y2="37" stroke="#e0e0e0" strokeWidth="0.8" />
        </g>
        {/* Person on stool, arm raised */}
        <g transform="translate(305, 175)">
          <ellipse cx="12" cy="8" rx="8" ry="6" fill="#fff" stroke="#ccc" strokeWidth="1" />
          <path d="M6 18 L18 18 L18 52 L6 52 Z" fill="#2a4a6a" />
          <path d="M18 22 L26 12 L26 22 L18 28 Z" fill="#e0e0e0" />
          <path d="M0 52 L24 52 L26 56 L-2 56 Z" fill="#a8d4e6" />
        </g>
        {/* Person sitting with book */}
        <g transform="translate(70, 230)">
          <ellipse cx="14" cy="10" rx="9" ry="7" fill="#e8a8b8" />
          <path d="M5 22 L23 22 L23 55 L5 55 Z" fill="#c4a070" />
          <path d="M28 35 L42 32 L42 52 L30 55 Z" fill="#a8d4e6" />
          <path d="M30 38 L40 36 L40 50 L32 52 Z" fill="#fff" opacity={0.9} />
          <line x1="32" y1="42" x2="38" y2="41" stroke="#e0e0e0" strokeWidth="0.8" />
        </g>
        {/* Notebook with pencil */}
        <g transform="translate(75, 255)">
          <path d="M0 0 L35 0 L35 25 L0 25 Z" fill="#fff" stroke="#e8a8b8" strokeWidth="2" />
          <line x1="5" y1="8" x2="30" y2="8" stroke="#e8e8e8" strokeWidth="0.8" />
          <line x1="5" y1="14" x2="28" y2="14" stroke="#e8e8e8" strokeWidth="0.8" />
          <path d="M38 5 L42 5 L42 22 L38 22 Z" fill="#60a060" transform="rotate(-15 40 13.5)" />
        </g>
        {/* Magnifying glass */}
        <g transform="translate(165, 248)">
          <circle cx="18" cy="18" r="14" fill="none" stroke="#a8d4e6" strokeWidth="4" />
          <line x1="28" y1="28" x2="38" y2="38" stroke="#8bc4d9" strokeWidth="3" strokeLinecap="round" />
        </g>
        {/* Paper airplanes */}
        <g transform="translate(240, 45) rotate(-25)">
          <path d="M0 0 L20 0 L28 8 L20 6 L28 14 L14 8 L20 6 L14 4 Z" fill="#fff" opacity={0.95} stroke="#e8e8e8" strokeWidth="0.5" />
        </g>
        <g transform="translate(300, 70) rotate(15)">
          <path d="M0 0 L18 0 L24 6 L18 5 L24 12 L12 6 L18 5 L12 3 Z" fill="#fff" opacity={0.9} stroke="#e8e8e8" strokeWidth="0.5" />
        </g>
      </svg>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-50 via-white to-zinc-100 font-sans text-[var(--foreground)]">
      {/* Hero */}
      <section
        className="relative flex min-h-[calc(100vh-65px)] flex-col items-center justify-center gap-12 overflow-hidden px-6 py-16 md:flex-row md:gap-16 md:px-12 lg:px-20"
      >
        <div className="flex max-w-xl flex-1 flex-col justify-center text-zinc-900">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Dealer onboarding, simplified
          </p>
          <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
            A modern portal for growing dealer networks
          </h1>
          <p className="mb-6 max-w-md text-lg leading-relaxed text-zinc-600">
            Centralize applications, credentials, and approvals in one place. Give your dealers a
            smooth experience while your team gets complete visibility and control.
          </p>
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <Link
              href="/credentials/dealer/login"
              className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-zinc-900/10 transition hover:bg-zinc-800"
            >
              Apply as Dealer
            </Link>
            <Link
              href="#learn-more"
              className="inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-white/80 px-6 py-3.5 text-base font-semibold text-zinc-800 shadow-sm transition hover:border-zinc-400 hover:bg-white"
            >
              Learn more
            </Link>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-zinc-500">
            <div>
              <p className="font-semibold text-zinc-700">Faster onboarding</p>
              <p>Reduce manual review with structured, digital workflows.</p>
            </div>
            <div>
              <p className="font-semibold text-zinc-700">Compliance built‑in</p>
              <p>Track documents, expirations, and approvals in real time.</p>
            </div>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <IsometricHeroIllustration />
        </div>
      </section>

      {/* Features */}
      <section
        id="learn-more"
        className="border-t border-zinc-100 bg-white/70 px-6 py-14 backdrop-blur-sm md:px-12 lg:px-20"
      >
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 md:text-3xl">
                Built for dealer operations teams
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-zinc-600 md:text-base">
                Everything you need to bring new dealers onboard, keep credentials up to date, and
                stay audit‑ready without drowning in spreadsheets and email threads.
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm shadow-zinc-900/5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                01 · Applications
              </p>
              <h3 className="mt-3 text-base font-semibold text-zinc-900">
                Guided dealer applications
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                Collect the right information the first time with clear steps, progress indicators,
                and required document uploads.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm shadow-zinc-900/5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                02 · Credentials
              </p>
              <h3 className="mt-3 text-base font-semibold text-zinc-900">
                Live credential dashboard
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                See expirations, missing documents, and approval status at a glance so you can act
                before there&apos;s an issue.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm shadow-zinc-900/5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                03 · Workflows
              </p>
              <h3 className="mt-3 text-base font-semibold text-zinc-900">
                Configurable review flows
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                Route applications to the right reviewers, capture decisions, and create a full
                audit trail automatically.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
