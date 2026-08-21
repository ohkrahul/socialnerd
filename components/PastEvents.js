import { archiveNote, stats as defaultStats } from "@/lib/content";

/**
 * Proof, in one section: the conversations that actually happened, and the five
 * figures that are checkable.
 *
 * The figures used to have a section of their own. They are evidence for the
 * archive rather than a separate claim, so they live here now.
 *
 * Attendance is not displayed. One of these rooms drew eight people; that is the
 * honest number and also not something to make a first-time visitor weigh up on
 * a card. The archive note says plainly how early this is instead, because being
 * early is the actual offer.
 */

/* Alternating grounds. Cultural event posters, not a uniform card set. */
const grounds = ["bg-ink text-ivory", "bg-green text-ivory"];

function Poster({ event, index, total }) {
  return (
    <article>
      <div
        className={`relative flex aspect-[4/3] flex-col justify-between overflow-hidden rounded-xl p-7 ${grounds[index % grounds.length]}`}
      >
        {event.posterPath && (
          <>
            {/* Served from Postgres; next/image would only add a proxy hop. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={event.posterPath}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            {/* The photo used to run at 30% over the solid ground, which turned
                every face the same shade of green. It now runs at full opacity:
                the ground tints it instead of swallowing it, and a scrim carries
                the copy. These are the only pictures of the actual rooms — they
                should be legible. */}
            <div
              className={`absolute inset-0 mix-blend-multiply ${
                index % 2 === 0 ? "bg-ink/35" : "bg-green/40"
              }`}
            />
            <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/70 via-50% to-ink/5" />
          </>
        )}

        <svg
          aria-hidden="true"
          viewBox="0 0 200 200"
          className="pointer-events-none absolute -right-12 -bottom-10 h-52 w-52 opacity-[0.09]"
          fill="currentColor"
        >
          <path d="M100 18c45 0 82 29 82 65 0 36-37 65-82 65-9 0-18-1-26-3l-38 19 10-32C26 120 18 105 18 83c0-36 37-65 82-65Z" />
        </svg>

        <div className="relative flex items-center justify-between gap-3">
          <span className="eyebrow opacity-60">
            No. {String(total - index).padStart(2, "0")}
          </span>
          <span className="eyebrow opacity-60">{event.venueName}</span>
        </div>

        {/* Title, question and date are one bottom-anchored block. As three
            separate flex children the title was pushed to the middle of the
            card, which is exactly where the faces are. */}
        <div className="relative">
          <h3 className="question text-[1.75rem]">{event.title}</h3>
          <div className="mt-4 h-px w-12 bg-current opacity-40" />
          {(event.memorableQuestion || event.subtitle) && (
            <p className="mt-4 text-[0.875rem] leading-relaxed opacity-80">
              &ldquo;{event.memorableQuestion || event.subtitle}&rdquo;
            </p>
          )}
          <p className="eyebrow mt-5 opacity-70">{event.shortDate}</p>
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-4">
        <p className="t-faint text-[0.875rem]">{event.timeLabel}</p>
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
  );
}

export default function PastEvents({
  events = [],
  stats = defaultStats,
  archiveNote: note = archiveNote.body,
}) {
  // Nothing published yet is a real state — sync creates drafts and an organiser
  // has to publish. The figures still stand on their own, so only the archive
  // half is conditional.
  const hasArchive = events.length > 0;

  return (
    <section id="archive" className="ground-deep relative py-(--spacing-section)">
      {/* Stacked, not a 5/7 split. With two events the narrow column held a
          three-line heading against a full-height card, leaving most of its
          height empty; across the full width the cards also stop cropping
          group photographs into portraits. */}
      {hasArchive && (
        <div className="shell">
          <div className="max-w-[38rem]">
            <p data-reveal className="eyebrow t-accent">
              The archive
            </p>
            <h2 data-mask className="question mt-6 text-[clamp(2.1rem,4.6vw,3.5rem)]">
              <span className="block">
                {events.length === 1
                  ? "One room so far."
                  : `${events.length} rooms so far.`}
              </span>
            </h2>
            <p data-reveal="0.05" className="t-dim mt-6 max-w-[30rem]">
              {note}
            </p>
          </div>

          <div className="mt-16">
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {events.map((event, i) => (
                <li key={event.meetupId} data-reveal={i * 0.08}>
                  <Poster event={event} index={i} total={events.length} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className={`shell ${hasArchive ? "edge mt-20 border-t pt-12" : ""}`}>
        <ul className="grid grid-cols-2 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
          {stats.map((stat, i) => (
            <li key={stat.label} data-reveal={i * 0.05} className="text-center">
              {/* The emphasised figure gets size and the accent colour, not
                  font-weight: the display face ships at 400 only, so bolding it
                  would just let the browser smear a synthetic weight. */}
              <span
                className={`numeral block ${
                  stat.emphasis
                    ? "t-accent text-[clamp(2.9rem,5vw,4rem)]"
                    : "text-[clamp(2.1rem,3.6vw,2.9rem)]"
                }`}
              >
                {stat.value}
              </span>
              <span
                className={`eyebrow mt-3 block ${
                  stat.emphasis ? "t-fg font-extrabold" : "t-faint"
                }`}
              >
                {stat.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
