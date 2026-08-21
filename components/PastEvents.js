import { pastEvents, archiveNote } from "@/lib/content";

/**
 * The archive. Two conversations, which is the real count — two earlier
 * attempts at Unfiltered in Vikhroli were cancelled before the community
 * settled at Slow Brew.
 *
 * Attendance is not shown. One of these rooms drew eight people; that is the
 * honest number and also not something to make a first-time visitor weigh up on
 * a card. The archive note says plainly how early this is instead, because being
 * early is the actual offer.
 */

/* Poster grounds, alternating. Cultural event posters, not a uniform card set. */
const grounds = ["bg-ink text-ivory", "bg-green text-ivory"];

export default function PastEvents() {
  return (
    <section className="ground-ink relative py-(--spacing-section)">
      <div className="shell grid grid-cols-1 gap-x-16 gap-y-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p data-reveal className="eyebrow t-accent">
            The archive
          </p>
          <h2 data-mask className="question mt-6 text-[clamp(2.1rem,4.6vw,3.5rem)]">
            <span className="block">{archiveNote.heading}</span>
          </h2>
          <p data-reveal="0.05" className="t-dim mt-6 max-w-[30rem]">
            {archiveNote.body}
          </p>
        </div>

        <div className="lg:col-span-7">
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {pastEvents.map((event, i) => (
              <li key={event.meetupId} data-reveal={i * 0.08}>
                <article>
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
                        No. {String(pastEvents.length - i).padStart(2, "0")}
                      </span>
                      <span className="eyebrow opacity-60">{event.time}</span>
                    </div>

                    <div className="relative">
                      <h3 className="question text-[1.75rem]">{event.title}</h3>
                      <div className="mt-4 h-px w-12 bg-current opacity-40" />
                      <p className="mt-4 text-[0.875rem] leading-relaxed opacity-70">
                        &ldquo;{event.question}&rdquo;
                      </p>
                    </div>

                    <p className="eyebrow relative opacity-60">{event.date}</p>
                  </div>

                  <div className="mt-4 flex items-baseline justify-between gap-4">
                    <p className="t-faint text-[0.875rem]">{event.venue}</p>
                    <a
                      href={event.meetupUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group t-accent shrink-0 text-[0.875rem] font-semibold"
                    >
                      On Meetup
                      <span className="ml-1.5 inline-block transition-transform duration-500 group-hover:translate-x-1">
                        →
                      </span>
                    </a>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
