import { audience } from "@/lib/content";

function Column({ data, tone }) {
  const good = tone === "good";

  return (
    <div
      data-reveal={good ? 0 : 0.08}
      className={`flex flex-col p-8 sm:p-11 ${good ? "bg-paper" : "bg-sand/35"}`}
    >
      <h3 className="display max-w-[20rem] text-[clamp(1.7rem,2.8vw,2.15rem)]">
        {data.heading}
      </h3>

      <ul className="mt-9 flex flex-col gap-5">
        {data.items.map((item) => (
          <li key={item} className="flex gap-4 text-[0.9375rem] leading-relaxed">
            <svg
              viewBox="0 0 24 24"
              className={`mt-0.5 h-5 w-5 shrink-0 ${good ? "text-green" : "text-ink/60"}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {good ? <path d="M5 12.5l4.5 4.5L19 7" /> : <path d="M7 7l10 10M17 7L7 17" />}
            </svg>
            {/* Both columns read at the same weight. Dimming this one measured
                2.92:1 and, worse, made an equally true list look disabled. The
                icon carries the distinction; opacity should not. */}
            <span className="text-ink/80">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Audience() {
  return (
    <section id="about" className="ground-paper relative pt-(--spacing-section) pb-20">
      <div className="shell">
        <div className="max-w-[40rem]">
          <p data-reveal className="eyebrow t-accent">
            Honestly, though
          </p>
          <h2 data-mask className="question mt-6 text-[clamp(2.1rem,4.6vw,3.5rem)]">
            <span className="block">
              This room is not <span className="accent">for everyone.</span>
            </span>
          </h2>
          <p data-reveal="0.05" className="t-dim mt-6">
            We would rather you read this and decide it is not your thing than
            spend an evening waiting for it to become something else.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-ink/12 bg-ink/12 lg:grid-cols-2">
          <Column data={audience.forYou} tone="good" />
          <Column data={audience.notForYou} tone="bad" />
        </div>
      </div>
    </section>
  );
}
