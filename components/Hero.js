"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { hero } from "@/lib/content";
import NotifyForm from "./NotifyForm";

gsap.registerPlugin(useGSAP);

/**
 * Centred video hero.
 *
 * The footage is 720x1280, so it is shown at its own aspect rather than
 * stretched across the viewport — a full-bleed crop of a 9:16 clip on a 16:9
 * screen keeps about a third of the frame, which would lose both the
 * notification overlay and the room. Height-driven sizing means the whole shot
 * survives on every screen.
 *
 * The clip has someone speaking in it. Muted, that is wallpaper; the unmute
 * control is what makes it a person talking to you. It starts muted because no
 * browser will autoplay otherwise.
 */
export default function Hero() {
  const root = useRef(null);
  const video = useRef(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    video.current?.play().then(
      () => setPlaying(true),
      // Autoplay refused (data saver, low power mode). The poster frame still
      // reads, and the control below becomes a play button.
      () => setPlaying(false),
    );
  }, []);

  const toggleSound = () => {
    const el = video.current;
    if (!el) return;

    // A refused autoplay leaves it paused; unmuting is a user gesture, so this
    // is the moment playback is allowed to start.
    if (!playing) {
      el.play().then(() => setPlaying(true), () => {});
    }
    el.muted = !el.muted;
    setMuted(el.muted);
  };

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // The video arrives first. You see a person before you read a pitch.
      tl.fromTo(
        "[data-stage]",
        { opacity: 0, scale: 0.94, y: 28 },
        { opacity: 1, scale: 1, y: 0, duration: 1.6, ease: "power3.out" },
        0,
      )
        .to("[data-hero-mask] > *", { y: 0, duration: 1.2, stagger: 0.1 }, 0.55)
        .to("[data-hero-fade]", { opacity: 1, y: 0, duration: 1, stagger: 0.09 }, 1.25);
    },
    { scope: root },
  );

  return (
    <section
      id="top"
      ref={root}
      className="ground-ink relative isolate overflow-hidden"
    >
      <div className="shell flex min-h-svh flex-col items-center justify-center gap-y-7 pt-28 pb-20 text-center">
        <p data-hero-fade className="eyebrow t-accent">
          {hero.eyebrow}
        </p>

        {/* ---------------- The only screen ---------------- */}
        <figure data-stage className="w-full">
          <div className="stage will-change-transform">
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

          <figcaption className="mt-5 flex flex-wrap items-center justify-center gap-4">
            <span className="display t-dim text-[1.05rem] italic">
              {hero.video.caption}
            </span>

            <button
              type="button"
              onClick={toggleSound}
              aria-pressed={!muted}
              className="edge inline-flex min-h-9 items-center gap-2 rounded-full border px-3.5 py-1.5 text-[0.75rem] font-semibold tracking-wide uppercase transition-colors duration-300 hover:border-sage hover:text-sage"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M11 5 6 9H3v6h3l5 4V5Z" />
                {muted ? (
                  <path d="M22 9l-6 6M16 9l6 6" />
                ) : (
                  <>
                    <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                    <path d="M18.5 5.5a9 9 0 0 1 0 13" />
                  </>
                )}
              </svg>
              {muted ? (playing ? "Turn sound on" : "Play with sound") : "Mute"}
            </button>
          </figcaption>
        </figure>

        {/* ---------------- The question ---------------- */}
        <h1 className="question max-w-[54rem] text-[clamp(2.2rem,5.4vw,4.2rem)]">
          <span data-hero-mask>
            <span className="block t-fg">{hero.headline.before}</span>
          </span>
          <span data-hero-mask>
            <span className="my-1 block">
              <span className="mark">{hero.headline.marked}</span>
            </span>
          </span>
          <span data-hero-mask>
            {/* Resolves out of the poster voice into the editorial one. */}
            <span className="display accent block text-[0.86em] normal-case">
              {hero.headline.after}
            </span>
          </span>
        </h1>

        <p data-hero-fade className="t-dim max-w-[36rem] text-[1.0625rem]">
          {hero.body}
        </p>

        {/* Nothing is scheduled, so the primary action is the notify list. */}
        <div data-hero-fade className="w-full max-w-[30rem] text-left">
          <NotifyForm source="hero" tone="dark" label={hero.primaryCta.label} />
        </div>

        <ul
          data-hero-fade
          className="edge flex flex-wrap items-center justify-center gap-x-5 gap-y-3 border-t pt-6"
        >
          {hero.indicators.map((item, i) => (
            <li key={item} className="eyebrow t-faint flex items-center gap-5">
              {i > 0 && <span className="h-1 w-1 rounded-full bg-sage" />}
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
