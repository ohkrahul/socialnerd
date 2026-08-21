import Image from "next/image";
import { rules } from "@/lib/content";

/**
 * House rules, as four illustrated cards.
 *
 * The illustrations sit on their own ivory ground, so on the dark page these
 * read as four pieces of paper pinned up — which is closer to what a house rule
 * actually is than four line icons would be.
 */
export default function Rules() {
  return (
    <section className="ground-ink relative py-(--spacing-section)">
      <div className="shell">
        <div className="max-w-[44rem]">
          <p data-reveal className="eyebrow t-accent">
            House rules
          </p>
          <h2 data-mask className="question mt-6 text-[clamp(2.1rem,4.6vw,3.5rem)]">
            <span className="block">
              A better conversation needs{" "}
              <span className="mark">a different kind of room.</span>
            </span>
          </h2>
        </div>

        <ul className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {rules.map((rule, i) => (
            <li
              key={rule.title}
              data-reveal={i * 0.07}
              className="group edge overflow-hidden rounded-xl border"
            >
              <div className="relative aspect-square overflow-hidden bg-ivory">
                <Image
                  src={rule.art}
                  alt={rule.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                />
              </div>

              <div className="p-6">
                <h3 className="display text-[1.5rem]">{rule.title}</h3>
                <p className="t-dim mt-3 text-[0.9375rem] leading-relaxed">
                  {rule.body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
