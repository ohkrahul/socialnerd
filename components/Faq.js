import { faqs } from "@/lib/content";

/* Split down the middle so both columns stay balanced as the list grows. */
const half = Math.ceil(faqs.length / 2);
const columns = [faqs.slice(0, half), faqs.slice(half)];

function Item({ item }) {
  return (
    <details className="faq group border-b border-ink/12">
      <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
        <h3 className="display text-[1.35rem] leading-snug transition-colors duration-300 group-hover:text-green">
          {item.q}
        </h3>

        {/* One horizontal bar, one vertical bar that collapses. A plus
            becoming a minus without swapping icons. */}
        <span
          aria-hidden="true"
          className="relative mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center"
        >
          <span className="absolute h-px w-4 bg-ink/60" />
          <span className="plus-v absolute h-4 w-px bg-ink/60" />
        </span>
      </summary>

      <p className="pb-7 pr-10 text-[0.9375rem] leading-relaxed text-ink/65">
        {item.a}
      </p>
    </details>
  );
}

export default function Faq() {
  return (
    <section id="faq" className="relative bg-sand/40 py-(--spacing-section)">
      <div className="shell grid grid-cols-1 gap-x-16 gap-y-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p data-reveal className="eyebrow text-green">
            Before you book
          </p>
          <h2 data-mask className="display mt-6 text-[clamp(2.2rem,4vw,3.2rem)]">
            <span className="block">Questions people ask.</span>
          </h2>
          <p data-reveal="0.05" className="mt-6 max-w-[22rem] text-[0.9375rem] text-ink/65">
            Still unsure about something? Write to us and a human will reply.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-x-14 lg:col-span-8 lg:grid-cols-2">
          {columns.map((column, i) => (
            <div key={i} data-reveal={i * 0.08}>
              {column.map((item) => (
                <Item key={item.q} item={item} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
