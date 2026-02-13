"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

function PaperPlaneLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M2 12l4-9 14 6-8 2-6 8-4-7z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/landing-page/products", label: "Products" },
  { href: "/landing-page/about", label: "About Us" },
  { href: "/landing-page/contact", label: "Contact Us" },
] as const;

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

const signInOptions = [
  { href: "/credentials/admin/login", label: "Admin" },
  { href: "/credentials/dealer/login", label: "Dealer" },
] as const;

export function Header() {
  const pathname = usePathname();
  const [signInOpen, setSignInOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setSignInOpen(false);
      }
    }
    if (signInOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [signInOpen]);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-zinc-200/80 bg-gray-400 px-6 py-4 shadow-sm">
      <Link href="/" className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20 text-white">
          <PaperPlaneLogo className="h-5 w-5" />
        </span>
        <span className="text-lg font-bold uppercase tracking-tight text-white">
          SSIT TECH
        </span>
      </Link>
      <nav className="flex items-center gap-8">
        {navLinks.map(({ href, label }) => {
          const active = isActivePath(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              className={`text-sm font-medium transition-colors hover:text-white/90 ${
                active
                  ? "text-white underline decoration-2 underline-offset-4"
                  : "text-white/90"
              }`}
            >
              {label}
            </Link>
          );
        })}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setSignInOpen((open) => !open)}
            className="flex items-center gap-1.5 rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-white/60 focus:ring-offset-2 focus:ring-offset-gray-400"
            aria-expanded={signInOpen}
            aria-haspopup="true"
          >
            Sign In
            <ChevronDown
              className={`h-4 w-4 transition-transform ${signInOpen ? "rotate-180" : ""}`}
            />
          </button>
          {signInOpen && (
            <div
              className="absolute right-0 top-full z-50 mt-1.5 min-w-[140px] rounded-lg border border-zinc-200 bg-white py-1 shadow-lg"
              role="menu"
            >
              {signInOptions.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  role="menuitem"
                  className="block px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
                  onClick={() => setSignInOpen(false)}
                >
                  {label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
