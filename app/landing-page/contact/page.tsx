"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Send,
  Users,
  MessageSquare,
  Clock,
  Globe,
  Headphones,
  ArrowRight,
  Zap,
  Shield,
  Award,
} from "lucide-react";
import { motion } from "framer-motion";

const ClientLocationMap = dynamic(
  () => import("@/components/map/location-map").then((m) => ({ default: m.LocationMap })),
  { ssr: false }
);

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.45, ease: "easeOut" as const, delay },
});

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.4, delay },
});

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-200 pb-20 font-sans text-foreground lg:pb-0">

      {/* ====== Breadcrumb ====== */}
      <motion.div {...fadeIn(0)} className="border-b border-gray-300/70 bg-gray-100/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center gap-1.5 px-6 py-3 text-xs text-zinc-400 md:px-10">
          <Link href="/" className="transition-colors hover:text-zinc-600">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="font-medium text-zinc-700">Contact Us</span>
        </div>
      </motion.div>

      {/* ====== Hero card ====== */}
      <section className="bg-transparent px-6 pt-8 pb-0 md:px-10 md:pt-10">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-900 via-teal-950 to-gray-950 px-6 py-10 shadow-xl ring-1 ring-teal-400/10 md:px-10 md:py-12"
          >
            <div className="relative z-10">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-300/80">SSIT Technology</p>
              <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">Get In Touch</h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-200/80">
                Have questions about our products or services? Our team is here
                to help. Reach out and we&apos;ll get back to you as soon as possible.
              </p>
            </div>
            <div className="pointer-events-none absolute right-2 top-0 bottom-0 hidden w-72 items-center md:flex lg:right-6 lg:w-96">
              {[
                { Icon: Mail,          x: 0,   y: -35, delay: 0,    size: "h-6 w-6" },
                { Icon: Phone,         x: 70,  y: 10,  delay: 0.15, size: "h-5 w-5" },
                { Icon: Globe,         x: 25,  y: 40,  delay: 0.3,  size: "h-5 w-5" },
                { Icon: MessageSquare, x: 120, y: -20, delay: 0.45, size: "h-5 w-5" },
                { Icon: Clock,         x: 160, y: 30,  delay: 0.6,  size: "h-6 w-6" },
                { Icon: Users,         x: 50,  y: -10, delay: 0.1,  size: "h-5 w-5" },
                { Icon: Headphones,    x: 200, y: -30, delay: 0.25, size: "h-5 w-5" },
                { Icon: MapPin,        x: 95,  y: 50,  delay: 0.5,  size: "h-5 w-5" },
                { Icon: Send,          x: 230, y: 15,  delay: 0.7,  size: "h-5 w-5" },
                { Icon: Zap,           x: 170, y: -5,  delay: 0.35, size: "h-5 w-5" },
                { Icon: Shield,        x: 140, y: 55,  delay: 0.55, size: "h-5 w-5" },
                { Icon: Award,         x: 250, y: -15, delay: 0.8,  size: "h-5 w-5" },
              ].map(({ Icon, x, y, delay, size }, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0.5, scale: 0.9 }}
                  animate={{ opacity: [0.35, 0.55, 0.35], y: [y, y - 8, y + 8, y], scale: [1, 1.05, 0.97, 1] }}
                  transition={{ delay, duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute"
                  style={{ left: x, top: `calc(50% + ${y}px)` }}
                >
                  <Icon className={`${size} text-white/60 drop-shadow-lg`} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ====== Main content: info + form ====== */}
      <section className="px-6 pt-10 pb-8 md:px-10 md:pt-12 md:pb-10">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 lg:grid-cols-5 lg:gap-10">

            {/* ── SSIT building image ── */}
            <motion.div {...fadeUp(0)} className="lg:col-span-2 self-stretch">
              <div className="relative w-full h-64 overflow-hidden rounded-2xl shadow-sm ring-1 ring-gray-200/80 lg:h-full">
                <Image
                  src="/images/SSIT-FRONT.jpg"
                  alt="SSIT Technology office front"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority
                />
              </div>
            </motion.div>
            {/* ── Minimal form ── */}
            <motion.div {...fadeUp(0.1)} className="lg:col-span-3">
              <div className="rounded-2xl bg-white px-6 py-8 shadow-sm ring-1 ring-gray-200/80 md:px-8 md:py-9">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Message</p>
                <h2 className="mb-6 text-lg font-bold tracking-tight text-zinc-900">Send us a note</h2>

                <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                  {/* Name + Email */}
                  <div className="grid gap-5 sm:grid-cols-2">
                    {[
                      { id: "contact-name",  label: "Name",  type: "text",  },
                      { id: "contact-email", label: "Email", type: "email", },
                    ].map((field) => (
                      <div key={field.id} className="relative">
                        <input
                          id={field.id}
                          type={field.type}
                          placeholder=" "
                          className="peer w-full border-b border-gray-300 bg-transparent pb-2 pt-5 text-sm text-zinc-800 placeholder-transparent transition-colors focus:border-slate-600 focus:outline-none"
                        />
                        <label
                          htmlFor={field.id}
                          className="pointer-events-none absolute left-0 top-0 text-[10px] font-bold uppercase tracking-widest text-zinc-400 transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-zinc-400 peer-focus:top-0 peer-focus:text-[10px] peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-slate-600"
                        >
                          {field.label}
                        </label>
                        <div className="absolute bottom-0 left-0 h-px w-0 bg-slate-600 transition-all duration-300 peer-focus:w-full" />
                      </div>
                    ))}
                  </div>

                  {/* Subject */}
                  <div className="relative">
                    <input
                      id="contact-subject"
                      type="text"
                      placeholder=" "
                      className="peer w-full border-b border-gray-300 bg-transparent pb-2 pt-5 text-sm text-zinc-800 placeholder-transparent transition-colors focus:border-slate-600 focus:outline-none"
                    />
                    <label
                      htmlFor="contact-subject"
                      className="pointer-events-none absolute left-0 top-0 text-[10px] font-bold uppercase tracking-widest text-zinc-400 transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-zinc-400 peer-focus:top-0 peer-focus:text-[10px] peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-slate-600"
                    >
                      Subject
                    </label>
                    <div className="absolute bottom-0 left-0 h-px w-0 bg-slate-600 transition-all duration-300 peer-focus:w-full" />
                  </div>

                  {/* Message */}
                  <div className="relative">
                    <textarea
                      id="contact-message"
                      rows={3}
                      placeholder=" "
                      className="peer w-full resize-none border-b border-gray-300 bg-transparent pb-2 pt-5 text-sm text-zinc-800 placeholder-transparent transition-colors focus:border-slate-600 focus:outline-none"
                    />
                    <label
                      htmlFor="contact-message"
                      className="pointer-events-none absolute left-0 top-0 text-[10px] font-bold uppercase tracking-widest text-zinc-400 transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-zinc-400 peer-focus:top-0 peer-focus:text-[10px] peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-slate-600"
                    >
                      Message
                    </label>
                    <div className="absolute bottom-0 left-0 h-px w-0 bg-slate-600 transition-all duration-300 peer-focus:w-full" />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <p className="text-xs text-zinc-400">We reply within 1 business day.</p>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="group inline-flex items-center gap-2 rounded-xl bg-slate-800 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-700"
                    >
                      Send
                      <Send className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ====== Our Location ====== */}
      <section className="border-t border-gray-300/60 px-6 py-14 md:px-10 md:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14 lg:items-start">

            {/* Text side */}
            <motion.div {...fadeUp(0)} className="space-y-6">
              <div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Find Us</p>
                <h2 className="text-xl font-bold tracking-tight text-zinc-900">Our Location</h2>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                  Visit us at our main office in Sampaloc, Manila during business hours.
                </p>
              </div>
              <div className="space-y-5">
                {[
                  { icon: MapPin, label: "Address", value: "956B Instruccion St, Sampaloc, Manila, 1008 Metro Manila", href: null },
                  { icon: Clock,  label: "Hours",   value: "Mon \u2013 Fri, 8:30 AM \u2013 5:30 PM",    href: null },
                  { icon: Phone,  label: "Phone",   value: "+63 927 685 7896",                 href: "tel:+639276857896" },
                ].map((item, i) => (
                  <motion.div key={item.label} {...fadeUp(i * 0.08)} className="flex items-start gap-4">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-gray-200/80">
                      <item.icon className="h-4 w-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="mt-0.5 block text-sm font-semibold text-zinc-700 transition-colors hover:text-zinc-900">{item.value}</a>
                      ) : (
                        <p className="mt-0.5 text-sm font-semibold text-zinc-700">{item.value}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Phone mockup */}
            <motion.div {...fadeUp(0.15)} className="flex justify-center lg:justify-end">
              <div className="relative w-[260px] shrink-0">
                <div className="relative overflow-hidden rounded-[2.8rem] bg-slate-800 p-[3px] shadow-2xl ring-1 ring-slate-700">
                  <div className="absolute -left-[3px] top-24  h-8  w-[3px] rounded-l-full bg-slate-600" />
                  <div className="absolute -left-[3px] top-36  h-12 w-[3px] rounded-l-full bg-slate-600" />
                  <div className="absolute -left-[3px] top-52  h-12 w-[3px] rounded-l-full bg-slate-600" />
                  <div className="absolute -right-[3px] top-36 h-16 w-[3px] rounded-r-full bg-slate-600" />
                  <div className="overflow-hidden rounded-[2.5rem] bg-black">
                    <div className="flex items-center justify-between bg-slate-900 px-5 pt-3 pb-1">
                      <span className="text-[10px] font-semibold text-white">9:41</span>
                      <div className="h-4 w-16 rounded-full bg-black" />
                      <div className="flex items-center gap-1">
                        <div className="h-2 w-3 rounded-sm bg-white/80" />
                        <div className="h-2 w-2 rounded-sm bg-white/80" />
                        <div className="h-2 w-2 rounded-full bg-white/80" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-800 px-4 py-2.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-300" />
                      <span className="text-[11px] font-semibold text-slate-200">SSIT Technology</span>
                    </div>
                    <div className="h-[340px] w-full overflow-hidden">
                      <ClientLocationMap longitude={120.9952} latitude={14.6157} className="h-full w-full" />
                    </div>
                    <div className="bg-white px-4 py-3">
                      <p className="truncate text-[11px] font-semibold text-zinc-800">956B Instruccion St, Sampaloc</p>
                      <p className="text-[10px] text-zinc-400">Manila 1008, Metro Manila</p>
                    </div>
                    <div className="flex justify-center bg-white pb-2 pt-1">
                      <div className="h-1 w-24 rounded-full bg-zinc-300" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ====== Why reach out ====== */}
      <section className="border-t border-gray-300/60 bg-white/50 px-6 py-14 backdrop-blur-sm md:px-10 md:py-16">
        <div className="mx-auto max-w-7xl">
          <motion.div {...fadeUp(0)} className="mb-10">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Why Us</p>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900">Why reach out to SSIT Tech?</h2>
          </motion.div>

          <div className="grid gap-px overflow-hidden rounded-2xl bg-gray-200/80 shadow-sm ring-1 ring-gray-200/80 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Headphones, title: "Expert Support",  desc: "Deep knowledge of networking, surveillance, and communication equipment." },
              { icon: Zap,        title: "Fast Response",   desc: "We aim to reply within 24 hours with clear answers and recommendations." },
              { icon: Globe,      title: "Wide Reach",      desc: "Serving customers across the region with reliable delivery and logistics." },
              { icon: Award,      title: "Trusted Partner", desc: "200+ satisfied clients trust us for their technology needs." },
              { icon: Shield,     title: "Quality Assured", desc: "Every recommendation comes from our rigorous vetting process." },
              { icon: Users,      title: "Personal Touch",  desc: "We treat every inquiry with care to find the best solution for you." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                {...fadeUp(i * 0.06)}
                className="flex gap-4 bg-white p-6 transition-colors hover:bg-gray-50/80"
              >
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                  <item.icon className="h-4 w-4 text-slate-600" />
                </div>
                <div>
                  <p className="mb-1 text-sm font-bold text-zinc-800">{item.title}</p>
                  <p className="text-xs leading-relaxed text-zinc-500">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== CTA ====== */}
      <section className="bg-zinc-900 px-6 py-16 md:px-10 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="mb-3 text-2xl font-bold text-white md:text-3xl">
            Can&apos;t wait to connect?
          </h2>
          <p className="mb-8 text-sm leading-relaxed text-zinc-400 md:text-base">
            Call us directly at +63 927 685 7896 or email benjfrancis2@gmail.com â€” we&apos;re ready to help.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/landing-page/products"
              className="group inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition-all hover:bg-zinc-100"
            >
              Browse Products
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/landing-page/about"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-zinc-800"
            >
              Learn About Us
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

