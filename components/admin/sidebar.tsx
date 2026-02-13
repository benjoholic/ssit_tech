"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import {
  LayoutDashboard,
  Users,
  FileCheck,
  Package,
  Camera,
  Wifi,
  Network,
  Settings,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { useAdminSidebar } from "@/components/admin/sidebar-context";

const PRODUCT_CATEGORIES = [
  { id: "cctv" as const, label: "CCTV", icon: Camera },
  { id: "access_point" as const, label: "Access point", icon: Wifi },
  { id: "switch" as const, label: "Switch", icon: Network },
] as const;

const PRODUCTS_PATH = "/admin/products";

const adminNavSections = [
  {
    label: "Overview",
    links: [
      { href: "/admin/home", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Dealers",
    links: [
      { href: "/admin/dealers", label: "All dealers", icon: Users },
      { href: "/admin/dealers/applications", label: "Applications", icon: FileCheck },
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

function AdminSidebarNav() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const setOpen = useAdminSidebar()?.setOpen;
  const closeOnNavigate = () => setOpen?.(false);

  const isProductsPath = pathname === PRODUCTS_PATH;
  const [isProductsOpen, setIsProductsOpen] = useState(isProductsPath);
  const selectedCategories = parseCategoriesFromUrl(searchParams);

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
    <nav className="flex flex-1 flex-col gap-6 p-3" aria-label="Admin navigation">
      {/* Overview */}
      <div>
        <p className="mb-1.5 px-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Overview
        </p>
        <ul className="space-y-0.5">
          {adminNavSections[0].links.map(({ href, label, icon: Icon }) => {
            const active = isActivePath(pathname, href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={closeOnNavigate}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden />
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Dealers */}
      <div>
        <p className="mb-1.5 px-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Dealers
        </p>
        <ul className="space-y-0.5">
          {adminNavSections[1].links.map(({ href, label, icon: Icon }) => {
            const active = isActivePath(pathname, href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={closeOnNavigate}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden />
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Products (dropdown with checkboxes) */}
      <div>
        <p className="mb-1.5 px-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Products
        </p>
        <Collapsible open={isProductsOpen} onOpenChange={setIsProductsOpen}>
          <CollapsibleTrigger
            onClick={() => {
              if (!isProductsOpen) router.push(PRODUCTS_PATH);
            }}
            className={cn(
              "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isProductsPath
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Package className="h-4 w-4 shrink-0" aria-hidden />
            <span className="flex-1 text-left">Products</span>
            <ChevronDown
              className={cn("h-4 w-4 shrink-0 transition-transform duration-200", isProductsOpen && "rotate-180")}
              aria-hidden
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-0.5 space-y-0.5">
            {PRODUCT_CATEGORIES.map(({ id, label, icon: Icon }) => {
              const checked = selectedCategories.includes(id);
              return (
                <div
                  key={id}
                  className="flex items-center gap-2 rounded-md px-3 py-2 transition-colors"
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={toggleCategory(id)}
                    onClick={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="shrink-0"
                    aria-label={`Filter by ${label}`}
                  />
                  <span className="flex min-w-0 flex-1 items-center gap-3 py-0.5 text-sm font-medium text-muted-foreground">
                    <Icon className="h-4 w-4 shrink-0" aria-hidden />
                    <span className="truncate">{label}</span>
                  </span>
                </div>
              );
            })}
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* System */}
      <div>
        <p className="mb-1.5 px-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          System
        </p>
        <ul className="space-y-0.5">
          {adminNavSections[2].links.map(({ href, label, icon: Icon }) => {
            const active = isActivePath(pathname, href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={closeOnNavigate}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden />
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

export function AdminSidebar() {
  const ctx = useAdminSidebar();
  const open = ctx?.open ?? false;
  const setOpen = ctx?.setOpen ?? (() => {});

  return (
    <>
      <aside
        className="hidden h-full w-52 shrink-0 flex-col border-r border-border bg-card md:flex"
        aria-label="Admin navigation"
      >
        <AdminSidebarNav />
      </aside>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className="w-52 border-border bg-card p-0 md:hidden"
          showCloseButton={true}
        >
          <SheetTitle className="sr-only">Admin navigation</SheetTitle>
          <div className="flex h-full flex-col pt-14" aria-label="Admin navigation">
            <AdminSidebarNav />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
