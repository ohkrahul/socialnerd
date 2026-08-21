"use client";

import { useRef, useState } from "react";
import { testimonials } from "@/lib/content";

/**
 * Native scroll-snap does the carousel; pointer handlers only add
 * drag-to-scroll for mice, which touch already has for free. No carousel
 * dependency, and keyboard tabbing through cards scrolls them into view
 * because the rail is a real scroll container.
 */
export default function Testimonials() {
  const rail = useRef(null);
  const drag = useRef(null);
  const [active, setActive] = useState(0);

  const onScroll = () => {
    const el = rail.current;
    const card = el.firstElementChild;
    if (!card) return;
    const step = card.offsetWidth + 20; // gap-5
    setActive(Math.min(testimonials.length - 1, Math.round(el.scrollLeft / step)));
  };

  const onPointerDown = (e) => {
    if (e.pointerType !== "mouse") return;
    drag.current = { x: e.clientX, left: rail.current.scrollLeft };
    rail.current.style.scrollSnapType = "none";
  };

  const onPointerMove = (e) => {
    if (!drag.current) return;
    rail.current.scrollLeft = drag.current.left - (e.clientX - drag.current.x);
  };

  const onPointerUp = () => {
    if (!drag.current) return;
    drag.current = null;
    rail.current.style.scrollSnapType = "";
  };

  const goTo = (i) => {
    const card = rail.current.children[i];
    card?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  };

  return (
    <section className="relative py-(--spacing-section)">
      <div className="shell">
        <p data-reveal className="eyebrow text-green">
          In their words
        </p>
        <h2 data-mask className="display mt-6 max-w-[34rem] text-[clamp(2.2rem,4.6vw,3.6rem)]">
          <span className="block">Thoughts from our community.</span>
        </h2>
      </div>

      <div
        ref={rail}
        onScroll={onScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        className="rail mt-14 gap-5 pb-2 select-none"
      >
        {testimonials.map((t, i) => (
          <blockquote
            key={t.name}
            className={`card flex w-[min(88vw,26rem)] flex-col p-8 transition-[transform,box-shadow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:p-10 ${
              i === active
                ? "shadow-[0_28px_60px_-40px_rgba(30,43,34,0.55)]"
                : "scale-[0.975] opacity-80"
            }`}
          >
            <span
              aria-hidden="true"
              className="display text-[4.5rem] leading-[0.6] text-sage/40"
            >
              &ldquo;
            </span>

            <p className="mt-6 grow text-[1.0625rem] leading-relaxed text-ink/85">
              {t.quote}
            </p>

            <footer className="mt-9 flex items-center gap-4 border-t border-ink/10 pt-6">
              {/* Initial in place of a photograph until we have one we're
                  allowed to publish. */}
              <span className="display flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sand/70 text-xl">
                {t.name.charAt(0)}
              </span>
              <div>
                <cite className="block text-[0.9375rem] font-semibold not-italic">
                  {t.name}
                </cite>
                <span className="text-[0.8125rem] text-ink/50">
                  {t.profession} · {t.event}
                </span>
              </div>
            </footer>
          </blockquote>
        ))}
      </div>

      <div className="shell mt-10 flex items-center gap-2.5">
        {testimonials.map((t, i) => (
          <button
            key={t.name}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Testimonial ${i + 1}`}
            aria-current={i === active}
            className="group flex h-11 items-center"
          >
            {/* 44px hit area, 4px mark. Tap target and visual weight are
                different problems. */}
            <span
              className={`h-1 rounded-full transition-all duration-500 ${
                i === active
                  ? "w-10 bg-green"
                  : "w-4 bg-ink/20 group-hover:bg-ink/40"
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
