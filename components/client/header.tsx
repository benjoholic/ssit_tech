"use client";

import Link from "next/link";
import { useClientSidebar } from "@/components/client/sidebar-context";
import Image from "next/image";
import { LayoutDashboard } from "lucide-react";

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

interface ClientHeaderProps {
  userEmail?: string;
  userName?: string;
  userAvatar?: string;
  userCompany?: string;
  userPhone?: string;
  userLocation?: string;
  emailVerified?: boolean;
}

export function ClientHeader({ 
  userEmail, 
  userName, 
  userAvatar,
  userCompany,
  userPhone,
  userLocation,
  emailVerified = false,
}: ClientHeaderProps) {
  const { setOpen } = useClientSidebar() ?? { setOpen: undefined };

  // Get initials from name or email
  const getInitials = () => {
    if (userName) {
      return userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (userEmail) {
      return userEmail.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  return (
    <header className="sticky top-0 z-50 overflow-visible border-b border-zinc-200/80 bg-white shadow-sm">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">
        <Link href="/" className="relative z-10 flex shrink-0 items-center">
          <Image
            src="/images/ssit.png"
            alt="SSIT Tech Logo"
            width={120}
            height={120}
            className="absolute -top-6.5 left-0 rounded-lg drop-shadow-md"
            loading="eager"
            style={{ height: "auto" }}
          />
          <div className="w-35" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {/* Removed all buttons and links */}
        </nav>
      </div>
    </header>
  );
}
