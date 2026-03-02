"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Header } from "@/components/header";
import { ClientHeaderWrapper } from "@/components/client/header-wrapper";
import { AdminHeader } from "@/components/admin/header";
import { ReactElement } from "react";

const NON_LANDING_PREFIXES = ["/admin", "/client", "/unauthenticated"];

export function ConditionalHeader() {
  const pathname = usePathname();

  useEffect(() => {
    console.log("ConditionalHeader pathname:", pathname);
  }, [pathname]);

  // Default to rendering the Header
  let ComponentToRender: ReactElement | null = <Header />;

  if (pathname) {
    const hideHeader = NON_LANDING_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
    );

    if (hideHeader) {
      ComponentToRender = null;
    } else if (pathname.startsWith("/admin")) {
      ComponentToRender = <AdminHeader />;
    } else if (pathname.startsWith("/client")) {
      ComponentToRender = <ClientHeaderWrapper />;
    }
  }

  return ComponentToRender;
}
