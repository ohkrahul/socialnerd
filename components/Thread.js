"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * The conversation thread — this page's signature element.
 *
 * One hand-drawn line runs the height of the document in the left gutter and
 * draws itself as you scroll. A conversation is a thread; the brief's three
 * separate decorative asks (hand-drawn arrows, a dotted journey line, bubble
 * connectors) collapse into this single device instead of scattering.
 *
 * It sits ABOVE the sections rather than behind them, because the dark green
 * sections are opaque. Sage is the one palette value legible on both the
 * ivory and the ink grounds, which is why the thread is sage.
 *
 * ponytail: the path is a normalised 0-1000 viewBox stretched to document
 * height, not geometrically stitched to section anchors. Swap to per-section
 * path segments only if you need the thread to touch specific elements.
 */
export default function Thread() {
  const root = useRef(null);
  const path = useRef(null);

  useGSAP(
    () => {
      const line = path.current;
      if (!line) return;

      const length = line.getTotalLength();
      gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });

      gsap.to(line, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
        },
      });
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 left-1/2 z-40 hidden w-full max-w-[90rem] -translate-x-1/2 lg:block"
    >
      <svg
        className="h-full w-[var(--spacing-gutter)]"
        viewBox="0 0 100 1000"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          ref={path}
          d="M52 0C20 62 84 118 54 182C24 246 88 302 46 366C12 430 82 486 56 550C26 614 86 670 44 734C14 798 80 854 52 918C34 958 62 980 50 1000"
          stroke="var(--color-sage)"
          strokeWidth="1.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          opacity="0.5"
        />
      </svg>
    </div>
  );
}
