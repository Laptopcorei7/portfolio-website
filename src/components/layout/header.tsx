"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogoMark } from "@/components/ui/icons";
import { profile } from "@/content/site";

/**
 * Nav labels carry a `#` prefix, matching the mockups. The language switcher
 * from the design is intentionally omitted — the site is English-only.
 */
const navLinks = [
  { label: "home", href: "/" },
  { label: "works", href: "/works" },
  { label: "about-me", href: "/about-me" },
  { label: "contacts", href: "/contacts" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="relative z-30 py-6">
      <div className="container-page flex items-center justify-between">
        <Link
          href="/"
          className="text-heading flex items-center gap-2 text-base font-medium"
        >
          <LogoMark className="h-4 w-4" />
          {profile.shortName}
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Main" className="hidden sm:block">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`hover:text-heading text-base transition-colors ${
                      active ? "text-heading" : "text-body"
                    }`}
                  >
                    <span aria-hidden="true" className="text-accent">
                      #
                    </span>
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="text-heading sm:hidden"
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="border-line/30 container-page mt-4 border-t sm:hidden"
        >
          <ul className="flex flex-col gap-4 py-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={`text-base ${
                    isActive(link.href) ? "text-heading" : "text-body"
                  }`}
                >
                  <span aria-hidden="true" className="text-accent">
                    #
                  </span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
