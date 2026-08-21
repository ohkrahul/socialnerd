"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { questions } from "@/lib/content";
import Magnetic from "./Magnetic";

export default function QuestionGenerator() {
  const [index, setIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const text = useRef(null);
  const card = useRef(null);
  const idx = useRef(0);
  const busy = useRef(false);

  const current = questions[index];

  const next = () => {
    if (busy.current) return;

    const advance = () => {
      const n = (idx.current + 1) % questions.length;
      idx.current = n;
      // Written straight to the DOM as well as to state so the swap is
      // guaranteed to have landed before the incoming tween paints.
      if (text.current) text.current.textContent = questions[n];
      setIndex(n);
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      advance();
      return;
    }

    busy.current = true;
    gsap
      .timeline({ onComplete: () => (busy.current = false) })
      .to(text.current, {
        opacity: 0,
        filter: "blur(10px)",
        rotate: -2.5,
        y: -20,
        duration: 0.42,
        ease: "power2.in",
      })
      .to(card.current, { rotate: -0.9, duration: 0.42 }, 0)
      .add(advance)
      .fromTo(
        text.current,
        { opacity: 0, filter: "blur(12px)", rotate: 2.5, y: 22 },
        {
          opacity: 1,
          filter: "blur(0px)",
          rotate: 0,
          y: 0,
          duration: 0.75,
          ease: "power3.out",
        },
      )
      .to(card.current, { rotate: 0, duration: 0.75, ease: "power3.out" }, "<");
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(current);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="ground-paper relative overflow-hidden py-(--spacing-section)">
      {/* Slowly morphing bubble behind the card. CSS keyframes rather than a
          paid MorphSVG licence. */}
      <div
        aria-hidden="true"
        className="morph pointer-events-none absolute top-1/2 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 bg-sand/45"
      />

      <div className="shell relative">
        <div className="mx-auto max-w-[46rem] text-center">
          <p data-reveal className="eyebrow t-accent">
            Try one on yourself
          </p>
          <h2 data-mask className="question mt-6 text-[clamp(2.1rem,4.8vw,3.5rem)]">
            <span className="block">What would you bring to the table?</span>
          </h2>
        </div>

        <div
          ref={card}
          data-reveal="0.08"
          className="card relative mx-auto mt-14 max-w-[44rem] rounded-[1.75rem] rounded-bl-md px-8 py-14 will-change-transform sm:px-14 sm:py-16"
        >
          <span
            aria-hidden="true"
            className="display absolute top-3 left-7 text-[5rem] leading-none text-sage/35 select-none"
          >
            &ldquo;
          </span>

          <p
            ref={text}
            aria-live="polite"
            className="display relative text-center text-[clamp(1.75rem,3.6vw,2.75rem)] will-change-[filter,transform]"
          >
            {current}
          </p>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            <Magnetic strength={0.22}>
              <button type="button" onClick={next} className="btn btn-solid">
                Give Me Another Question
              </button>
            </Magnetic>

            <a
              href={`https://wa.me/?text=${encodeURIComponent(current)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              Share on WhatsApp
            </a>

            <button type="button" onClick={copy} className="btn btn-ghost">
              {copied ? "Copied" : "Copy question"}
            </button>
          </div>

          <p className="eyebrow t-faint mt-8 text-center">
            {index + 1} / {questions.length}
          </p>
        </div>
      </div>
    </section>
  );
}
