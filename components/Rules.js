"use client";

import { rules } from "@/lib/content";

/* One illustration per rule. Each is a single path so it can draw itself on
   hover with a dash animation — the "icon slightly draws" the brief asks for. */
const drawings = [
  // Phones away — a phone tipping into a box
  "M9 4h6v13H9zM4 17h16l-1.5 4h-13z",
  // Curiosity before certainty — a question mark growing out of a seed
  "M12 20v-3c0-2 3-2.5 3-5a3 3 0 0 0-6 0M12 4v2",
  // Disagree without dismissing — two bubbles overlapping, not colliding
  "M3 8a4 4 0 0 1 4-4h5a4 4 0 0 1 0 8H7l-4 3zM12 14a4 4 0 0 0 4 4h1l4 3-1-3a4 4 0 0 0-1-8",
  // Everyone participates — a circle of equal marks
  "M12 3v3M18.4 5.6l-2.1 2.1M21 12h-3M18.4 18.4l-2.1-2.1M12 21v-3M5.6 18.4l2.1-2.1M3 12h3M5.6 5.6l2.1 2.1",
];

export default function Rules() {
  return (
    <section className="relative py-(--spacing-section)">
      <div className="shell">
        <div className="max-w-[44rem]">
          <p data-reveal className="eyebrow text-green">
            House rules
          </p>
          <h2 data-mask className="display mt-6 text-[clamp(2.2rem,4.6vw,3.6rem)]">
            <span className="block">
              A better conversation needs{" "}
              <span className="accent">a different kind of room.</span>
            </span>
          </h2>
        </div>

        <ul className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-ink/12 bg-ink/12 sm:grid-cols-2 lg:grid-cols-4">
          {rules.map((rule, i) => (
            <li
              key={rule.title}
              data-reveal={i * 0.07}
              className="group bg-paper p-8 transition-colors duration-500 hover:bg-sand/35"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-9 w-9 text-green"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {/* Base sits at rest; the copy on top re-draws itself over it
                    on hover. Two paths, because a single one would have to
                    start invisible to be drawable. */}
                <path d={drawings[i]} opacity="0.28" />
                <path
                  d={drawings[i]}
                  className="[stroke-dasharray:130] [stroke-dashoffset:130] transition-[stroke-dashoffset] duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:[stroke-dashoffset:0]"
                />
              </svg>

              <h3 className="display mt-10 text-[1.6rem]">{rule.title}</h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink/65">
                {rule.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
