"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/header";
import { ClientHeaderWrapper } from "@/components/client/header-wrapper";
import { AdminHeader } from "@/components/admin/header";

const NO_HEADER_PATHS = [
  "/credentials/admin/login",
  "/credentials/admin/forgot-password",
  "/credentials/client/login",
  "/credentials/client/signup",
  "/credentials/client/forgot-password",
  "/credentials/client/reset-password",
  "/credentials/retailer/login",
  "/credentials/retailer/signup",
  "/credentials/retailer/forgot-password",
  "/credentials/retailer/reset-password",
  "/unauthenticated",
];

export function ConditionalHeader() {
  const pathname = usePathname();
  const hideHeader = NO_HEADER_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );

  if (hideHeader) return null;
  if (pathname.startsWith("/admin")) return <AdminHeader />;
  if (pathname.startsWith("/client")) return <ClientHeaderWrapper />;
  return <Header />;
}
