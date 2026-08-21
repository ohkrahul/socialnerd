"use client";

import { useEffect, useState } from "react";
import { featuredEvent as ev } from "@/lib/content";

/**
 * Mobile-only booking bar. Held back until the hero has scrolled past, so it
 * doesn't cover the first thing anyone reads.
 */
export default function StickyCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-ivory/12 bg-ink/95 px-4 py-3 backdrop-blur-md transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="min-w-0 grow">
          <p className="eyebrow text-sage">{ev.seatsRemaining} seats left</p>
          <p className="truncate text-[0.875rem] font-medium text-ivory">
            {ev.title}
          </p>
        </div>
        <a href={ev.meetupUrl} className="btn btn-ivory shrink-0 px-6">
          Reserve — ₹{ev.fee}
        </a>
      </div>
    </div>
  );
}
