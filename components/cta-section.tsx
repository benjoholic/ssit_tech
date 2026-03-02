"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export function CtaSection() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setIsLoggedIn(true);
      }
    });
  }, []);

  return (
    <section className="relative overflow-hidden bg-slate-900 py-16 px-6 md:px-8 md:py-18">
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)",
        }}
        animate={{ x: [0, 40, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-20 -right-20 w-[500px] h-[500px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)",
        }}
        animate={{ x: [0, -40, 0], y: [0, -30, 0], scale: [1, 1.12, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] cta-grid-overlay"
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-2xl flex flex-col items-center text-center">
        <motion.span
          className="mb-4 inline-block rounded-full border border-indigo-400/30 bg-indigo-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-300"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Get started today
        </motion.span>

        <motion.h2
          className="text-3xl font-bold tracking-tight text-white md:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Ready to upgrade your network infrastructure?
        </motion.h2>

        <motion.p
          className="mt-4 max-w-lg text-base leading-relaxed text-slate-300 md:text-base"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Join teams already using SSIT Tech to centralize credentials, manage
          approvals, and give clients a seamless experience.
        </motion.p>

        <motion.div
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
            <Link
              href={isLoggedIn ? "/client/home" : "/credentials/client/signup"}
              className="inline-block rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:from-indigo-600 hover:to-blue-600 hover:shadow-xl"
            >
              {isLoggedIn ? "Dashboard" : "Create a free account"}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
