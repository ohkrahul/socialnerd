"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gallery } from "@/lib/content";

/* Masonry spans. Uneven on purpose — a tidy grid would read as a stock
   template, and the brief asks for organic and imperfect. */
const spans = {
  tall: "sm:row-span-2 aspect-[3/4]",
  wide: "sm:col-span-2 aspect-[16/10]",
  normal: "aspect-[4/3]",
};

/* Slight rotations, cycled by index. Photographs pinned to a board, not
   pixels snapped to a grid. */
const tilts = ["-rotate-[0.6deg]", "rotate-[0.5deg]", "rotate-[0.3deg]", "-rotate-[0.4deg]"];

function Frame({ item, index, priority }) {
  return (
    <figure
      data-reveal={(index % 3) * 0.08}
      className={`group relative overflow-hidden rounded-xl border border-ink/12 ${spans[item.span]} ${tilts[index % tilts.length]}`}
    >
      {item.type === "image" && (
        <Image
          src={item.src}
          alt={item.caption}
          fill
          sizes="(max-width: 640px) 100vw, 40vw"
          priority={priority}
          className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
        />
      )}

      {item.type === "video" && (
        <video
          data-lazy-video
          data-src={item.src}
          muted
          loop
          playsInline
          preload="none"
          aria-label={item.caption}
          className="h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
        />
      )}

      {item.type === "note" && (
        <div className="flex h-full w-full flex-col justify-center bg-sand/55 px-7 py-9">
          <p className="display text-[clamp(1.35rem,2.4vw,1.9rem)] text-ink/85">
            &ldquo;{item.note}&rdquo;
          </p>
          <div className="mt-5 h-px w-12 bg-ink/25" />
        </div>
      )}

      <figcaption
        className={`absolute inset-x-0 bottom-0 p-5 text-[0.8125rem] font-medium ${
          item.type === "note"
            ? "text-ink/50"
            : "bg-gradient-to-t from-ink/85 to-transparent pt-14 text-ivory/90"
        }`}
      >
        {item.caption}
      </figcaption>
    </figure>
  );
}

export default function Gallery() {
  const root = useRef(null);

  // Videos are the heaviest thing on the page. Nothing downloads until the
  // tile is actually on screen, and playback stops the moment it leaves.
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
    <section ref={root} className="relative py-(--spacing-section)">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[38rem]">
            <p data-reveal className="eyebrow text-green">
              The experience
            </p>
            <h2 data-mask className="display mt-6 text-[clamp(2.2rem,4.6vw,3.6rem)]">
              <span className="block">
                What it actually <span className="accent">looks like.</span>
              </span>
            </h2>
          </div>
          <p data-reveal="0.05" className="max-w-[22rem] text-[0.9375rem] text-ink/60">
            No photographer walking the room. These are taken by whoever
            happened to be holding the one allowed phone.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
          {gallery.map((item, i) => (
            <Frame key={item.caption} item={item} index={i} priority={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}
