"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { finalCta } from "@/lib/content";
import Magnetic from "./Magnetic";
import NotifyForm from "./NotifyForm";

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
      className="ground-ink grain-drift relative isolate overflow-hidden py-(--spacing-section)"
    >
      <div className="shell grid grid-cols-1 items-center gap-x-16 gap-y-16 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 className="question text-[clamp(2.4rem,6vw,4.8rem)]">
            <span data-mask>
              <span className="t-fg block">{finalCta.headline.before}</span>
            </span>
            <span data-mask>
              <span className="mt-1 block">
                <span className="mark">{finalCta.headline.marked}</span>
              </span>
            </span>
          </h2>

          <p data-reveal="0.05" className="t-dim mt-9 max-w-[34rem]">
            {finalCta.body}
          </p>

          <div data-reveal="0.1" className="mt-11 max-w-[30rem]">
            <NotifyForm source="final-cta" tone="dark" label="Keep me posted" />
          </div>

          <div data-reveal="0.15" className="mt-8 flex flex-wrap items-center gap-3">
            <Magnetic strength={0.2}>
              <a
                href={finalCta.whatsappCta.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost-light"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm5.8 14.03c-.24.68-1.4 1.3-1.93 1.35-.53.05-1.02.07-1.75-.2-.43-.16-.99-.35-1.7-.66-2.99-1.29-4.95-4.3-5.1-4.5-.15-.2-1.22-1.62-1.22-3.09s.77-2.19 1.04-2.49c.27-.3.59-.37.79-.37h.56c.18 0 .42-.07.65.5.24.58.81 1.99.88 2.13.07.15.12.32.02.52-.1.2-.15.32-.3.5-.15.17-.31.39-.44.52-.15.15-.3.31-.13.61.17.3.76 1.25 1.63 2.02 1.12.99 2.06 1.3 2.36 1.45.3.15.47.12.65-.07.17-.2.74-.86.94-1.16.2-.3.4-.25.67-.15.27.1 1.71.81 2.01.96.3.15.5.22.57.35.07.12.07.72-.17 1.4Z" />
                </svg>
                {finalCta.whatsappCta.label}
              </a>
            </Magnetic>
            <a
              href={finalCta.secondaryCta.href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost-light"
            >
              {finalCta.secondaryCta.label}
            </a>
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
