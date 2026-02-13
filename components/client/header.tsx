"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useClientSidebar } from "@/components/client/sidebar-context";

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

export function ClientHeader() {
  const { setOpen } = useClientSidebar() ?? { setOpen: undefined };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-card px-4 py-3 shadow-sm md:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {setOpen && (
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 md:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <Link
          href="/client/home"
          className="flex min-w-0 items-center gap-2 transition-opacity hover:opacity-90"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <PaperPlaneLogo className="h-5 w-5" />
          </span>
          <span className="truncate text-lg font-bold uppercase tracking-tight text-foreground">
            SSIT TECH
          </span>
          <span className="hidden shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary sm:inline-block">
            Client
          </span>
        </Link>
      </div>
    </header>
  );
}
