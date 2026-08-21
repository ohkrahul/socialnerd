"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { hero } from "@/lib/content";
import Magnetic from "./Magnetic";
import NotifyForm from "./NotifyForm";

gsap.registerPlugin(useGSAP);

export default function Hero() {
  const root = useRef(null);
  const video = useRef(null);

  // Autoplay is a request, not a guarantee — a paused hero video with a poster
  // frame still reads correctly, so a rejection is nothing to handle.
  useEffect(() => {
    video.current?.play().catch(() => {});
  }, []);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.to("[data-hero-mask] > *", { y: 0, duration: 1.25, stagger: 0.11 }, 0.15)
        // The highlighter strokes across after the words it marks have landed.
        // Because the marked text is ink-coloured, this reads as the marker
        // revealing the phrase rather than passing over it.
        .to(
          "[data-mark-bg]",
          { scaleX: 1, duration: 0.72, ease: "power2.inOut" },
          0.95,
        )
        .to("[data-hero-fade]", { opacity: 1, y: 0, duration: 1, stagger: 0.09 }, 1.15)
        .fromTo(
          "[data-phone]",
          { opacity: 0, y: 42, rotate: 1.4 },
          { opacity: 1, y: 0, rotate: 0, duration: 1.5, ease: "power3.out" },
          0.3,
        );
    },
    { scope: root },
  );

  return (
    <section
      id="top"
      ref={root}
      className="ground-ink relative isolate overflow-hidden"
    >
      <div className="shell grid min-h-svh grid-cols-1 items-center gap-y-16 pt-32 pb-24 lg:grid-cols-12 lg:gap-x-12 lg:pt-28">
        {/* ---------------- Left: the question ---------------- */}
        <div className="lg:col-span-7">
          <p data-hero-fade className="eyebrow t-accent">
            {hero.eyebrow}
          </p>

          {/* The community's own poster copy. Set in their poster voice. */}
          <h1 className="question mt-8 text-[clamp(2.6rem,7.4vw,5.6rem)]">
            <span data-hero-mask>
              <span className="block t-fg">{hero.headline.before}</span>
            </span>
            <span data-hero-mask>
              <span className="mark my-1 block">
                <span data-mark-bg className="mark-bg" aria-hidden="true" />
                <span className="mark-ink">{hero.headline.marked}</span>
              </span>
            </span>
            <span data-hero-mask>
              {/* Resolves out of the poster voice into the editorial one. */}
              <span className="display accent block text-[0.86em] normal-case">
                {hero.headline.after}
              </span>
            </span>
          </h1>

          <p data-hero-fade className="t-dim mt-9 max-w-[36rem] text-[1.0625rem]">
            {hero.body}
          </p>

          {/* Nothing is scheduled, so the primary action is the notify list. */}
          <div data-hero-fade className="mt-10 max-w-[30rem]">
            <NotifyForm source="hero" tone="dark" label={hero.primaryCta.label} />
          </div>

          <div data-hero-fade className="mt-8">
            <Magnetic strength={0.2}>
              <a href={hero.secondaryCta.href} className="btn btn-ghost-light">
                {hero.secondaryCta.label}
              </a>
            </Magnetic>
          </div>

          <ul
            data-hero-fade
            className="edge mt-14 flex flex-wrap items-center gap-x-5 gap-y-3 border-t pt-6"
          >
            {hero.indicators.map((item, i) => (
              <li key={item} className="eyebrow t-faint flex items-center gap-5">
                {i > 0 && <span className="h-1 w-1 rounded-full bg-sage" />}
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* ---------------- Right: the only screen ---------------- */}
        <div className="lg:col-span-5 lg:col-start-8">
          <figure data-phone className="relative mx-auto w-full max-w-[19rem]">
            <div className="phone">
              <video
                ref={video}
                src={hero.video.src}
                poster={hero.video.poster}
                aria-label={hero.video.alt}
                muted
                loop
                playsInline
                preload="metadata"
              />
            </div>

            <figcaption className="display t-dim mt-6 text-center text-[1.15rem] italic">
              {hero.video.caption}
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
