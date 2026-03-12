"use client";

import Link from "next/link";
import {
  ChevronRight,
  ArrowRight,
  Users,
  Target,
  Zap,
  Award,
  Globe,
  Heart,
  Building2,
  Handshake,
  Lightbulb,
  TrendingUp,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";



export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-200 pb-20 font-sans text-foreground lg:pb-0">
      {/* ====== Breadcrumb ====== */}
      <div className="border-b border-gray-300/70 bg-gray-100/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center gap-1.5 px-6 py-3 text-xs text-zinc-400 md:px-10">
          <Link href="/" className="transition-colors hover:text-zinc-600">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="font-medium text-zinc-700">About Us</span>
        </div>
      </div>

      {/* ====== Page header card ====== */}
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
              <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                About Us
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-200/80">
                We are a trusted technology partner — providing reliable wired
                and wireless solutions for businesses, resellers, and
                large-scale deployments.
              </p>
            </div>

            {/* Animated floating icons */}
            <div className="pointer-events-none absolute right-2 top-0 bottom-0 hidden w-72 items-center md:flex lg:right-6 lg:w-96">
              {[
                { Icon: Building2, x: 0, y: -35, delay: 0, size: "h-6 w-6" },
                { Icon: Users, x: 70, y: 10, delay: 0.15, size: "h-5 w-5" },
                { Icon: Globe, x: 25, y: 40, delay: 0.3, size: "h-5 w-5" },
                { Icon: Award, x: 120, y: -20, delay: 0.45, size: "h-5 w-5" },
                { Icon: Heart, x: 160, y: 30, delay: 0.6, size: "h-6 w-6" },
                { Icon: Handshake, x: 50, y: -10, delay: 0.1, size: "h-5 w-5" },
                { Icon: Lightbulb, x: 200, y: -30, delay: 0.25, size: "h-5 w-5" },
                { Icon: Target, x: 95, y: 50, delay: 0.5, size: "h-5 w-5" },
                { Icon: TrendingUp, x: 230, y: 15, delay: 0.7, size: "h-5 w-5" },
                { Icon: ShieldCheck, x: 170, y: -5, delay: 0.35, size: "h-5 w-5" },
                { Icon: Zap, x: 140, y: 55, delay: 0.55, size: "h-5 w-5" },
                { Icon: Clock, x: 250, y: -15, delay: 0.8, size: "h-5 w-5" },
              ].map(({ Icon, x, y, delay, size }, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0.5, scale: 0.9 }}
                  animate={{
                    opacity: [0.35, 0.55, 0.35],
                    y: [y, y - 8, y + 8, y],
                    scale: [1, 1.05, 0.97, 1],
                  }}
                  transition={{
                    delay,
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
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

      {/* ====== Our Story ====== */}
      <section className="px-6 py-14 md:px-10 md:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
            >
              <span className="mb-3 inline-block rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-600">
                Our Story
              </span>
              <h2 className="mb-4 text-2xl font-bold tracking-tight text-zinc-900 md:text-3xl">
                Built on trust, driven by technology
              </h2>
              <p className="mb-4 text-sm leading-relaxed text-zinc-500">
                What started as a small team passionate about networking and
                security technology has grown into a reliable partner serving
                businesses across the region. We specialize in CCTV, access
                points, routers, switches, and telephone systems.
              </p>
              <p className="text-sm leading-relaxed text-zinc-500">
                Our mission is simple: deliver high-quality, cost-effective
                technology solutions that our clients can depend on — whether
                for resale, deployment, or large-scale installations.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { value: "500+", label: "Products Available" },
                { value: "200+", label: "Satisfied Clients" },
                { value: "5+", label: "Years Experience" },
                { value: "24/7", label: "Customer Support" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-gray-300/60 bg-white p-5 text-center shadow-sm transition-shadow hover:shadow-md"
                >
                  <p className="text-2xl font-bold text-slate-700 md:text-3xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====== What We Stand For ====== */}
      <section className="border-t border-gray-300/60 bg-white/50 px-6 py-14 backdrop-blur-sm md:px-10 md:py-16">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4 }}
            className="mb-10 text-center"
          >
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 md:text-3xl">
              What we stand for
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-zinc-500">
              The core values that guide everything we do — from product
              selection to customer support.
            </p>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: "Quality Assurance",
                desc: "Every product we offer meets rigorous quality standards. We only stock brands and models we trust.",
              },
              {
                icon: Handshake,
                title: "Customer First",
                desc: "We build lasting relationships by putting our clients' needs at the center of every decision.",
              },
              {
                icon: Zap,
                title: "Fast Delivery",
                desc: "Efficient logistics and inventory management mean you get what you need, when you need it.",
              },
              {
                icon: Target,
                title: "Competitive Pricing",
                desc: "We negotiate the best rates with suppliers so our clients always get market-leading prices.",
              },
              {
                icon: Lightbulb,
                title: "Expert Guidance",
                desc: "Our team provides knowledgeable advice to help you choose the right solution for your project.",
              },
              {
                icon: TrendingUp,
                title: "Continuous Growth",
                desc: "We constantly expand our product range and improve our services to stay ahead of the market.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="rounded-xl border border-gray-200/80 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                  <item.icon className="h-5 w-5 text-slate-600" />
                </div>
                <h3 className="mb-1.5 text-sm font-bold text-zinc-800">
                  {item.title}
                </h3>
                <p className="text-[13px] leading-relaxed text-zinc-500">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== Trust badges ====== */}
      <section className="border-t border-gray-300/60 bg-gray-100/60 px-6 py-10 md:px-10">
        <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Award,
              title: "Industry Certified",
              desc: "Authorized reseller of top brands",
            },
            {
              icon: Users,
              title: "Trusted by Many",
              desc: "200+ businesses served nationwide",
            },
            {
              icon: Globe,
              title: "Wide Coverage",
              desc: "Serving clients across the region",
            },
            {
              icon: Heart,
              title: "Dedicated Support",
              desc: "Technical help when you need it",
            },
          ].map((item) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4 }}
              className="flex items-start gap-4 rounded-xl border border-gray-200/70 bg-white p-4 shadow-sm"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                <item.icon className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-800">
                  {item.title}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-zinc-400">{item.desc}</p>
              </div>
            </motion.div>
          ))}
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
            Ready to work with us?
          </h2>
          <p className="mb-8 text-sm leading-relaxed text-zinc-400 md:text-base">
            Whether you&apos;re looking for products, partnerships, or custom
            solutions — we&apos;d love to hear from you.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/landing-page/contact"
              className="group inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition-all hover:bg-zinc-100"
            >
              Contact Us
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/landing-page/products"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-zinc-800"
            >
              View Products
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
