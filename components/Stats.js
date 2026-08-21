import { stats } from "@/lib/content";

/* Hand-drawn marks, one per figure. Five glyphs is not an icon dependency. */
const marks = [
  "M4 17c3-6 6 4 8-2s4 3 8-3",
  "M3 16c4-9 7 6 9-3s5 4 9-4",
  "M12 3c3 5 6 7 6 11a6 6 0 0 1-12 0c0-4 3-6 6-11Z",
  "M12 3l2.6 5.7 6.4.7-4.7 4.3 1.3 6.3L12 17l-5.6 3 1.3-6.3L3 9.4l6.4-.7Z",
  "M5 12l4 5 10-11",
];

export default function Stats() {
  return (
    <section className="ground-deep relative py-20">
      <div className="shell">
        <ul className="grid grid-cols-2 gap-y-12 sm:grid-cols-3 lg:grid-cols-5">
          {stats.map((stat, i) => (
            <li
              key={stat.label}
              data-reveal={i * 0.06}
              className="flex flex-col items-center text-center"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-7 w-7 text-sage"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d={marks[i]} />
              </svg>
              <span className="numeral mt-5 text-[clamp(2.5rem,4.5vw,3.5rem)]">
                {stat.value}
              </span>
              <span className="eyebrow t-faint mt-3">{stat.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
