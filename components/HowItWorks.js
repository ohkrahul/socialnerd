"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { steps, stepsClip, topics } from "@/lib/content";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* Minimal line icons, drawn rather than imported — four glyphs is not worth
   an icon dependency. */
const icons = [
  // You arrive as you are — a doorway with someone stepping through
  <>
    <path d="M9 22V8a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v14" />
    <path d="M13 14h.01" />
    <path d="M2 22h20" />
  </>,
  // Phones disappear
  <>
    <rect x="8" y="3" width="8" height="18" rx="2" />
    <path d="M3 3l18 18" />
  </>,
  // One question opens the room
  <>
    <path d="M21 12a8 8 0 1 1-3.2-6.4L21 4l-1 4" />
    <path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7" />
    <path d="M12 17h.01" />
  </>,
  // Everyone becomes part of it
  <>
    <circle cx="12" cy="5" r="2.2" />
    <circle cx="19" cy="12" r="2.2" />
    <circle cx="12" cy="19" r="2.2" />
    <circle cx="5" cy="12" r="2.2" />
  </>,
];

export default function HowItWorks() {
  const root = useRef(null);

  // Nothing downloads until the clip is near the viewport, and it stops the
  // moment it leaves. Same handling as the gallery tiles: this sits well below
  // the fold and should not cost anyone who never scrolls this far.
  useEffect(() => {
    const el = root.current?.querySelector("[data-steps-clip]");
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!el.src) el.src = el.dataset.src;
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { rootMargin: "160px 0px", threshold: 0.15 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      /**
       * Each step lights up as it arrives.
       *
       * Triggered on the step itself rather than on the section at a staggered
       * offset. The offsets existed to time four dots against a horizontal line
       * sweeping across them; stacked vertically each dot has its own scroll
       * position, so the element is the honest trigger.
       */
      gsap.utils.toArray("[data-step]").forEach((step) => {
        gsap.to(step.querySelector("[data-step-dot]"), {
          backgroundColor: "var(--color-sage)",
          color: "var(--color-ink)",
          borderColor: "var(--color-sage)",
          duration: 0.5,
          scrollTrigger: { trigger: step, start: "top 82%", once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      id="how-it-works"
      ref={root}
      className="ground-ink relative py-(--spacing-section)"
    >
      <div className="shell">
        <div className="max-w-[42rem]">
          <p data-reveal className="eyebrow t-accent">
            How a conversation works
          </p>
          <h2 data-mask className="question mt-6 text-[clamp(2.1rem,4.6vw,3.5rem)]">
            <span className="block">
              Two hours. One room. <span className="accent">No agenda.</span>
            </span>
          </h2>
          <p data-reveal="0.05" className="t-dim mt-6">
            This is not a lecture, a workshop or a networking event. Nobody
            presents. Nobody pitches. There is one question and the people who
            turned up to sit with it.
          </p>
        </div>

        {/* Steps beside the clip. As a row of four across the full width they
            left the whole right half of the header empty and the clip had
            nothing to sit against; stacked, four steps come out close to the
            height of a 9:16 clip, so the two columns balance. */}
        <div className="mt-16 grid grid-cols-1 items-start gap-x-16 gap-y-14 lg:grid-cols-12">
          <ol className="lg:col-span-7">
            {steps.map((step, i) => (
              <li
                key={step.title}
                data-step
                data-reveal={i * 0.08}
                className="relative flex gap-6 pb-10 last:pb-0"
              >
                {/* Connector between this dot and the next. Vertical now: the
                    row became a column, and the old horizontal sweep across it
                    would have read as a broken graphic. */}
                {i < steps.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute top-14 left-6 -ml-px h-[calc(100%-2.5rem)] border-l border-dashed border-ivory/20"
                  />
                )}

                <span
                  data-step-dot
                  className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-ivory/25 bg-ink text-ivory"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {icons[i]}
                  </svg>
                </span>

                <div className="pt-0.5">
                  <span className="numeral t-faint text-xl">0{i + 1}</span>
                  <h3 className="display mt-1 text-[1.5rem]">{step.title}</h3>
                  <p className="t-dim mt-2 text-[0.9375rem] leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <figure data-reveal="0.1" className="lg:col-span-5">
            {/* Capped in width, not height: 9:16 at the full column width would
                overshoot the steps beside it. */}
            <div className="relative aspect-[9/16] w-full max-w-[26rem] overflow-hidden rounded-xl border border-ivory/12 bg-ink-deep lg:ml-auto">
              <video
                data-steps-clip
                data-src={stepsClip.src}
                poster={stepsClip.poster}
                muted
                loop
                playsInline
                preload="none"
                aria-label={stepsClip.alt}
                className="h-full w-full object-cover"
              />
            </div>
            <figcaption className="t-faint mt-3 max-w-[26rem] text-[0.8125rem] lg:ml-auto">
              {stepsClip.caption}
            </figcaption>
          </figure>
        </div>

        {/* What actually comes up. A plain row rather than eight hover cards —
            the names are the information; the interaction was decoration. */}
        <div data-reveal="0.1" className="edge mt-20 border-t pt-9">
          <p className="eyebrow t-faint">Recurring ground</p>
          <ul className="mt-5 flex flex-wrap gap-x-3 gap-y-3">
            {topics.map((topic) => (
              <li
                key={topic.name}
                className="edge rounded-full border px-4 py-2 text-[0.875rem] transition-colors duration-400 hover:border-sage hover:text-sage"
              >
                {topic.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
