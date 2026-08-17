"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
  const headerRef = useRef<HTMLElement>(null);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  /* Now that the menu covers the page instead of pushing it, it needs the
     usual ways out of a thing that covers the page. Tapping a link already
     closes it, so this only handles Escape and a tap on the content behind. */
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <header ref={headerRef} className="relative z-30 py-6">
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

      {/* Overlays the page rather than sitting in the flow. As an in-flow block
          it pushed everything below it down by ~190px the instant it opened,
          which on a phone reads as the page lurching rather than as a menu. */}
      {open ? (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="border-line/30 bg-bg absolute inset-x-0 top-full z-30 border-y sm:hidden"
        >
          <ul className="container-page flex flex-col gap-4 py-4">
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
