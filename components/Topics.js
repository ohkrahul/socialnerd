"use client";

import { topics } from "@/lib/content";

/* One glyph per topic. Line-drawn to match the journey icons. */
const icons = [
  <path key="ei" d="M12 21s-7-4.4-7-9.6A4.4 4.4 0 0 1 12 8a4.4 4.4 0 0 1 7 3.4C19 16.6 12 21 12 21Z" />,
  <>
    <path key="hb1" d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" />
    <circle key="hb2" cx="12" cy="8" r="3.5" />
  </>,
  <>
    <path key="r1" d="M7 21V10" />
    <path key="r2" d="M17 21V10" />
    <path key="r3" d="M7 13c3 2 7 2 10 0" />
    <circle key="r4" cx="7" cy="6" r="2.4" />
    <circle key="r5" cx="17" cy="6" r="2.4" />
  </>,
  <>
    <circle key="i1" cx="12" cy="12" r="8.5" />
    <path key="i2" d="M12 3.5v17" />
  </>,
  <>
    <path key="p1" d="M4 19V6" />
    <path key="p2" d="M4 19h16" />
    <path key="p3" d="M8 15l4-5 3 3 4-6" />
  </>,
  <>
    <path key="f1" d="M12 4v11" />
    <path key="f2" d="M8 11l4 4 4-4" />
    <path key="f3" d="M5 20h14" />
  </>,
  <>
    <rect key="m1" x="3.5" y="3.5" width="7" height="7" rx="1.5" />
    <rect key="m2" x="13.5" y="13.5" width="7" height="7" rx="1.5" />
    <path key="m3" d="M10.5 7h4.5a2 2 0 0 1 2 2v4.5" />
  </>,
  <>
    <circle key="t1" cx="12" cy="12" r="8.5" />
    <path key="t2" d="M3.5 12h17" />
    <path key="t3" d="M12 3.5c2.5 2.4 3.9 5.4 3.9 8.5s-1.4 6.1-3.9 8.5c-2.5-2.4-3.9-5.4-3.9-8.5S9.5 5.9 12 3.5Z" />
  </>,
];

function TopicCard({ topic, icon }) {
  return (
    <article className="group relative flex h-full w-[17rem] flex-col overflow-hidden rounded-xl border border-ivory/12 bg-ink-deep p-6 transition-colors duration-500 hover:border-sage/50 lg:w-auto">
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6 text-sage transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-[14deg]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {icon}
      </svg>

      <h3 className="display mt-14 text-[1.5rem] text-ivory transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1">
        {topic.name}
      </h3>

      {/* The question is the payoff — held back until you lean in. */}
      <p className="mt-3 translate-y-3 text-[0.875rem] leading-relaxed text-ivory/0 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:text-ivory/60 group-focus-within:translate-y-0 group-focus-within:text-ivory/60">
        {topic.question}
      </p>
    </article>
  );
}

export default function Topics() {
  return (
    <section id="community" className="relative bg-ink py-(--spacing-section) text-ivory">
      <div className="shell">
        <div className="max-w-[46rem]">
          <p data-reveal className="eyebrow text-sage">
            Topics we explore
          </p>
          <h2 data-mask className="display mt-6 text-[clamp(2.2rem,5vw,4rem)]">
            <span className="block">
              We talk about the things{" "}
              <span className="accent">small talk avoids.</span>
            </span>
          </h2>
        </div>
      </div>

      {/* Rail on touch, grid on desktop — the same cards either way. */}
      <div data-reveal="0.1" className="mt-16">
        <div className="rail lg:hidden">
          {topics.map((topic, i) => (
            <TopicCard key={topic.name} topic={topic} icon={icons[i]} />
          ))}
        </div>

        <div className="shell hidden lg:block">
          <div className="grid grid-cols-4 gap-4">
            {topics.map((topic, i) => (
              <TopicCard key={topic.name} topic={topic} icon={icons[i]} />
            ))}
          </div>
        </div>
      </div>

      <p className="shell mt-8 text-[0.8125rem] text-ivory/40 lg:hidden">
        Swipe to see more →
      </p>
    </section>
  );
}
