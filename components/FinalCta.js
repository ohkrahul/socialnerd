"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { finalCta } from "@/lib/content";
import Magnetic from "./Magnetic";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function FinalCta() {
  const root = useRef(null);

  useGSAP(
    () => {
      // The illustration draws itself in, stroke by stroke.
      gsap.utils.toArray("[data-draw]").forEach((path, i) => {
        const len = path.getTotalLength();
        gsap.fromTo(
          path,
          { strokeDasharray: len, strokeDashoffset: len },
          {
            strokeDashoffset: 0,
            duration: 1.4,
            ease: "power2.inOut",
            delay: i * 0.16,
            scrollTrigger: { trigger: root.current, start: "top 68%", once: true },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="grain-drift relative isolate overflow-hidden bg-ink py-(--spacing-section) text-ivory"
    >
      <div className="shell grid grid-cols-1 items-center gap-x-16 gap-y-16 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 className="display text-[clamp(2.6rem,6vw,5rem)]">
            {finalCta.headlineLines.map((line, i) => (
              <span key={line} data-mask>
                <span className={i === 1 ? "accent block" : "block"}>{line}</span>
              </span>
            ))}
          </h2>

          <p data-reveal="0.05" className="mt-9 max-w-[34rem] text-ivory/70">
            {finalCta.body}
          </p>

          <div data-reveal="0.1" className="mt-11 flex flex-wrap items-center gap-4">
            <Magnetic>
              <a href={finalCta.primaryCta.href} className="btn btn-ivory">
                {finalCta.primaryCta.label}
              </a>
            </Magnetic>
            <Magnetic strength={0.2}>
              <a href={finalCta.secondaryCta.href} className="btn btn-ghost-light">
                {finalCta.secondaryCta.label}
              </a>
            </Magnetic>
          </div>
        </div>

        {/* Three figures and the shapes of them talking. Deliberately drawn
            with the same wobble as the rest of the hand-drawn marks. */}
        <div className="lg:col-span-5">
          <svg
            viewBox="0 0 320 220"
            className="h-auto w-full"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <g className="text-sand/70">
              <path data-draw d="M40 200c0-26 14-40 32-40s32 14 32 40" />
              <path data-draw d="M56 130a16 15 0 1 0 32 0 16 15 0 1 0-32 0" />
              <path data-draw d="M124 200c0-30 15-46 36-46s36 16 36 46" />
              <path data-draw d="M142 124a18 17 0 1 0 36 0 18 17 0 1 0-36 0" />
              <path data-draw d="M216 200c0-26 14-40 32-40s32 14 32 40" />
              <path data-draw d="M232 130a16 15 0 1 0 32 0 16 15 0 1 0-32 0" />
            </g>
            <g className="text-sage">
              <path
                data-draw
                d="M28 70c0-13 12-22 28-22s28 9 28 22-12 22-28 22h-6l-12 9 2-11c-7-4-12-11-12-20Z"
              />
              <path
                data-draw
                d="M124 44c0-15 14-26 34-26s34 11 34 26-14 26-34 26h-8l-14 11 3-13c-9-5-15-13-15-24Z"
              />
              <path
                data-draw
                d="M232 76c0-12 11-20 26-20s26 8 26 20-11 20-26 20h-6l-11 8 2-10c-7-4-11-10-11-18Z"
              />
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}
