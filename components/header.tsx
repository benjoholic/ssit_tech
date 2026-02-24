"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Home, Box, Users, Mail, LayoutDashboard, LogIn } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/landing-page/products", label: "Products", icon: Box },
  { href: "/landing-page/about", label: "About Us", icon: Users },
  { href: "/landing-page/contact", label: "Contact Us", icon: Mail },
] as const;

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function Header() {
  const pathname = usePathname();
  const [dashboardHref, setDashboardHref] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setDashboardHref(
          data.user.user_metadata?.is_admin ? "/admin/home" : "/client/home",
        );
      } else {
        setDashboardHref(null);
      }
      setAuthLoading(false);
    });
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 overflow-visible border-b border-zinc-200/80 bg-white shadow-sm">
        <div className="flex h-14 items-center justify-between px-4 sm:px-6">
          <Link href="/" className="relative z-10 flex shrink-0 items-center">
            <Image
              src="/favicon.ico"
              alt="SSIT Tech Logo"
              width={120}
              height={120}
              className="absolute -top-6.5 left-0 rounded-lg drop-shadow-md"
            />
            <div className="w-35" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map(({ href, label }) => {
              const active = isActivePath(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                    active
                      ? "bg-zinc-900 text-white shadow-sm"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
            {!authLoading &&
              (dashboardHref ? (
                <Link
                  href={dashboardHref}
                  className="ml-2 flex items-center gap-1.5 rounded-full bg-zinc-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-zinc-700"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/credentials/client/login"
                  className="ml-2 flex items-center gap-1.5 rounded-full bg-zinc-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-zinc-700"
                >
                  Sign In
                </Link>
              ))}
          </nav>
        </div>
      </header>

      {/* Mobile bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-200/80 bg-white/95 pb-safe backdrop-blur-lg lg:hidden">
        <div className="flex items-center justify-around px-2 py-2">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const active = isActivePath(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-3 py-2 transition-all duration-200 ${
                  active
                    ? "bg-zinc-900 text-white shadow-sm"
                    : "text-zinc-600 active:bg-zinc-100"
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${active ? "text-white" : "text-zinc-500"}`}
                />
                <span className="text-[0.65rem] font-medium leading-none">
                  {label}
                </span>
              </Link>
            );
          })}
          {!authLoading &&
            (dashboardHref ? (
              <Link
                href={dashboardHref}
                className="flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl bg-zinc-900 px-3 py-2 text-white shadow-sm transition-all"
              >
                <LayoutDashboard className="h-5 w-5 text-white" />
                <span className="text-[0.65rem] font-medium leading-none">
                  Dashboard
                </span>
              </Link>
            ) : (
              <Link
                href="/credentials/client/login"
                className="flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl bg-zinc-900 px-3 py-2 text-white shadow-sm transition-all"
              >
                <LogIn className="h-5 w-5 text-white" />
                <span className="text-[0.65rem] font-medium leading-none">
                  Login
                </span>
              </Link>
            ))}
        </div>
      </nav>
    </>
  );
}
