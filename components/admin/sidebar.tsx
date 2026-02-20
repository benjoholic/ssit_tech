"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Users,
  FileCheck,
  Package,
  Settings,
  ChevronDown,
  LogOut,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { useAdminSidebar } from "@/components/admin/sidebar-context";
import type { CategoryEntry } from "@/lib/products";

const PRODUCTS_PATH = "/admin/products";

const adminNavSections = [
  {
    label: "Overview",
    links: [
      { href: "/admin/home", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "System",
    links: [
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
] as const;

function isActivePath(pathname: string, href: string) {
  if (href === "/admin/home") return pathname === "/admin/home";
  return pathname === href || pathname.startsWith(href + "/");
}

function parseCategoriesFromUrl(searchParams: ReturnType<typeof useSearchParams>): string[] {
  const raw = searchParams.get("categories");
  if (!raw?.trim()) return [];
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}

function AdminSidebarNav({ categories }: { categories: CategoryEntry[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const setOpen = useAdminSidebar()?.setOpen;
  const closeOnNavigate = () => setOpen?.(false);
  const [signingOut, setSigningOut] = useState(false);

  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => a.label.localeCompare(b.label)),
    [categories],
  );

  const isProductsPath = pathname === PRODUCTS_PATH;
  const [isProductsOpen, setIsProductsOpen] = useState(isProductsPath);
  const selectedCategories = parseCategoriesFromUrl(searchParams);
  const isClientsPath = pathname === "/admin/clients" || pathname.startsWith("/admin/clients/");

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      const supabase = createClient();
      
      // Sign out from Supabase - this clears the session from cookies and auth state
      await supabase.auth.signOut();
      
      toast.success("Signed out successfully");
      // Redirect to login page
      router.push("/credentials/admin/login");
    } catch (error) {
      console.error("Error during sign out:", error);
      toast.error("Sign out failed", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
      setSigningOut(false);
    }
  };

  useEffect(() => {
    if (isProductsPath) setIsProductsOpen(true);
  }, [isProductsPath]);

  const toggleCategory = useCallback(
    (categoryId: string) => (checked: boolean | "indeterminate") => {
      const current = parseCategoriesFromUrl(searchParams);
      const next = checked === true
        ? (current.includes(categoryId) ? current : [...current, categoryId])
        : current.filter((c) => c !== categoryId);
      const query = next.length > 0 ? `?categories=${next.join(",")}` : "";
      router.push(`${PRODUCTS_PATH}${query}`);
    },
    [router, searchParams]
  );

  return (
    <nav className="flex flex-1 flex-col gap-4 md:gap-6 lg:gap-5 p-4 md:p-3 lg:p-2" aria-label="Admin navigation">
      {/* Overview */}
      <div className="space-y-2">
        <p className="hidden lg:block mb-1.5 px-3 text-[11px] lg:text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Overview
        </p>
        <ul className="space-y-1 md:space-y-0.5">
          {adminNavSections[0].links.map(({ href, label, icon: Icon }) => {
            const active = isActivePath(pathname, href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={closeOnNavigate}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 md:px-3 md:py-2 lg:px-2 lg:py-1.5 text-sm md:text-sm lg:text-xs font-medium transition-all duration-200 ease-in-out",
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground hover:shadow-xs active:scale-98"
                  )}
                >
                  <Icon className="h-4 w-4 lg:h-3.5 lg:w-3.5 shrink-0" aria-hidden />
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Clients/Partners */}
      <div className="space-y-2">
        <p className="hidden lg:block mb-1.5 px-3 text-[11px] lg:text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Clients & Partners
        </p>
        <ul className="space-y-1 md:space-y-0.5">
          <li>
            <Link
              href="/admin/clients"
              onClick={closeOnNavigate}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 md:px-3 md:py-2 lg:px-2 lg:py-1.5 text-sm md:text-sm lg:text-xs font-medium transition-all duration-200 ease-in-out",
                isClientsPath
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground hover:shadow-xs active:scale-98"
              )}
            >
              <Users className="h-4 w-4 lg:h-3.5 lg:w-3.5 shrink-0" aria-hidden />
              <span>Clients/Partners</span>
            </Link>
          </li>
        </ul>
      </div>

      {/* Products (dropdown with checkboxes) */}
      <div suppressHydrationWarning className="space-y-2">
        <p className="hidden lg:block mb-1.5 px-3 text-[11px] lg:text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Products
        </p>
        <Collapsible open={isProductsOpen} onOpenChange={setIsProductsOpen}>
          <CollapsibleTrigger
            suppressHydrationWarning
            onClick={() => {
              if (!isProductsOpen) router.push(PRODUCTS_PATH);
            }}
            className={cn(
              "flex w-full items-center gap-3 rounded-md px-3 py-2 md:px-3 md:py-2 lg:px-2 lg:py-1.5 text-sm md:text-sm lg:text-xs font-medium transition-all duration-200 ease-in-out",
              isProductsPath
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground hover:shadow-xs active:scale-98"
            )}
          >
            <Package className="h-4 w-4 lg:h-3.5 lg:w-3.5 shrink-0" aria-hidden />
            <span className="flex-1 text-left">Products</span>
            <ChevronDown
              className={cn("h-4 w-4 lg:h-3.5 lg:w-3.5 shrink-0 transition-transform duration-200", isProductsOpen && "rotate-180")}
              aria-hidden
            />
          </CollapsibleTrigger>
          <CollapsibleContent suppressHydrationWarning className="mt-1 space-y-1 md:mt-0.5 md:space-y-0.5">
            {categories.length === 0 ? (
              <p className="px-3 py-2 text-xs text-muted-foreground/60">No categories</p>
            ) : (
              sortedCategories.map(({ name, label }) => {
                const checked = selectedCategories.includes(name);
                return (
                  <div
                    key={name}
                    className="flex items-center gap-2 rounded-md px-3 py-2 md:px-3 md:py-2 lg:px-2 lg:py-1.5 transition-all duration-200 hover:bg-muted/60"
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={toggleCategory(name)}
                      onClick={(e) => e.stopPropagation()}
                      onPointerDown={(e) => e.stopPropagation()}
                      className="shrink-0 border-foreground/40 bg-background"
                      aria-label={`Filter by ${label}`}
                    />
                    <span className="truncate py-0.5 text-sm lg:text-xs font-medium text-muted-foreground">
                      {label}
                    </span>
                  </div>
                );
              })
            )}
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* System */}
      <div className="space-y-2">
        <p className="hidden lg:block mb-1.5 px-3 text-[11px] lg:text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          System
        </p>
        <ul className="space-y-1 md:space-y-0.5">
          {adminNavSections[1].links.map(({ href, label, icon: Icon }) => {
            const active = isActivePath(pathname, href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={closeOnNavigate}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 md:px-3 md:py-2 lg:px-2 lg:py-1.5 text-sm md:text-sm lg:text-xs font-medium transition-all duration-200 ease-in-out",
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground hover:shadow-xs active:scale-98"
                  )}
                >
                  <Icon className="h-4 w-4 lg:h-3.5 lg:w-3.5 shrink-0" aria-hidden />
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Sign Out */}
      <div className="mt-auto border-t border-border pt-4 md:pt-3 lg:pt-2">
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 md:px-3 md:py-2 lg:px-2 lg:py-1.5 text-sm md:text-sm lg:text-xs font-medium text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground disabled:opacity-70"
        >
          {signingOut ? (
            <Loader2 className="h-4 w-4 lg:h-3.5 lg:w-3.5 shrink-0 animate-spin" aria-hidden />
          ) : (
            <LogOut className="h-4 w-4 lg:h-3.5 lg:w-3.5 shrink-0" aria-hidden />
          )}
          <span>{signingOut ? "Signing out..." : "Sign out"}</span>
        </button>
      </div>
    </nav>
  );
}

export function AdminSidebar({
  initialCategories = [],
  userEmail = null,
}: {
  initialCategories?: CategoryEntry[];
  userEmail?: string | null;
}) {
  const ctx = useAdminSidebar();
  const open = ctx?.open ?? false;
  const setOpen = ctx?.setOpen ?? (() => {});

  return (
    <>
      <aside
        className="hidden h-full w-52 shrink-0 flex-col overflow-y-auto border-r border-border bg-card md:flex"
        aria-label="Admin navigation"
      >
        <Suspense fallback={null}>
          <AdminSidebarNav categories={initialCategories} />
        </Suspense>
      </aside>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className="w-52 border-border bg-card p-0 md:hidden overflow-y-auto"
          showCloseButton={false}
        >
          <SheetTitle className="sr-only">Admin navigation</SheetTitle>
          <div className="flex h-full flex-col" aria-label="Admin navigation">
            <div className="flex flex-col items-center justify-center border-b border-border px-3 py-5 sticky top-0 bg-card/95 backdrop-blur-sm z-10 space-y-3">
              <Link href="/admin/home" className="flex items-center transition-opacity hover:opacity-90 animate-logo-bounce">
                <Image
                  src="/images/ssit.png"
                  alt="SSIT Tech Logo"
                  width={80}
                  height={80}
                  className="h-20 w-20 shrink-0 rounded-full object-contain border-2 border-primary/20"
                />
              </Link>
              <div className="flex flex-col items-center space-y-2 animate-content-fade-in">
                <span className="inline-block bg-primary/10 text-primary px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide animate-subtle-pulse">
                  Admin Panel
                </span>
                {userEmail && (
                  <p className="text-center text-xs text-muted-foreground truncate max-w-[140px]">
                    {userEmail}
                  </p>
                )}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-3 animate-content-fade-in smooth-scroll">
              <Suspense fallback={null}>
                <AdminSidebarNav categories={initialCategories} />
              </Suspense>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
