"use client";

import { motion, type Transition } from "framer-motion";
import { ShieldCheck, Users, Layers } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Quality Assurance",
    desc: "Every product meets rigorous standards. We partner with industry-leading brands and thoroughly vet every solution.",
    color: "bg-blue-50 text-blue-600",
    border: "hover:border-blue-200",
  },
  {
    icon: Users,
    title: "Expert Team",
    desc: "Our specialists provide knowledgeable guidance to help you choose the right technology for your unique needs.",
    color: "bg-emerald-50 text-emerald-600",
    border: "hover:border-emerald-200",
  },
  {
    icon: Layers,
    title: "Flexible Solutions",
    desc: "From small deployments to enterprise installations, we scale our offerings to match your project requirements.",
    color: "bg-violet-50 text-violet-600",
    border: "hover:border-violet-200",
  },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" as const },
  transition: { duration: 0.5, delay, ease: "easeOut" } as Transition,
});

export function WhyChooseSection() {
  return (
    <section
      id="features"
      className="relative overflow-hidden bg-white px-6 py-16 md:px-10 md:py-24"
    >
      {/* subtle bg radial */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(148,163,184,0.08),transparent)]" />

      <div className="relative mx-auto max-w-6xl">
        {/* Heading */}
        <motion.div {...fadeUp(0)} className="text-center">
          <span className="mb-3 inline-block rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-slate-500">
            Why Us
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 md:text-5xl">
            Why choose SSIT Tech
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-zinc-500 md:text-lg">
            We deliver premium networking, surveillance, and communication
            solutions with expert support and competitive pricing for businesses
            of all sizes.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              {...fadeUp(0.15 + i * 0.1)}
              whileHover={{ y: -4 }}
              className={`group rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-lg ${f.border}`}
            >
              {/* Icon */}
              <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl ${f.color}`}>
                <f.icon className="h-6 w-6" />
              </div>

              <h3 className="mb-3 text-lg font-bold tracking-tight text-zinc-900">
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed text-zinc-500">{f.desc}</p>

              {/* animated underline on hover */}
              <div className="mt-6 h-0.5 w-0 rounded-full bg-current opacity-20 transition-all duration-500 group-hover:w-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
