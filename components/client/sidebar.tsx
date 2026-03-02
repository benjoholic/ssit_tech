"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
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
  LogOut,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
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

function isActivePath(pathname: string | null, href: string) {
  if (!pathname) return false;
  if (href === "/client/home") return pathname === "/client/home";
  return pathname === href || pathname.startsWith(href + "/");
}

function SidebarNav() {
  const pathname = usePathname();
  const router = useRouter();
  const ctx = useClientSidebar();
  const closeOnNavigate = () => ctx?.setOpen(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  
  // Auto-expand settings if current path is within settings
  const isSettingsPath = pathname?.startsWith("/client/settings") ?? false;
  const [isSettingsOpen, setIsSettingsOpen] = useState(isSettingsPath);

  useEffect(() => {
    if (isSettingsPath) {
      setIsSettingsOpen(true);
    }
  }, [isSettingsPath]);

  const isSettingsActive = isSettingsPath;

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error("Sign out failed", { description: error.message });
        setIsSigningOut(false);
        return;
      }
      
      toast.success("Signed out successfully");
      router.push("/credentials/client/login");
    } catch (error) {
      toast.error("Sign out failed", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
      setIsSigningOut(false);
    }
  };

  return (
    <nav className="flex flex-1 flex-col gap-4 md:gap-3 p-4 md:p-3">
      <div className="flex-1 space-y-3 md:space-y-1">
        <p className="hidden lg:block mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
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
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:shadow-xs active:scale-98"
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

        <p className="hidden lg:block mb-2 mt-6 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
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
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:shadow-xs active:scale-98"
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
            suppressHydrationWarning
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out",
              isSettingsActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:shadow-xs active:scale-98"
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
                    "ml-8 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ease-in-out",
                    active
                      ? "bg-primary/10 text-primary shadow-xs"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:shadow-xs active:scale-98"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden />
                  <span>{label}</span>
                </Link>
              );
            })}
          </CollapsibleContent>
        </Collapsible>
      </div>
      
      {/* Sign Out Button */}
      <div className="mt-auto border-t border-border pt-4 md:pt-3">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
          onClick={handleSignOut}
          disabled={isSigningOut}
        >
          <LogOut className="h-5 w-5 shrink-0" aria-hidden />
          <span className="flex-1 text-left text-sm font-medium">
            {isSigningOut ? "Signing out..." : "Sign Out"}
          </span>
        </Button>
      </div>
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
          className="w-56 border-border bg-card p-0 md:hidden overflow-y-auto"
          showCloseButton={false}
        >
          <SheetTitle className="sr-only">Client navigation</SheetTitle>
          <div className="flex h-full flex-col" aria-label="Client navigation">
            <div className="flex items-center justify-center border-b border-border px-3 py-5 sticky top-0 bg-card/95 backdrop-blur-sm z-10">
              <Link href="/client/home" className="flex items-center transition-opacity hover:opacity-90 animate-logo-bounce">
                <Image
                  src="/images/ssit.png"
                  alt="SSIT Tech Logo"
                  width={80}
                  height={80}
                  className="h-20 w-20 shrink-0 rounded-full object-contain border-2 border-primary/20"
                />
              </Link>
            </div>
            <div className="flex-1 overflow-y-auto p-3 animate-content-fade-in smooth-scroll">
              <SidebarNav />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
