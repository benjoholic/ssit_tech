"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { Bell, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminSidebar } from "@/components/admin/sidebar-context";

const MOCK_NOTIFICATIONS = [
  {
    id: "1",
    title: "New client application",
    message: "Acme Motors has submitted an application for approval.",
    time: "2 min ago",
    unread: true,
  },
  {
    id: "2",
    title: "Credential expiring soon",
    message: "3 client credentials will expire in the next 7 days.",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: "3",
    title: "System update completed",
    message: "Scheduled maintenance finished successfully.",
    time: "Yesterday",
    unread: false,
  },
  {
    id: "4",
    title: "New message",
    message: "A client has requested support for account access.",
    time: "2 days ago",
    unread: false,
  },
] as const;

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

export function AdminHeader() {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const adminSidebar = useAdminSidebar();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target as Node)
      ) {
        setNotificationsOpen(false);
      }
    }
    if (notificationsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notificationsOpen]);

  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => n.unread).length;

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between gap-4 border-b border-border bg-card px-4 py-3 shadow-sm md:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <Link
          href="/admin/home"
          className="flex min-w-0 items-center gap-2 transition-opacity hover:opacity-90"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <PaperPlaneLogo className="h-5 w-5" />
          </span>
          <span className="truncate text-lg font-bold uppercase tracking-tight text-foreground">
            SSIT TECH
          </span>
          <span className="hidden shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary sm:inline-block">
            Admin
          </span>
        </Link>
      </div>
      <div className="hidden flex-1 justify-center px-2 sm:flex">
        <label htmlFor="admin-header-search" className="sr-only">
          Search
        </label>
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            id="admin-header-search"
            type="search"
            placeholder="Search…"
            className="w-full rounded-full border border-input bg-muted/50 py-2 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>
      <nav className="flex min-w-0 flex-1 justify-end items-center gap-2">
        <div className="relative" ref={notificationRef}>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 relative"
            aria-label="Notifications"
            aria-expanded={notificationsOpen}
            aria-haspopup="true"
            onClick={() => setNotificationsOpen((open) => !open)}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Button>
          {notificationsOpen && (
            <div
              className="absolute right-0 top-full z-50 mt-1.5 w-[320px] max-w-[calc(100vw-2rem)] rounded-lg border border-border bg-card py-1 shadow-lg"
              role="menu"
            >
              <div className="border-b border-border px-3 py-2">
                <p className="text-sm font-semibold text-foreground">Notifications</p>
                {unreadCount > 0 && (
                  <p className="text-xs text-muted-foreground">{unreadCount} unread</p>
                )}
              </div>
              <ul className="max-h-[360px] overflow-y-auto">
                {MOCK_NOTIFICATIONS.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={`flex w-full flex-col gap-0.5 px-3 py-2.5 text-left transition-colors hover:bg-muted/50 ${
                        item.unread ? "bg-muted/30" : ""
                      }`}
                      onClick={() => setNotificationsOpen(false)}
                    >
                      <span className="text-sm font-medium text-foreground">
                        {item.title}
                      </span>
                      <span className="text-xs text-muted-foreground line-clamp-2">
                        {item.message}
                      </span>
                      <span className="text-xs text-muted-foreground/80">{item.time}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {adminSidebar && (
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 md:hidden"
            aria-label="Open menu"
            onClick={() => adminSidebar.setOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
      </nav>
    </header>
  );
}
