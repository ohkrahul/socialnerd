"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { steps } from "@/lib/content";

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

  useGSAP(
    () => {
      // The dotted line is revealed by a growing clip rect, so it stays
      // genuinely dotted while it draws. Animating dashoffset would slide the
      // dashes along instead of extending the line.
      gsap.to("[data-journey-clip]", {
        attr: { width: 1000 },
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top 72%",
          end: "bottom 78%",
          scrub: 0.5,
        },
      });

      // Each step lights up as the line reaches it.
      gsap.utils.toArray("[data-step]").forEach((step, i) => {
        gsap.to(step.querySelector("[data-step-dot]"), {
          backgroundColor: "var(--color-green)",
          color: "var(--color-ivory)",
          borderColor: "var(--color-green)",
          duration: 0.5,
          scrollTrigger: {
            trigger: root.current,
            start: `top ${65 - i * 7}%`,
            once: true,
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      id="how-it-works"
      ref={root}
      className="relative bg-sand/40 py-(--spacing-section)"
    >
      <div className="shell">
        <div className="max-w-[42rem]">
          <p data-reveal className="eyebrow text-green">
            How a conversation works
          </p>
          <h2 data-mask className="display mt-6 text-[clamp(2.2rem,4.6vw,3.6rem)]">
            <span className="block">
              Four hours. One room. <span className="accent">No agenda.</span>
            </span>
          </h2>
          <p data-reveal="0.05" className="mt-6 text-ink/70">
            This is not a lecture, a workshop or a networking event. Nobody
            presents. Nobody pitches. There is one question and the people who
            turned up to sit with it.
          </p>
        </div>

        {/* Journey line — desktop only; the mobile stack reads better without it */}
        <div className="relative mt-20 hidden lg:block">
          <svg
            aria-hidden="true"
            viewBox="0 0 1000 120"
            preserveAspectRatio="none"
            className="absolute -top-2 left-0 h-28 w-full"
            fill="none"
          >
            <defs>
              <clipPath id="journey-reveal">
                <rect data-journey-clip x="0" y="0" width="0" height="120" />
              </clipPath>
            </defs>
            <path
              d="M115 60C240 12 262 108 375 60S512 12 625 60S762 108 885 60"
              stroke="var(--color-ink)"
              strokeWidth="1.5"
              strokeDasharray="1 9"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              opacity="0.16"
            />
            <g clipPath="url(#journey-reveal)">
              <path
                d="M115 60C240 12 262 108 375 60S512 12 625 60S762 108 885 60"
                stroke="var(--color-green)"
                strokeWidth="1.5"
                strokeDasharray="1 9"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            </g>
          </svg>
        </div>

        <ol className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:mt-6 lg:grid-cols-4">
          {steps.map((step, i) => (
            <li
              key={step.title}
              data-step
              data-reveal={i * 0.08}
              className="relative"
            >
              <div className="flex items-center gap-4">
                <span
                  data-step-dot
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-ink/20 bg-ivory text-ink"
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
                <span className="numeral text-2xl text-ink/30">
                  0{i + 1}
                </span>
              </div>

              <h3 className="display mt-6 text-[1.65rem]">{step.title}</h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink/65">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
