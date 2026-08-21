"use client";

import { useRef } from "react";
import gsap from "gsap";

/**
 * Magnetic hover — the element leans toward the cursor and springs back.
 * Wraps its child rather than rendering a button, so it works on links,
 * buttons and anything else.
 */
export default function Magnetic({ children, strength = 0.35 }) {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el || window.matchMedia("(hover: none)").matches) return;
    const box = el.getBoundingClientRect();
    gsap.to(el, {
      x: (e.clientX - (box.left + box.width / 2)) * strength,
      y: (e.clientY - (box.top + box.height / 2)) * strength,
      duration: 0.7,
      ease: "power3.out",
    });
  };

  const onLeave = () => {
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.4)" });
  };

  return (
    <span
      ref={ref}
      className="inline-block"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </span>
  );
}
