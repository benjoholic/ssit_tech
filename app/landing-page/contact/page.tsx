"use client";

import dynamic from "next/dynamic";

const ClientLocationMap = dynamic(
  () => import("@/components/map/location-map").then((m) => ({ default: m.LocationMap })),
  { ssr: false }
);

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-[var(--foreground)]">
      {/* Page hero */}
      <section className="border-b border-zinc-200/80 bg-white px-6 py-16 md:px-12 lg:px-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-600">
            Get in touch
          </p>
          <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight text-zinc-800 md:text-5xl">
            Contact Us
          </h1>
          <p className="text-lg leading-relaxed text-zinc-600">
            Placeholder intro for the contact section. Replace with your real copy.
          </p>
        </div>
      </section>

      {/* Contact form + info skeleton */}
      <section className="px-6 py-16 md:px-12 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
            {/* Contact info placeholder */}
            <div className="lg:col-span-2">
              <h2 className="mb-6 text-2xl font-semibold text-zinc-800">
                Contact info
              </h2>
              <ul className="space-y-6">
                <li>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Email
                  </p>
                  <p className="text-zinc-600">benjfrancis2@gmail.com</p>
                </li>
                <li>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Phone
                  </p>
                  <p className="text-zinc-600">+63 927 685 7896</p>
                </li>
                <li>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Address
                  </p>
                  <p className="text-zinc-600">
                    Instruccion Street, Sampaloc Manila
                  </p>
                </li>
              </ul>
            </div>

            {/* Form skeleton */}
            <div className="lg:col-span-3">
              <h2 className="mb-6 text-2xl font-semibold text-zinc-800">
                Send a message
              </h2>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label
                    htmlFor="contact-name"
                    className="mb-2 block text-sm font-medium text-zinc-800"
                  >
                    Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    placeholder="Your name"
                    className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-800 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-email"
                    className="mb-2 block text-sm font-medium text-zinc-800"
                  >
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-800 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-message"
                    className="mb-2 block text-sm font-medium text-zinc-800"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    placeholder="Your message..."
                    className="w-full resize-y rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-800 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-lg bg-zinc-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700"
                >
                  Send message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map - infrastructure location */}
      <section className="border-t border-zinc-200/80 bg-zinc-50/50 px-6 py-16 md:px-12 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-6 text-2xl font-semibold text-zinc-800">
            Find us
          </h2>
          <ClientLocationMap
            longitude={120.9952}
            latitude={14.6157}
            className="w-full"
          />
          <p className="mt-3 text-sm text-zinc-500">
            Update the coordinates in this page or in the LocationMap component to match your infrastructure address.
          </p>
        </div>
      </section>
    </div>
  );
}
