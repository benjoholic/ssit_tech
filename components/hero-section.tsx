
"use client";
import { HeroCarousel } from "@/components/hero-carousel";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";


import Pattern from "./Pattern";
import "./hero-section.css";


export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const carouselScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const carouselOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.4]);

  // track auth/dashboard link similar to header so hero buttons mirror behaviour
  const [dashboardHref, setDashboardHref] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        const admin = !!data.user.user_metadata?.is_admin;
        setDashboardHref(admin ? null : "/client/home");
      } else {
        setDashboardHref(null);
      }
      setAuthLoading(false);
    });
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-black">
      {/* Pattern Background */}
      <Pattern />

      {/* Two-column layout: left (text/buttons), right (carousel) */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-16 flex flex-col lg:flex-row gap-12 lg:gap-20 min-h-[400px] lg:min-h-[500px] items-center justify-center lg:items-center lg:justify-between hero-mobile-center">
        {/* Left: Heading and buttons */}
        <div className="flex flex-col items-start justify-center text-left space-y-6 w-full max-w-2xl lg:w-[38%] lg:h-full lg:justify-center hero-mobile-center">
          {/* Eyebrow label */}
          <motion.span
            className="inline-flex items-center gap-2 rounded-full border border-blue-500/40 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-blue-400"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
            Networking · Surveillance · Communication
          </motion.span>

          <motion.h1
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-[1.15] tracking-tight text-white hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Your SSIT Tech<br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              client portal
            </span>
          </motion.h1>

          <motion.p
            className="text-sm md:text-base text-slate-400 leading-relaxed max-w-sm hero-subtitle"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
          >
            Browse CCTV, networking, and communication products, place order inquiries, and track your requests — all in one secure portal built for SSIT Tech clients.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-3 pt-2 hero-buttons"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.38 }}
          >
            <Link
              href={
                !authLoading && dashboardHref
                  ? dashboardHref
                  : "/credentials/client/login"
              }
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all duration-200 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/40"
            >
              {(!authLoading && dashboardHref) ? "Go to Dashboard" : "Get started"}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
              </svg>
            </Link>

            {(!authLoading && !dashboardHref) && (
              <Link
                href="#features"
                className="inline-flex items-center gap-2 rounded-full border border-slate-600 hover:border-slate-400 bg-white/5 hover:bg-white/10 active:scale-95 transition-all duration-200 px-6 py-2.5 text-sm font-semibold text-slate-300 hover:text-white"
              >
                Learn more
              </Link>
            )}
          </motion.div>
        </div>

        {/* Right: HeroCarousel */}
        <motion.div
          className="relative w-full max-w-2xl flex justify-center items-center lg:w-[70%] lg:h-full lg:justify-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{ scale: carouselScale, opacity: carouselOpacity }}
        >
          <HeroCarousel />
        </motion.div>
      </div>

      {/* Bottom wavy overlay – light colour of the next section rises up */}
      <div className="absolute bottom-0 left-0 w-full z-10 pointer-events-none hero-wave-wrapper">
        <svg
          viewBox="0 0 1440 100"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full hero-wave-svg"
        >
          <path
            d="M0,100 L1440,100 L1440,58 C1320,22 1140,90 960,54 C780,18 600,88 420,52 C240,18 90,80 0,38 Z"
            fill="#f3f4f6"
          />
        </svg>
      </div>
    </section>
  );
}
