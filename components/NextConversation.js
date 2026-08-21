"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteMeta } from "@/lib/content";
import Magnetic from "./Magnetic";
import NotifyForm from "./NotifyForm";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * The next conversation, in whichever of its four real states applies.
 *
 *   null            nothing scheduled  -> notify list. Today's actual state.
 *   cancelled       Meetup said so     -> say so, then notify list
 *   seats = 0       full               -> notify list, framed as a waitlist
 *   otherwise       open               -> RSVP on Meetup
 *
 * Money never changes hands on this site. Meetup takes the RSVP and payment is
 * confirmed over WhatsApp, so the three steps are spelled out rather than
 * hidden behind a button that goes somewhere unexpected.
 */

const STEPS = [
  "RSVP on Meetup",
  `Pay ₹${siteMeta.fee} over WhatsApp`,
  "Your seat is confirmed",
];

function Shell({ eyebrow, children }) {
  return (
    <section id="conversations" className="ground-deep relative py-(--spacing-section)">
      <div className="shell">
        <p data-reveal className="eyebrow t-accent">
          {eyebrow}
        </p>
        {children}
      </div>
    </section>
  );
}

/** Nothing on the calendar. The honest version, not an invented event. */
function Empty() {
  return (
    <Shell eyebrow="The next conversation">
      <div className="mt-8 grid grid-cols-1 gap-x-16 gap-y-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 data-mask className="question text-[clamp(2rem,4.6vw,3.4rem)]">
            <span className="block">
              No date yet.{" "}
              <span className="mark">
                <span className="mark-bg" aria-hidden="true" />
                <span className="mark-ink">Be first to know.</span>
              </span>
            </span>
          </h2>

          <p data-reveal="0.05" className="t-dim mt-7 max-w-[34rem]">
            The last conversation ran on 25 July 2026 at Slow Brew in Chembur.
            The next one is being planned. Leave your email and you&rsquo;ll hear
            before it goes up on Meetup — rooms cap at twelve and they fill from
            this list first.
          </p>

          <div data-reveal="0.1" className="mt-9 max-w-[30rem]">
            <NotifyForm source="event-none" tone="dark" label="Tell me first" />
          </div>
        </div>

        {/* A poster-shaped card keeps the section's weight while there is no
            event to put in it. Empty states are still layout. */}
        <div className="lg:col-span-4 lg:col-start-9">
          <div
            data-reveal="0.15"
            className="edge flex aspect-[3/4] flex-col justify-between rounded-xl border border-dashed p-8"
          >
            <span className="eyebrow t-faint">Conversation No. 03</span>
            <p className="display t-faint text-[1.6rem] italic">
              Being planned.
            </p>
            <span className="eyebrow t-faint">Slow Brew · Chembur</span>
          </div>
        </div>
      </div>
    </Shell>
  );
}

export default function NextConversation({ event = null }) {
  const root = useRef(null);

  const full = event && event.seatsRemaining === 0;
  const cancelled =
    event && (event.status === "cancelled" || event.meetupStatus === "cancelled");
  const bookable = event && !full && !cancelled;

  useGSAP(
    () => {
      if (!event?.capacity) return;
      const taken = event.capacity - (event.seatsRemaining ?? 0);
      gsap.fromTo(
        "[data-seats-bar]",
        { scaleX: 0 },
        {
          scaleX: Math.max(0, Math.min(1, taken / event.capacity)),
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: { trigger: "[data-seats-bar]", start: "top 92%", once: true },
        },
      );
    },
    { scope: root, dependencies: [event] },
  );

  if (!event) return <Empty />;

  const details = [
    ["Date", event.dateLabel],
    ["Time", event.timeLabel],
    ["Venue", event.venueName],
    ["Entry", `₹${event.feeInr ?? siteMeta.fee}`],
  ].filter(([, value]) => value);

  return (
    <section
      id="conversations"
      ref={root}
      className="ground-deep relative py-(--spacing-section)"
    >
      <div className="shell grid grid-cols-1 items-center gap-x-16 gap-y-14 lg:grid-cols-12">
        {/* ---------------- Poster ---------------- */}
        <div className="lg:col-span-5">
          <div
            data-reveal
            className="relative flex aspect-[3/4] flex-col justify-between overflow-hidden rounded-xl bg-ink p-8 sm:p-10"
          >
            {event.posterPath && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={event.posterPath}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-35"
              />
            )}

            <div className="relative flex items-start justify-between gap-4">
              <span className="eyebrow text-sand">
                {event.number ? `Conversation No. ${event.number}` : "Next up"}
              </span>
              {cancelled && (
                <span className="eyebrow rounded-full border border-ivory/25 px-3 py-1 text-ivory/70">
                  Cancelled
                </span>
              )}
            </div>

            <div className="relative">
              <h3 className="question text-[clamp(1.9rem,3.4vw,2.7rem)] text-ivory">
                {event.title}
              </h3>
              <div className="mt-5 h-px w-16 bg-sand" />
              {event.subtitle && (
                <p className="mt-5 max-w-[22rem] text-[0.9375rem] leading-relaxed text-ivory/65">
                  {event.subtitle}
                </p>
              )}
            </div>

            <div className="relative flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-ivory/12 pt-5">
              <span className="eyebrow text-ivory/55">{event.dateLabel}</span>
              <span className="eyebrow text-sage">{event.venueName}</span>
            </div>
          </div>
        </div>

        {/* ---------------- Details ---------------- */}
        <div className="lg:col-span-6 lg:col-start-7">
          <p data-reveal className="eyebrow t-accent">
            {cancelled ? "This one was cancelled" : full ? "This room is full" : "Upcoming conversation"}
          </p>

          <h2 data-mask className="question mt-6 text-[clamp(2.1rem,4.6vw,3.5rem)]">
            <span className="block">{event.title}</span>
          </h2>

          {event.memorableQuestion && (
            <p data-reveal="0.05" className="display t-dim mt-6 max-w-[34rem] text-[1.4rem] italic">
              &ldquo;{event.memorableQuestion}&rdquo;
            </p>
          )}

          <dl data-reveal="0.1" className="mt-9 grid grid-cols-1 sm:grid-cols-2">
            {details.map(([label, value]) => (
              <div
                key={label}
                className="edge border-t py-4 pr-6 first:border-t-0 sm:first:border-t sm:even:pl-6"
              >
                <dt className="eyebrow t-faint">{label}</dt>
                <dd className="t-fg mt-1.5 font-medium">{value}</dd>
              </div>
            ))}
          </dl>

          {bookable && event.capacity != null && (
            <div data-reveal="0.15" className="mt-8">
              <div className="flex items-baseline justify-between">
                <span className="eyebrow t-faint">Seats</span>
                <span className="text-[0.875rem] font-medium">
                  <span className="numeral text-xl" data-count={event.seatsRemaining}>
                    0
                  </span>{" "}
                  of {event.capacity} left
                </span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ivory/12">
                <div data-seats-bar className="h-full origin-left rounded-full bg-sage" />
              </div>
            </div>
          )}

          {bookable ? (
            <>
              {/* The real funnel, named. Meetup takes the RSVP, WhatsApp takes
                  the payment, and nobody is surprised by either. */}
              <ol data-reveal="0.18" className="mt-9 flex flex-col gap-3">
                {STEPS.map((step, i) => (
                  <li key={step} className="flex items-center gap-4 text-[0.9375rem]">
                    <span className="numeral t-accent w-5 text-lg">{i + 1}</span>
                    <span className="t-dim">{step}</span>
                  </li>
                ))}
              </ol>

              <div data-reveal="0.22" className="mt-9 flex flex-wrap items-center gap-3">
                <Magnetic strength={0.22}>
                  <a
                    href={event.meetupUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ivory"
                  >
                    RSVP on Meetup — ₹{event.feeInr ?? siteMeta.fee}
                  </a>
                </Magnetic>
                {event.calendarUrl && (
                  <a href={event.calendarUrl} className="btn btn-ghost-light">
                    Add to Calendar
                  </a>
                )}
              </div>
            </>
          ) : (
            <div data-reveal="0.18" className="mt-9 max-w-[30rem]">
              <p className="t-dim mb-5 text-[0.9375rem]">
                {cancelled
                  ? "This conversation was cancelled. Leave your email and you'll hear when the next date is set."
                  : "Every seat is taken. Leave your email — cancellations happen, and this list gets them first."}
              </p>
              <NotifyForm
                source="event-full"
                tone="dark"
                label={cancelled ? "Tell me the next date" : "Join the waitlist"}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
