"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  MessageSquare,
  User,
  Settings,
  ChevronRight,
  ChevronDown,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useClientSidebar } from "@/components/client/sidebar-context";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const clientSidebarLinks = [
  { href: "/client/home", label: "Dashboard", icon: LayoutDashboard },
  { href: "/client/orders", label: "Orders", icon: ShoppingCart },
  { href: "/client/products", label: "Products", icon: Package },
  { href: "/client/messages", label: "Messages", icon: MessageSquare },
] as const;

const clientSidebarFooterLinks = [
  { href: "/client/profile", label: "Profile", icon: User },
] as const;

const settingsSubLinks = [
  { href: "/client/settings", label: "General", icon: Settings },
  { href: "/client/settings/status", label: "Account Status", icon: Activity },
] as const;

function isActivePath(pathname: string, href: string) {
  if (href === "/client/home") return pathname === "/client/home";
  return pathname === href || pathname.startsWith(href + "/");
}

function SidebarNav() {
  const pathname = usePathname();
  const ctx = useClientSidebar();
  const closeOnNavigate = () => ctx?.setOpen(false);
  
  // Auto-expand settings if current path is within settings
  const isSettingsPath = pathname.startsWith("/client/settings");
  const [isSettingsOpen, setIsSettingsOpen] = useState(isSettingsPath);

  useEffect(() => {
    if (isSettingsPath) {
      setIsSettingsOpen(true);
    }
  }, [isSettingsPath]);

  const isSettingsActive = isSettingsPath;

  return (
    <nav className="flex flex-1 flex-col gap-1 p-3">
      <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Main
      </p>
      {clientSidebarLinks.map(({ href, label, icon: Icon }) => {
        const active = isActivePath(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            onClick={closeOnNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Icon className="h-5 w-5 shrink-0" aria-hidden />
            <span className="flex-1">{label}</span>
            <ChevronRight
              className={cn("h-4 w-4 shrink-0", !active && "opacity-50")}
              aria-hidden
            />
          </Link>
        );
      })}

      <p className="mb-2 mt-6 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Account
      </p>
      {clientSidebarFooterLinks.map(({ href, label, icon: Icon }) => {
        const active = isActivePath(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            onClick={closeOnNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Icon className="h-5 w-5 shrink-0" aria-hidden />
            <span className="flex-1">{label}</span>
            <ChevronRight
              className={cn("h-4 w-4 shrink-0", !active && "opacity-50")}
              aria-hidden
            />
          </Link>
        );
      })}

      {/* Expandable Settings */}
      <Collapsible open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <CollapsibleTrigger
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            isSettingsActive
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <Settings className="h-5 w-5 shrink-0" aria-hidden />
          <span className="flex-1 text-left">Settings</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 transition-transform duration-200",
              isSettingsOpen && "rotate-180",
              !isSettingsActive && "opacity-50"
            )}
            aria-hidden
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-1 space-y-1">
          {settingsSubLinks.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={closeOnNavigate}
                className={cn(
                  "ml-8 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden />
                <span>{label}</span>
              </Link>
            );
          })}
        </CollapsibleContent>
      </Collapsible>
    </nav>
  );
}

export function ClientSidebar() {
  const ctx = useClientSidebar();
  const open = ctx?.open ?? false;
  const setOpen = ctx?.setOpen ?? (() => {});

  return (
    <>
      {/* Desktop: always-visible fixed sidebar */}
      <aside
        className="hidden h-full w-56 shrink-0 flex-col border-r border-border bg-card md:flex"
        aria-label="Client navigation"
      >
        <SidebarNav />
      </aside>

      {/* Mobile: sheet overlay */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className="w-56 border-border bg-card p-0 md:hidden"
          showCloseButton={true}
        >
          <SheetTitle className="sr-only">Client navigation</SheetTitle>
          <div className="flex h-full flex-col pt-12" aria-label="Client navigation">
            <SidebarNav />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
