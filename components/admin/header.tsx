"use client";

import Link from "next/link";
import Image from "next/image";
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

export function AdminHeader() {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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
    <header className="sticky top-0 z-50 flex items-center justify-between gap-4 border-b border-border bg-card px-4 py-3 lg:px-3 lg:py-2 shadow-sm md:px-6 lg:md:px-4">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <Link
          href="/admin/home"
          className="flex items-center transition-opacity hover:opacity-90"
        >
          <Image 
            src="/images/ssit.png" 
            alt="SSIT Tech Logo" 
            width={48} 
            height={48}
            className="h-12 w-12 lg:h-10 lg:w-10 shrink-0 rounded-lg object-contain scale-150 lg:scale-100"
          />
        </Link>
      </div>
      <div className="hidden flex-1 justify-center px-2 sm:flex">
        <label htmlFor="admin-header-search" className="sr-only">
          Search
        </label>
        <div className="relative w-full max-w-md lg:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 lg:h-3.5 lg:w-3.5 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            id="admin-header-search"
            type="search"
            placeholder="Search…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-full border border-input bg-muted/50 py-2 lg:py-1.5 pl-9 lg:pl-8 pr-14 text-sm lg:text-xs placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
          />
          {searchTerm.trim().length > 0 && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-2.5 lg:right-2 top-1/2 -translate-y-1/2 rounded-full px-2 py-0.5 text-[10px] lg:text-[9px] font-medium text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              Clear
            </button>
          )}
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
            <Bell className="h-5 w-5 lg:h-4 lg:w-4" />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 lg:h-3.5 lg:min-w-3.5 items-center justify-center rounded-full bg-primary px-1 text-[10px] lg:text-[9px] font-semibold text-primary-foreground">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Button>
          {notificationsOpen && (
            <div
              className="absolute right-0 top-full z-50 mt-1.5 lg:mt-1 w-[320px] max-w-[calc(100vw-2rem)] rounded-lg border border-border bg-card py-1 shadow-lg"
            >
              <div className="border-b border-border px-3 py-2 lg:px-2.5 lg:py-1.5">
                <p className="text-sm lg:text-xs font-semibold text-foreground">Notifications</p>
                {unreadCount > 0 && (
                  <p className="text-xs lg:text-[10px] text-muted-foreground">{unreadCount} unread</p>
                )}
              </div>
              <ul className="max-h-[360px] overflow-y-auto">
                {MOCK_NOTIFICATIONS.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={`flex w-full flex-col gap-0.5 px-3 py-2.5 lg:px-2.5 lg:py-2 text-left transition-colors hover:bg-muted/50 ${
                        item.unread ? "bg-muted/30" : ""
                      }`}
                      onClick={() => setNotificationsOpen(false)}
                    >
                      <span className="text-sm lg:text-xs font-medium text-foreground">
                        {item.title}
                      </span>
                      <span className="text-xs lg:text-[10px] text-muted-foreground line-clamp-2">
                        {item.message}
                      </span>
                      <span className="text-xs lg:text-[10px] text-muted-foreground/80">{item.time}</span>
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
            className="shrink-0 md:hidden lg:h-9 lg:w-9"
            aria-label="Open menu"
            onClick={() => adminSidebar.setOpen(true)}
          >
            <Menu className="h-5 w-5 lg:h-4 lg:w-4" />
          </Button>
        )}
      </nav>
    </header>
  );
}
