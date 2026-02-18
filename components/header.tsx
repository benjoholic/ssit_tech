"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, Box, Users, Mail, LogIn, CircleUserRound } from "lucide-react";

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

  return (
    <>
      <header className="sticky top-0 z-50 overflow-visible border-b border-zinc-200/80 bg-white shadow-sm">
        <div className="flex h-14 items-center justify-between px-4 sm:px-6">
          <Link href="/" className="relative z-10 flex shrink-0 items-center">
            <Image
              src="/favicon.ico"
              alt="SSIT Tech Logo"
              width={140}
              height={140}
              className="absolute -top-7.5 left-0 rounded-lg drop-shadow-md"
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
                  className={`relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-zinc-900 text-white shadow-sm"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
            <Link
              href="/credentials/client/login"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-5 py-2 text-sm font-medium text-zinc-700 transition-all hover:border-zinc-400 hover:bg-zinc-50 hover:shadow-sm"
            >
              <CircleUserRound className="h-5 w-5" />
              Sign In
            </Link>
          </nav>

          {/* Desktop sign in (mobile hidden) */}
          <Link
            href="/credentials/client/login"
            className="text-zinc-600 transition-colors hover:text-zinc-900 lg:hidden"
          >
            <CircleUserRound className="h-7 w-7" />
          </Link>
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
        </div>
      </nav>
    </>
  );
}
