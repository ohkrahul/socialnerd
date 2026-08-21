"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { featuredEvent as ev } from "@/lib/content";
import Magnetic from "./Magnetic";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const details = [
  ["Date", ev.date],
  ["Time", ev.time],
  ["Venue", ev.venue],
  ["Entry", `₹${ev.fee}`],
  ["Host", ev.host],
];

export default function UpcomingEvent() {
  const root = useRef(null);
  const poster = useRef(null);

  useGSAP(
    () => {
      // Seats bar fills to the real ratio when the section arrives.
      const taken = ev.capacity - ev.seatsRemaining;
      gsap.fromTo(
        "[data-seats-bar]",
        { scaleX: 0 },
        {
          scaleX: taken / ev.capacity,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: { trigger: "[data-seats-bar]", start: "top 92%", once: true },
        },
      );
    },
    { scope: root },
  );

  // Poster tilts toward the cursor. Pointer-driven, so touch never sees it.
  const onMove = (e) => {
    const el = poster.current;
    if (!el || window.matchMedia("(hover: none)").matches) return;
    const box = el.getBoundingClientRect();
    gsap.to(el, {
      rotateY: ((e.clientX - (box.left + box.width / 2)) / box.width) * 11,
      rotateX: -((e.clientY - (box.top + box.height / 2)) / box.height) * 11,
      duration: 0.7,
      ease: "power3.out",
      transformPerspective: 900,
    });
  };

  const onLeave = () =>
    gsap.to(poster.current, { rotateX: 0, rotateY: 0, duration: 1.1, ease: "power3.out" });

  return (
    <section
      id="conversations"
      ref={root}
      className="relative py-(--spacing-section)"
    >
      <div className="shell grid grid-cols-1 items-center gap-x-16 gap-y-14 lg:grid-cols-12">
        {/* ---------------- Poster ---------------- */}
        <div
          className="lg:col-span-5"
          onMouseMove={onMove}
          onMouseLeave={onLeave}
        >
          <div
            ref={poster}
            data-reveal
            className="relative flex aspect-[3/4] flex-col justify-between overflow-hidden rounded-xl bg-ink p-8 text-ivory will-change-transform sm:p-10"
          >
            {/* Oversized bubble mark, bled off the corner */}
            <svg
              aria-hidden="true"
              viewBox="0 0 200 200"
              className="pointer-events-none absolute -right-16 -bottom-14 h-64 w-64 text-sage/12"
              fill="currentColor"
            >
              <path d="M100 18c45 0 82 29 82 65 0 36-37 65-82 65-9 0-18-1-26-3l-38 19 10-32C26 120 18 105 18 83c0-36 37-65 82-65Z" />
            </svg>

            <div className="relative flex items-start justify-between gap-4">
              <span className="eyebrow text-sand">Conversation No. 26</span>
              <span className="eyebrow rounded-full border border-ivory/25 px-3 py-1 text-ivory/70">
                {ev.status === "published" ? "Open" : "Draft"}
              </span>
            </div>

            <div className="relative">
              <h3 className="display text-[clamp(2rem,3.4vw,2.9rem)]">
                {ev.title}
              </h3>
              <div className="mt-5 h-px w-16 bg-sand" />
              <p className="mt-5 max-w-[22rem] text-[0.9375rem] leading-relaxed text-ivory/65">
                {ev.subtitle}
              </p>
            </div>

            <div className="relative flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-ivory/12 pt-5">
              <span className="eyebrow text-ivory/55">{ev.date}</span>
              <span className="eyebrow text-sage">{ev.venue}</span>
            </div>
          </div>
        </div>

        {/* ---------------- Details ---------------- */}
        <div className="lg:col-span-6 lg:col-start-7">
          <p data-reveal className="eyebrow text-green">
            {ev.label}
          </p>

          <h2
            data-mask
            className="display mt-6 text-[clamp(2.4rem,5vw,4rem)]"
          >
            <span className="block">{ev.title}</span>
          </h2>

          <p data-reveal="0.05" className="mt-6 max-w-[36rem] text-ink/70">
            {ev.description}
          </p>

          <dl data-reveal="0.1" className="mt-10 grid grid-cols-1 sm:grid-cols-2">
            {details.map(([label, value]) => (
              <div
                key={label}
                className="border-t border-ink/12 py-4 pr-6 first:border-t-0 sm:first:border-t sm:even:pl-6"
              >
                <dt className="eyebrow text-ink/45">{label}</dt>
                <dd className="mt-1.5 font-medium">{value}</dd>
              </div>
            ))}
          </dl>

          {/* Seats — honest scarcity, no countdown theatrics */}
          <div data-reveal="0.15" className="mt-8">
            <div className="flex items-baseline justify-between">
              <span className="eyebrow text-ink/45">Seats</span>
              <span className="text-[0.875rem] font-medium">
                <span className="numeral text-xl" data-count={ev.seatsRemaining}>
                  0
                </span>{" "}
                of {ev.capacity} left
              </span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink/10">
              <div
                data-seats-bar
                className="h-full origin-left rounded-full bg-green"
              />
            </div>
          </div>

          <div data-reveal="0.2" className="mt-9 flex flex-wrap items-center gap-3">
            <Magnetic strength={0.22}>
              <a href={ev.meetupUrl} className="btn btn-solid">
                Reserve My Seat — ₹{ev.fee}
              </a>
            </Magnetic>
            <a href={ev.meetupUrl} className="btn btn-ghost">
              View on Meetup
            </a>
            <a href={ev.calendarUrl} className="btn btn-ghost">
              Add to Calendar
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
