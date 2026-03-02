
"use client";
import { HeroCarousel } from "@/components/hero-carousel";

import Link from "next/link";
import GradientOutlineButton from "@/components/ui/gradient-outline-button";
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
      // ...waves removed...


      {/* Two-column layout: left (text/buttons), right (carousel) */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-20 flex flex-col lg:flex-row gap-12 lg:gap-20 min-h-[400px] lg:min-h-[500px] items-center justify-center lg:items-center lg:justify-between hero-mobile-center">
        {/* Left: Heading and buttons */}
        <div className="flex flex-col items-start justify-center text-left space-y-8 w-full max-w-2xl lg:w-[30%] lg:h-full lg:justify-center lg:-mt-10 hero-mobile-center">
          <motion.h1
            className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight tracking-tight text-white hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            A modern portal for<br />growing client networks
          </motion.h1>
          <div className="flex gap-4 mt-2 hero-buttons">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href={
                  !authLoading && dashboardHref
                    ? dashboardHref
                    : "/credentials/client/login"
                }
                className="inline-block"
              >
                <GradientOutlineButton>
                  {(!authLoading && dashboardHref) ? "Dashboard" : "Get started"}
                </GradientOutlineButton>
              </Link>
            </motion.div>
            {/* hide learn-more when already showing dashboard */}
            {(!authLoading && !dashboardHref) && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="#features" className="inline-block">
                  <GradientOutlineButton style={{ borderColor: '#94a3b8' }} hideArrow>
                    Learn more
                  </GradientOutlineButton>
                </Link>
              </motion.div>
            )}
          </div>
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

      {/* Subtle divider */}
      <div className="h-px bg-slate-700" />
    </section>
  );
}
