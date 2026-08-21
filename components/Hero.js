"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { hero } from "@/lib/content";
import Magnetic from "./Magnetic";

gsap.registerPlugin(useGSAP);

export default function Hero() {
  const root = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.fromTo(
        "[data-hero-img]",
        { scale: 1.04 },
        { scale: 1, duration: 2.6, ease: "power2.out" },
        0,
      )
        .to("[data-hero-mask] > *", { y: 0, duration: 1.3, stagger: 0.1 }, 0.2)
        .to(
          "[data-hero-fade]",
          { opacity: 1, y: 0, duration: 1, stagger: 0.08 },
          0.75,
        )
        .fromTo(
          "[data-bubble]",
          { opacity: 0, scale: 0.9, y: 14 },
          { opacity: 1, scale: 1, y: 0, duration: 0.9, stagger: 0.14 },
          1.1,
        );

      // Hand-drawn arrows draw themselves in. DrawSVG is a paid GSAP plugin,
      // so this does the same with plain dash offsets.
      gsap.utils.toArray("[data-arrow]").forEach((p, i) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(p, {
          strokeDashoffset: 0,
          duration: 1.1,
          ease: "power2.inOut",
          delay: 1.5 + i * 0.2,
        });
      });

      // Bubbles keep breathing once they've arrived. Each drifts on its own
      // offset so the group never pulses in unison.
      gsap.utils.toArray("[data-bubble]").forEach((b, i) => {
        gsap.to(b, {
          y: i % 2 === 0 ? -9 : 9,
          duration: 3.4 + i * 0.4,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: 2 + i * 0.25,
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      id="top"
      ref={root}
      className="relative isolate overflow-hidden bg-ink text-ivory"
    >
      <div className="shell grid min-h-svh grid-cols-1 items-center gap-y-14 pt-32 pb-20 lg:grid-cols-12 lg:gap-x-10 lg:pt-28 lg:pb-24">
        {/* ---------------- Left: the thesis ---------------- */}
        <div className="lg:col-span-5">
          <p data-hero-fade className="eyebrow text-sage">
            {hero.eyebrow}
          </p>

          <h1 className="display mt-7 text-[clamp(2.9rem,7.4vw,5.5rem)]">
            {hero.headlineLines.map((line) => (
              <span key={line} data-hero-mask>
                <span className="block">{line}</span>
              </span>
            ))}
            <span data-hero-mask>
              <span className="accent block">{hero.headlineAccent}</span>
            </span>
          </h1>

          <p
            data-hero-fade
            className="mt-8 max-w-[34rem] text-ivory/70 text-[1.0625rem]"
          >
            {hero.body}
          </p>

          <div data-hero-fade className="mt-10 flex flex-wrap items-center gap-4">
            <Magnetic>
              <a href={hero.primaryCta.href} className="btn btn-ivory">
                {hero.primaryCta.label}
              </a>
            </Magnetic>
            <Magnetic strength={0.2}>
              <a href={hero.secondaryCta.href} className="btn btn-ghost-light">
                {hero.secondaryCta.label}
              </a>
            </Magnetic>
          </div>

          <ul
            data-hero-fade
            className="mt-14 flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-ivory/12 pt-6"
          >
            {hero.indicators.map((item, i) => (
              <li key={item} className="eyebrow flex items-center gap-4 text-ivory/55">
                {i > 0 && <span className="h-1 w-1 rounded-full bg-sage" />}
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* ---------------- Right: the room ---------------- */}
        <div className="relative lg:col-span-7 lg:col-start-6">
          <div
            data-hero-fade
            className="relative aspect-[4/5] overflow-hidden rounded-xl sm:aspect-[3/2] lg:aspect-[4/5]"
          >
            <Image
              data-hero-img
              src={hero.image.src}
              alt={hero.image.alt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover"
            />
            {/* Warms the photograph into the palette instead of letting it
                sit on top of the green as a foreign rectangle. */}
            <div className="absolute inset-0 bg-ink/25 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
          </div>

          {/* Hand-drawn arrows from bubbles into the room */}
          <svg
            aria-hidden="true"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 h-full w-full"
            fill="none"
          >
            <path
              data-arrow
              d="M22 21C31 27 34 34 41 38"
              stroke="var(--color-sand)"
              strokeWidth="1.25"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              opacity="0.75"
            />
            <path
              data-arrow
              d="M39 39C36 38 36 40 34 42"
              stroke="var(--color-sand)"
              strokeWidth="1.25"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              opacity="0.75"
            />
            <path
              data-arrow
              d="M55 15C57 25 62 31 58 44"
              stroke="var(--color-sand)"
              strokeWidth="1.25"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              opacity="0.75"
            />
          </svg>

          {/* Speech bubbles */}
          {hero.bubbles.map((bubble) => (
            <div
              key={bubble.text}
              data-bubble
              style={{ left: `${bubble.x}%`, top: `${bubble.y}%` }}
              className="absolute hidden max-w-[13rem] sm:block"
            >
              <p className="relative rounded-[1.1rem] rounded-bl-sm bg-ivory px-4 py-2.5 text-[0.8125rem] leading-snug font-medium text-ink shadow-[0_10px_30px_-12px_rgba(30,43,34,0.6)]">
                {bubble.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Colour wipe into the ivory section below */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-ivory/0" />
    </section>
  );
}
