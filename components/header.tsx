"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Home, Box, Info, Phone, LayoutDashboard, User } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/landing-page/products", label: "Products", icon: Box },
  { href: "/landing-page/about", label: "About Us", icon: Info },
  { href: "/landing-page/contact", label: "Contact Us", icon: Phone },
] as const;

function isActivePath(pathname: string | null, href: string) {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function Header() {
  const pathname = usePathname();

  const [dashboardHref, setDashboardHref] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userAvatarUrl, setUserAvatarUrl] = useState<string | null>(null);
  const [mobileNavVisible, setMobileNavVisible] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 10) {
        setMobileNavVisible(false);
      } else {
        setMobileNavVisible(true);
      }
      lastScrollY = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      console.log("Supabase user data:", data);
      if (data.user) {
        const admin = !!data.user.user_metadata?.is_admin;
        setIsAdmin(admin);
        setDashboardHref(admin ? null : "/client/home");
        setUserEmail(data.user.email ?? null);
        setUserAvatarUrl(data.user.user_metadata?.avatar_url ?? null);
      } else {
        setIsAdmin(false);
        setDashboardHref(null);
        setUserEmail(null);
        setUserAvatarUrl(null);
      }
      setAuthLoading(false);
    });
  }, []);

  // Conditional rendering instead of early return
  if (pathname && pathname.startsWith("/credentials")) {
    return null;
  }

  return (
    <>
      <header className="sticky top-0 z-50 overflow-visible border-b border-zinc-200/80 bg-gray-200 shadow-sm backdrop-blur-md px-4 sm:px-6 lg:px-20 text-gray-600">
      <div className="flex h-14 items-center justify-between">
        <Link href="/" className="relative z-10 flex shrink-0 items-center">
          <Image
            src="/favicon.ico"
            alt="SSIT Tech Logo"
            width={120}
            height={120}
            className="absolute -top-6.5 left-0 rounded-lg drop-shadow-md"
            loading="eager"
            style={{ height: "auto", width: "auto" }}
          />
          <div className="w-35" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex lg:items-center lg:justify-between lg:flex-1">
          <nav className="flex items-center gap-1 justify-center flex-1">
            {navLinks.map(({ href, label }) => {
              const active = isActivePath(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative px-3 py-1.5 text-xs font-medium transition-all duration-200 border-b-2 text-gray-600 ${
                    active
                      ? "border-zinc-900"
                      : "border-transparent hover:border-zinc-900"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
          {!authLoading && !isAdmin && (
            <Link
              href={dashboardHref ?? "/credentials/client/login"}
              className="ml-2"
            >
              <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-zinc-300 hover:ring-zinc-900 transition-all">
                <AvatarImage src={userAvatarUrl ?? ""} alt={userEmail ?? "user"} />
                <AvatarFallback className="bg-zinc-900 text-white text-xs font-semibold">
                  {userEmail ? userEmail[0].toUpperCase() : <User className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
            </Link>
          )}
        </div>
      </div>
    </header>

    {/* Mobile bottom navigation */}
    <nav className={`fixed bottom-0 left-0 right-0 z-50 bg-gray-200 border-t border-zinc-200/80 shadow-md px-2 py-2 flex justify-around items-center lg:hidden transition-transform duration-300 ${mobileNavVisible ? "translate-y-0" : "translate-y-full"}`}>
      {/* Home */}
      <Link href="/" className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-all duration-200 ${isActivePath(pathname, "/") ? "text-zinc-900" : "text-gray-500 hover:text-zinc-900"}`}>
        <Home className="w-5 h-5" />
        <span className="text-[10px] font-medium">Home</span>
      </Link>
      {/* Products */}
      <Link href="/landing-page/products" className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-all duration-200 ${isActivePath(pathname, "/landing-page/products") ? "text-zinc-900" : "text-gray-500 hover:text-zinc-900"}`}>
        <Box className="w-5 h-5" />
        <span className="text-[10px] font-medium">Products</span>
      </Link>
      {/* About Us */}
      <Link href="/landing-page/about" className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-all duration-200 ${isActivePath(pathname, "/landing-page/about") ? "text-zinc-900" : "text-gray-500 hover:text-zinc-900"}`}>
        <Info className="w-5 h-5" />
        <span className="text-[10px] font-medium">About</span>
      </Link>
      {/* Contact Us */}
      <Link href="/landing-page/contact" className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-all duration-200 ${isActivePath(pathname, "/landing-page/contact") ? "text-zinc-900" : "text-gray-500 hover:text-zinc-900"}`}>
        <Phone className="w-5 h-5" />
        <span className="text-[10px] font-medium">Contact</span>
      </Link>
      {/* Profile / Sign In */}
      {!authLoading && !isAdmin && (
        <Link
          href={dashboardHref ?? "/credentials/client/login"}
          className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-all duration-200 text-gray-500 hover:text-zinc-900"
        >
          <Avatar className="h-6 w-6 ring-1 ring-zinc-300">
            <AvatarImage src={userAvatarUrl ?? ""} alt={userEmail ?? "user"} />
            <AvatarFallback className="bg-zinc-900 text-white text-[9px] font-semibold">
              {userEmail ? userEmail[0].toUpperCase() : <User className="h-3 w-3" />}
            </AvatarFallback>
          </Avatar>
          <span className="text-[10px] font-medium">{dashboardHref ? "Profile" : "Sign In"}</span>
        </Link>
      )}
    </nav>
    </>
  );
}
