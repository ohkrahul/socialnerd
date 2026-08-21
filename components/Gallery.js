"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gallery } from "@/lib/content";

/**
 * Masonry gallery. Uneven spans on purpose — a tidy grid reads as a template,
 * and the brief asks for organic and imperfect.
 *
 * The community's own media only. Stills are frames from their footage, the
 * clips are theirs, the poster is theirs. No illustration: a drawing sitting
 * next to documentary footage muddies which is a record and which is not.
 *
 *   image   a real frame from a real evening
 *   video   their own clip
 *   poster  their own event artwork, shown as artwork rather than as a photo
 */

const spans = {
  tall: "sm:row-span-2 aspect-[3/4]",
  wide: "sm:col-span-2 aspect-[16/10]",
  normal: "aspect-[4/3]",
};

/* Slight rotations, cycled. Pinned to a board, not snapped to a grid. */
const tilts = [
  "-rotate-[0.6deg]",
  "rotate-[0.5deg]",
  "rotate-[0.3deg]",
  "-rotate-[0.4deg]",
];

const zoom =
  "transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]";

function Tile({ item, index }) {
  return (
    <figure
      data-reveal={(index % 3) * 0.08}
      className={`group relative overflow-hidden rounded-xl border border-ivory/12 ${spans[item.span]} ${tilts[index % tilts.length]}`}
    >
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
          className={`h-full w-full object-cover ${zoom}`}
        />
      ) : (
        <Image
          src={item.src}
          alt={item.caption}
          fill
          sizes="(max-width: 640px) 100vw, 45vw"
          className={`${zoom} ${
            // A poster is artwork with its own margins; letting it fill the tile
            // would crop the typography its designer centred.
            item.type === "poster"
              ? "bg-ink-deep object-contain p-3"
              : "object-cover"
          }`}
        />
      )}

      <figcaption className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink/85 to-transparent p-5 pt-14 text-[0.8125rem] font-medium text-ivory/90">
        {item.caption}
      </figcaption>
    </figure>
  );
}

export default function Gallery() {
  const root = useRef(null);

  // Video is the heaviest thing here. Nothing downloads until its tile is on
  // screen, and playback stops the moment it leaves.
  useEffect(() => {
    const videos = root.current.querySelectorAll("[data-lazy-video]");

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const v = entry.target;
          if (entry.isIntersecting) {
            if (!v.src) v.src = v.dataset.src;
            v.play().catch(() => {});
          } else {
            v.pause();
          }
        });
      },
      { rootMargin: "160px 0px", threshold: 0.15 },
    );

    videos.forEach((v) => io.observe(v));
    return () => io.disconnect();
  }, []);

  return (
    <section ref={root} className="ground-deep relative py-(--spacing-section)">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[38rem]">
            <p data-reveal className="eyebrow t-accent">
              The experience
            </p>
            <h2 data-mask className="question mt-6 text-[clamp(2.1rem,4.6vw,3.5rem)]">
              <span className="block">
                What it actually <span className="mark">looks like.</span>
              </span>
            </h2>
          </div>
          <p data-reveal="0.05" className="t-dim max-w-[22rem] text-[0.9375rem]">
            No photographer walking the room. Every frame here is from the one
            allowed phone, which is why it looks like a Saturday evening rather
            than a brochure.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
          {gallery.map((item, i) => (
            <Tile key={item.caption} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
