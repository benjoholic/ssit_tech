"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const partners = [
  { src: "/images/hikvision.png",  alt: "Hikvision",  angle: 0       },
  { src: "/images/tplink.png",     alt: "TP-Link",    angle: 51.4    },
  { src: "/images/fanvil.png",     alt: "Fanvil",     angle: 102.9   },
  { src: "/images/powerlogic.png", alt: "Powerlogic", angle: 154.3   },
  { src: "/images/ubiquiti.png",   alt: "Ubiquiti",   angle: 205.7   },
  { src: "/images/yeastar.png",    alt: "Yeastar",    angle: 257.1   },
  { src: "/images/yealink.png",    alt: "Yealink",    angle: 308.6   },
];

const RADIUS = 160;
const CONTAINER = RADIUS * 2 + 120; // px – gives room for logos + labels

export function PartnersOrbit() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white px-6 py-16 md:px-10 md:py-24">
      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute -left-32 top-0 h-64 w-64 rounded-full bg-slate-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-64 w-64 rounded-full bg-blue-100/30 blur-3xl" />

      <div className="relative mx-auto max-w-4xl text-center">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="mb-3 inline-block rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-slate-500">
            Our Partners
          </span>
          <h2 className="mb-14 text-2xl font-bold tracking-tight text-zinc-900 md:text-3xl">
            Trusted Brands We Carry
          </h2>
        </motion.div>

        {/* ── MOBILE: Marquee ── */}
        <div className="block md:hidden">
          <div className="relative overflow-hidden">
            {/* Left/right fade edges */}
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-12 bg-gradient-to-r from-white to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12 bg-gradient-to-l from-white to-transparent" />

            {/* Scrolling track – logos duplicated for seamless loop */}
            <div className="animate-marquee flex w-max gap-6 py-2">
              {[...partners, ...partners].map((brand, i) => (
                <div
                  key={`${brand.alt}-${i}`}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border border-gray-200 bg-white p-3 shadow-md">
                    <Image
                      src={brand.src}
                      alt={brand.alt}
                      width={56}
                      height={56}
                      className="h-12 w-12 object-contain"
                    />
                  </div>
                  <span className="whitespace-nowrap rounded-full border border-gray-200 bg-white/90 px-2.5 py-0.5 text-[10px] font-semibold text-zinc-500 shadow-sm">
                    {brand.alt}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── DESKTOP: Orbital diagram ── */}
        <div className="hidden md:flex justify-center">
          {/* eslint-disable-next-line react/forbid-dom-props */}
        <div className="relative h-[440px] w-[440px]">
            {/* SVG connecting lines */}
            <svg
              className="pointer-events-none absolute inset-0"
              width={CONTAINER}
              height={CONTAINER}
              viewBox={`0 0 ${CONTAINER} ${CONTAINER}`}
            >
              {partners.map((brand) => {
                const rad = (brand.angle * Math.PI) / 180;
                const cx = CONTAINER / 2;
                const cy = CONTAINER / 2;
                const lx = cx + Math.round(Math.sin(rad) * RADIUS);
                const ly = cy + Math.round(-Math.cos(rad) * RADIUS);
                return (
                  <line
                    key={brand.alt}
                    x1={cx}
                    y1={cy}
                    x2={lx}
                    y2={ly}
                    stroke="rgba(148,163,184,0.35)"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                );
              })}
            </svg>

            {/* Outer orbit ring – slowly rotates */}
            <motion.div
              className="absolute inset-0 rounded-full border border-dashed border-slate-200"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
            />

            {/* Second static ring */}
            <div className="absolute left-1/2 top-1/2 h-[184px] w-[184px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-100" />

            {/* Glow halo behind center */}
            <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-200/50 blur-2xl" />

            {/* Pulse ring */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-slate-400/40"
              style={{ width: 100, height: 100 }}
              animate={{ scale: [1, 1.55, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
            />
            {/* Second pulse ring (offset) */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-300/30"
              style={{ width: 100, height: 100 }}
              animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ repeat: Infinity, duration: 2.8, delay: 0.9, ease: "easeInOut" }}
            />

            {/* Center – SSIT logo */}
            <motion.div
              className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 flex h-24 w-24 items-center justify-center rounded-full border-2 border-slate-200 bg-white p-3 shadow-xl ring-4 ring-white"
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 220, damping: 18, delay: 0.15 }}
            >
              <Image
                src="/images/ssit.png"
                alt="SSIT Technology"
                width={68}
                height={68}
                className="h-16 w-16 object-contain"
              />
            </motion.div>

            {/* Partner logos */}
            {partners.map((brand, i) => {
              const rad = (brand.angle * Math.PI) / 180;
              const x = Math.round(Math.sin(rad) * RADIUS);
              const y = Math.round(-Math.cos(rad) * RADIUS);

              return (
                <motion.div
                  key={brand.alt}
                  className="absolute z-10 flex flex-col items-center gap-2"
                  style={{
                    left: `calc(50% + ${x}px - 48px)`,
                    top: `calc(50% + ${y}px - 48px)`,
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 16,
                    delay: 0.3 + i * 0.1,
                  }}
                  whileHover={{ scale: 1.15, zIndex: 20 }}
                >
                  {/* Logo circle */}
                  <div className="flex h-[96px] w-[96px] items-center justify-center rounded-full border border-gray-200 bg-white p-3 shadow-md transition-shadow duration-300 hover:shadow-xl">
                    <Image
                      src={brand.src}
                      alt={brand.alt}
                      width={64}
                      height={64}
                      className="h-14 w-14 object-contain"
                    />
                  </div>
                  {/* Label */}
                  <span className="whitespace-nowrap rounded-full border border-gray-200 bg-white/90 px-2.5 py-0.5 text-[10px] font-semibold text-zinc-500 shadow-sm backdrop-blur-sm">
                    {brand.alt}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Tagline below orbit */}
        <motion.p
          className="mt-10 text-sm text-zinc-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          Authorized reseller of industry-leading technology brands
        </motion.p>
      </div>
    </section>
  );
}
