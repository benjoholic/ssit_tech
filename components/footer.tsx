import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";

function PaperPlaneLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
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

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-200 bg-white pb-20 lg:pb-0">
      <div className="mx-auto max-w-6xl px-6 py-12 md:px-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-white">
                <PaperPlaneLogo className="h-5 w-5" />
              </span>
              <span className="text-base font-bold uppercase tracking-tight text-zinc-900">
                SSIT Tech
              </span>
            </div>
            <p className="text-sm leading-relaxed text-zinc-500">
              Your trusted partner for premium networking, surveillance, and
              communication solutions tailored for businesses of all sizes.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition hover:border-zinc-900 hover:text-zinc-900"
                aria-label="Facebook"
              >
                <Facebook className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition hover:border-zinc-900 hover:text-zinc-900"
                aria-label="Twitter"
              >
                <Twitter className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition hover:border-zinc-900 hover:text-zinc-900"
                aria-label="Instagram"
              >
                <Instagram className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition hover:border-zinc-900 hover:text-zinc-900"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-900">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: "Home", href: "/" },
                { label: "Products", href: "/landing-page/products" },
                { label: "About Us", href: "/landing-page/about" },
                { label: "Contact Us", href: "/landing-page/contact" },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-zinc-500 transition hover:text-zinc-900"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-900">
              Account
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: "Client Login", href: "/credentials/client/login" },
                { label: "Sign Up", href: "/credentials/client/signup" },

                {
                  label: "Forgot Password",
                  href: "/credentials/client/forgot-password",
                },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-zinc-500 transition hover:text-zinc-900"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-900">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
                <span className="text-sm text-zinc-500">
                  Cebu City, Philippines
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-zinc-400" />
                <a
                  href="tel:+63000000000"
                  className="text-sm text-zinc-500 transition hover:text-zinc-900"
                >
                  +63 000 000 0000
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-zinc-400" />
                <a
                  href="mailto:info@ssittech.com"
                  className="text-sm text-zinc-500 transition hover:text-zinc-900"
                >
                  info@ssittech.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-zinc-200 pt-6 sm:flex-row">
          <p className="text-xs text-zinc-400">
            © {year} SSIT Tech. All rights reserved.
          </p>
          <p className="text-xs text-zinc-400">
            Built with care for our clients and partners.
          </p>
        </div>
      </div>
    </footer>
  );
}
