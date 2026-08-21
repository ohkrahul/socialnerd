"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Carousel for the community's own event artwork.
 *
 * Native scroll with scroll-snap does the moving; the buttons only nudge
 * scrollLeft. That means touch swipe, trackpad, shift-wheel, keyboard and a
 * screen reader all work without being reimplemented, and there is no carousel
 * library to carry. The arrows are progressive enhancement over a thing that
 * already scrolls.
 *
 * The controls disappear entirely when everything already fits, rather than
 * sitting there disabled — an arrow that cannot do anything is noise.
 *
 * Aligned to the shell rather than bled to the viewport edge: full-bleed put the
 * first poster's caption hard against the window with the section heading
 * indented, which read as a bug because it was one.
 */
/** Cloudinary already did f_auto,q_auto; a second optimizer pass is waste. */
const isRemote = (src) => /^https?:\/\//.test(src);

export default function PosterRail({ items = [] }) {
  const scroller = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);
  const [overflows, setOverflows] = useState(false);

  const measure = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setOverflows(max > 4);
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft >= max - 4);
  }, []);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    measure();
    // Width changes when the viewport resizes or a poster finishes decoding.
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    Array.from(el.children).forEach((child) => ro.observe(child));
    return () => ro.disconnect();
  }, [measure, items.length]);

  const nudge = (direction) => {
    const el = scroller.current;
    if (!el) return;
    const first = el.querySelector("li");
    // One card plus its gap, so a click lands cleanly on the next snap point.
    const step = first ? first.getBoundingClientRect().width + 20 : el.clientWidth * 0.8;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: direction * step, behavior: reduced ? "auto" : "smooth" });
  };

  if (items.length === 0) return null;

  return (
    <div className="mt-20">
      <div className="shell flex items-end justify-between gap-6">
        <div>
          <p className="eyebrow t-faint">Their own posters</p>
          <p className="t-dim mt-2 max-w-[30rem] text-[0.875rem]">
            Artwork they made for each conversation. Not photographs of a room —
            kept apart from the clips above for that reason.
          </p>
        </div>

        {overflows && (
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => nudge(-1)}
              disabled={atStart}
              aria-label="Previous posters"
              className="edge grid h-11 w-11 place-items-center rounded-full border transition-opacity disabled:opacity-30"
            >
              <span aria-hidden="true">←</span>
            </button>
            <button
              type="button"
              onClick={() => nudge(1)}
              disabled={atEnd}
              aria-label="Next posters"
              className="edge grid h-11 w-11 place-items-center rounded-full border transition-opacity disabled:opacity-30"
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>
        )}
      </div>

      <div className="shell mt-6">
        <ul
          ref={scroller}
          onScroll={measure}
          tabIndex={0}
          role="region"
          aria-label="Event posters, scrollable"
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item) => (
            <li
              key={item.src}
              className="w-[17rem] shrink-0 snap-start sm:w-[20rem] lg:w-[23rem]"
            >
              {/* object-contain, not cover: a poster is artwork with its own
                  margins and cropping it cuts the typography its designer
                  centred. The letterboxing is the honest trade. */}
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-ivory/12 bg-ink-deep">
                {item.type === "video" ? (
                  <video
                    data-lazy-video
                    data-src={item.src}
                    poster={item.poster}
                    muted
                    loop
                    playsInline
                    preload="none"
                    aria-label={item.caption}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <Image
                    src={item.src}
                    alt={item.caption}
                    fill
                    unoptimized={isRemote(item.src)}
                    sizes="(max-width: 640px) 17rem, 23rem"
                    className="object-contain"
                  />
                )}
              </div>
              <p className="mt-3 text-[0.8125rem] font-medium">{item.caption}</p>
              {item.meta && (
                <p className="t-faint mt-0.5 text-[0.75rem]">{item.meta}</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
