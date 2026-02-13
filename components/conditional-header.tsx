"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/header";
import { ClientHeader } from "@/components/client/header";
import { AdminHeader } from "@/components/admin/header";

const NO_HEADER_PATHS = [
  "/credentials/admin/login",
  "/credentials/admin/forgot-password",
  "/credentials/dealer/login",
  "/credentials/dealer/signup",
  "/credentials/dealer/forgot-password",
  "/unauthenticated",
];

export function ConditionalHeader() {
  const pathname = usePathname();
  const hideHeader = NO_HEADER_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );

  if (hideHeader) return null;
  if (pathname.startsWith("/admin")) return <AdminHeader />;
  if (pathname.startsWith("/client")) return <ClientHeader />;
  return <Header />;
}
