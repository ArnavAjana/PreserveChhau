"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/ebook", label: "eBook" },
  { href: "/experience", label: "3D Studies" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-laterite-900/10 bg-ivory/95 backdrop-blur-xl">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex min-h-[4.25rem] max-w-6xl items-center justify-between px-6"
      >
        <Link
          href="/"
          className="font-display text-xl font-semibold tracking-tight text-ink"
        >
          Preserve<span className="text-marigold-600">Chhau</span>
        </Link>

        <ul className="hidden items-center gap-7 sm:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`rounded-sm py-2 text-sm font-semibold transition-colors hover:text-laterite-700 ${
                  isActive(link.href)
                    ? "text-laterite-700 underline decoration-marigold-400 decoration-2 underline-offset-8"
                    : "text-midnight-900"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-lg text-ink hover:bg-laterite-100 sm:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
          ref={menuButtonRef}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <ul
          id="mobile-menu"
          className="border-t border-laterite-900/10 bg-ivory px-6 pb-4 sm:hidden"
        >
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={`block rounded-sm py-3 text-sm font-semibold ${
                  isActive(link.href) ? "text-laterite-700" : "text-midnight-900"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
