"use client";

import dynamic from "next/dynamic";
import { Mail, Phone, MapPin, Send } from "lucide-react";

const ClientLocationMap = dynamic(
  () => import("@/components/map/location-map").then((m) => ({ default: m.LocationMap })),
  { ssr: false }
);

export default function ContactPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-50 font-sans text-[var(--foreground)]">
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-gradient-to-br from-blue-100/40 to-purple-100/40 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-gradient-to-tr from-orange-100/40 to-pink-100/40 blur-3xl" />
      </div>

      {/* Page hero */}
      <section className="relative border-b border-zinc-200/50 bg-gradient-to-br from-white via-zinc-50/50 to-white px-4 py-10 backdrop-blur-sm md:px-12 md:py-16 lg:px-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-700 shadow-sm backdrop-blur-sm">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            Get in touch
          </div>
          <h1 className="mb-4 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-700 bg-clip-text text-4xl font-bold leading-tight tracking-tight text-transparent md:text-5xl lg:text-6xl">
            Contact Us
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-zinc-600">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact form + info skeleton */}
      <section className="relative px-4 py-12 md:px-12 md:py-20 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-5 lg:gap-12">
            {/* Contact info placeholder */}
            <div className="lg:col-span-2">
              <div className="group relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-gradient-to-br from-white to-zinc-50/50 p-5 shadow-lg shadow-zinc-200/50 transition-all duration-300 hover:shadow-xl hover:shadow-zinc-300/50 md:p-8">
                <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-2xl transition-transform duration-500 group-hover:scale-150" />
                <div className="relative">
                  <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-zinc-800 md:mb-8 md:text-2xl">
                    <div className="rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-700 p-2 shadow-md">
                      <Mail className="h-5 w-5 text-white" />
                    </div>
                    Contact info
                  </h2>
                  <ul className="space-y-5 md:space-y-7">
                    <li className="group/item flex gap-4 rounded-lg p-3 transition-colors hover:bg-white/80">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-md shadow-blue-200 transition-transform group-hover/item:scale-110">
                        <Mail className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                          Email
                        </p>
                        <a href="mailto:benjfrancis2@gmail.com" className="text-sm font-medium text-zinc-700 transition-colors hover:text-blue-600 md:text-base">
                          benjfrancis2@gmail.com
                        </a>
                      </div>
                    </li>
                    <li className="group/item flex gap-4 rounded-lg p-3 transition-colors hover:bg-white/80">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-md shadow-emerald-200 transition-transform group-hover/item:scale-110">
                        <Phone className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                          Phone
                        </p>
                        <a href="tel:+639276857896" className="text-sm font-medium text-zinc-700 transition-colors hover:text-emerald-600 md:text-base">
                          +63 927 685 7896
                        </a>
                      </div>
                    </li>
                    <li className="group/item flex gap-4 rounded-lg p-3 transition-colors hover:bg-white/80">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 shadow-md shadow-orange-200 transition-transform group-hover/item:scale-110">
                        <MapPin className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                          Address
                        </p>
                        <p className="text-sm font-medium text-zinc-700 md:text-base">
                          Instruccion Street, Sampaloc Manila
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Form skeleton */}
            <div className="lg:col-span-3">
              <div className="group relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-gradient-to-br from-white to-zinc-50/50 p-5 shadow-lg shadow-zinc-200/50 transition-all duration-300 hover:shadow-xl hover:shadow-zinc-300/50 md:p-8">
                <div className="absolute left-0 top-0 h-32 w-32 -translate-x-8 -translate-y-8 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 blur-2xl transition-transform duration-500 group-hover:scale-150" />
                <div className="relative">
                  <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-zinc-800 md:mb-8 md:text-2xl">
                    <div className="rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-700 p-2 shadow-md">
                      <Send className="h-5 w-5 text-white" />
                    </div>
                    Send a message
                  </h2>
                  <form className="space-y-5 md:space-y-6" onSubmit={(e) => e.preventDefault()}>
                    <div className="group/input">
                      <label
                        htmlFor="contact-name"
                        className="mb-2 block text-sm font-semibold text-zinc-700"
                      >
                        Name
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        placeholder="Your name"
                        className="w-full rounded-xl border-2 border-zinc-200 bg-white px-4 py-3.5 text-zinc-800 shadow-sm placeholder:text-zinc-400 transition-all focus:border-zinc-400 focus:outline-none focus:ring-4 focus:ring-zinc-100"
                      />
                    </div>
                    <div className="group/input">
                      <label
                        htmlFor="contact-email"
                        className="mb-2 block text-sm font-semibold text-zinc-700"
                      >
                        Email
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        placeholder="you@example.com"
                        className="w-full rounded-xl border-2 border-zinc-200 bg-white px-4 py-3.5 text-zinc-800 shadow-sm placeholder:text-zinc-400 transition-all focus:border-zinc-400 focus:outline-none focus:ring-4 focus:ring-zinc-100"
                      />
                    </div>
                    <div className="group/input">
                      <label
                        htmlFor="contact-message"
                        className="mb-2 block text-sm font-semibold text-zinc-700"
                      >
                        Message
                      </label>
                      <textarea
                        id="contact-message"
                        rows={5}
                        placeholder="Your message..."
                        className="w-full resize-y rounded-xl border-2 border-zinc-200 bg-white px-4 py-3.5 text-zinc-800 shadow-sm placeholder:text-zinc-400 transition-all focus:border-zinc-400 focus:outline-none focus:ring-4 focus:ring-zinc-100"
                      />
                    </div>
                    <button
                      type="submit"
                      className="group/btn relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-zinc-300 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-zinc-400 focus:outline-none focus:ring-4 focus:ring-zinc-300 active:scale-[0.98] sm:w-auto"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <Send className="h-4 w-4" />
                        Send message
                      </span>
                      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover/btn:translate-x-full" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map - infrastructure location */}
      <section className="relative border-t border-zinc-200/50 bg-gradient-to-br from-zinc-50 via-white to-zinc-50 px-4 py-12 backdrop-blur-sm md:px-12 md:py-20 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <div className="group relative overflow-hidden rounded-2xl border border-zinc-200/80 bg-gradient-to-br from-white to-zinc-50/50 p-5 shadow-lg shadow-zinc-200/50 transition-all duration-300 hover:shadow-xl hover:shadow-zinc-300/50 md:p-8">
            <div className="absolute right-0 top-0 h-40 w-40 -translate-y-10 translate-x-10 rounded-full bg-gradient-to-br from-emerald-500/10 to-teal-500/10 blur-3xl transition-transform duration-500 group-hover:scale-150" />
            <div className="relative">
              <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-zinc-800 md:mb-8 md:text-2xl">
                <div className="rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-700 p-2 shadow-md">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                Find us
              </h2>
              <div className="overflow-hidden rounded-xl border-2 border-zinc-200 shadow-md">
                <ClientLocationMap
                  longitude={120.9952}
                  latitude={14.6157}
                  className="w-full"
                />
              </div>
              <div className="mt-5 flex items-start gap-3 rounded-lg bg-zinc-50 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 shadow-md">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-800">Our Location</p>
                  <p className="mt-0.5 text-sm text-zinc-600">
                    Instruccion Street, Sampaloc Manila
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
