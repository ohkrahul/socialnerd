import { pastEvents } from "@/lib/content";

/* Poster grounds, cycled. Cultural event posters, not a uniform card set. */
const grounds = [
  "bg-ink text-ivory",
  "bg-green text-ivory",
  "bg-sand text-ink",
  "bg-ink-deep text-ivory",
];

export default function PastEvents() {
  return (
    <section className="relative py-(--spacing-section)">
      <div className="shell flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-[36rem]">
          <p data-reveal className="eyebrow text-green">
            The archive
          </p>
          <h2 data-mask className="display mt-6 text-[clamp(2.2rem,4.6vw,3.6rem)]">
            <span className="block">
              Twenty-five rooms, <span className="accent">so far.</span>
            </span>
          </h2>
        </div>
        <p data-reveal="0.05" className="eyebrow text-ink/40">
          Scroll for more →
        </p>
      </div>

      <div data-reveal="0.1" className="rail mt-14 gap-5">
        {pastEvents.map((ev, i) => (
          <article key={ev.title} className="w-[min(82vw,20rem)]">
            {/* Poster */}
            <div
              className={`relative flex aspect-[3/4] flex-col justify-between overflow-hidden rounded-xl p-7 ${grounds[i % grounds.length]}`}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 200 200"
                className="pointer-events-none absolute -right-12 -bottom-10 h-52 w-52 opacity-[0.09]"
                fill="currentColor"
              >
                <path d="M100 18c45 0 82 29 82 65 0 36-37 65-82 65-9 0-18-1-26-3l-38 19 10-32C26 120 18 105 18 83c0-36 37-65 82-65Z" />
              </svg>

              <div className="relative flex items-center justify-between">
                <span className="eyebrow opacity-60">
                  No. {String(pastEvents.length - i + 21).padStart(2, "0")}
                </span>
                <span className="eyebrow opacity-60">{ev.attendance} seats</span>
              </div>

              <div className="relative">
                <h3 className="display text-[1.9rem]">{ev.title}</h3>
                <div className="mt-4 h-px w-12 bg-current opacity-40" />
                <p className="mt-4 text-[0.875rem] leading-relaxed opacity-70">
                  &ldquo;{ev.question}&rdquo;
                </p>
              </div>

              <p className="eyebrow relative opacity-60">{ev.date}</p>
            </div>

            {/* Caption block */}
            <div className="mt-5 flex items-baseline justify-between gap-4">
              <p className="text-[0.875rem] text-ink/60">{ev.venue}</p>
              <a
                href={ev.recapUrl}
                className="group shrink-0 text-[0.875rem] font-semibold text-green"
              >
                View Recap
                <span className="ml-1.5 inline-block transition-transform duration-500 group-hover:translate-x-1">
                  →
                </span>
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
