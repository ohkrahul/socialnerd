"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { siteMeta } from "@/lib/content";
import { signOut } from "./actions";

const links = [
  { href: "/admin", label: "Events" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/settings", label: "Settings" },
  { href: "/admin/subscribers", label: "Notify list" },
  { href: "/", label: "View site ↗" },
];

/**
 * Admin chrome. Inline links from lg up, a hamburger below it.
 *
 * The previous version tried to fit the logo and five links on one row, which
 * on a phone ran off the edge — and since body sets overflow-x: hidden, the
 * overflow was clipped rather than scrollable, so two links were simply
 * unreachable. A horizontal scroller fixed the reachability but still left the
 * page pannable. A panel avoids both.
 */
export default function AdminNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // A panel over the whole viewport should not leave the page behind it
  // scrolling under the thumb.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const isActive = (href) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href) && href !== "/";

  return (
    <>
      <div className="shell flex items-center justify-between gap-6 py-4 lg:py-5">
        <Link href="/admin" className="flex min-w-0 items-center gap-2.5">
          <Image
            src={siteMeta.logo}
            alt=""
            width={32}
            height={32}
            className="h-8 w-8 shrink-0 rounded-md"
          />
          <span className="display truncate text-xl">
            Social Nerds<span className="text-sage">.</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Admin">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`flex min-h-11 items-center rounded-md px-3 text-[0.875rem] font-medium whitespace-nowrap transition-colors hover:bg-ivory/8 hover:text-ivory ${
                isActive(link.href) ? "t-fg bg-ivory/8" : "t-dim"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <form action={signOut}>
            <button type="submit" className="btn-row">
              Sign out
            </button>
          </form>
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open admin menu"
          aria-expanded={open}
          className="flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-[5px] lg:hidden"
        >
          <span className="block h-px w-6 bg-ivory" />
          <span className="block h-px w-6 bg-ivory" />
          <span className="block h-px w-6 bg-ivory" />
        </button>
      </div>

      {/* Panel. Kept mounted so it can transition, and made inert when closed so
          its links stay out of the tab order. */}
      <div
        className={`ground-ink fixed inset-0 z-[80] transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
      >
        <div className="shell flex h-full flex-col py-4">
          <div className="flex items-center justify-between gap-6">
            <span className="display truncate text-xl">
              Social Nerds<span className="text-sage">.</span>
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close admin menu"
              className="flex h-11 w-11 items-center justify-center text-3xl leading-none"
            >
              &times;
            </button>
          </div>

          <nav className="mt-8 flex flex-col" aria-label="Admin">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                tabIndex={open ? undefined : -1}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`edge flex min-h-14 items-center border-b text-[1.05rem] font-medium ${
                  isActive(link.href) ? "t-fg" : "t-dim"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <form action={signOut} className="mt-auto">
            <button
              type="submit"
              tabIndex={open ? undefined : -1}
              className="btn btn-ivory w-full justify-center"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
