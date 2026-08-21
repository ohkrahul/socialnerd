"use client";

import { useEffect, useState } from "react";
import { siteMeta } from "@/lib/content";

/**
 * Mobile-only action bar. Held back until the hero has scrolled past, so it
 * never covers the first thing anyone reads.
 *
 * With no event scheduled it points at the notify form rather than inventing
 * something to book. When an event is live it links straight to the Meetup
 * RSVP, since that is where a seat is actually claimed.
 */
export default function StickyCta({ event = null }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const bookable =
    event &&
    event.seatsRemaining !== 0 &&
    event.status !== "cancelled" &&
    event.meetupStatus !== "cancelled";

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-ivory/12 bg-ink/95 px-4 py-3 backdrop-blur-md transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="min-w-0 grow">
          <p className="eyebrow text-sage">
            {bookable
              ? `${event.seatsRemaining ?? ""} seats left`.trim()
              : "No date yet"}
          </p>
          <p className="truncate text-[0.875rem] font-medium text-ivory">
            {bookable ? event.title : "Hear about the next conversation"}
          </p>
        </div>

        {bookable ? (
          <a
            href={event.meetupUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ivory shrink-0 px-6"
          >
            RSVP — ₹{event.feeInr ?? siteMeta.fee}
          </a>
        ) : (
          <a href="#conversations" className="btn btn-ivory shrink-0 px-6">
            Tell me
          </a>
        )}
      </div>
    </div>
  );
}
