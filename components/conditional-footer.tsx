"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/footer";

const LANDING_PREFIXES = ["/", "/landing-page"];
const NON_LANDING_PREFIXES = ["/admin", "/client", "/credentials", "/unauthenticated"];

export function ConditionalFooter() {
  const pathname = usePathname();

  const isNonLanding = NON_LANDING_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
  if (isNonLanding) return null;

  const isLanding = LANDING_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
  if (!isLanding) return null;

  return <Footer />;
}
