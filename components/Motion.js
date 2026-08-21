"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

/**
 * The one place scrolling and global reveals are wired.
 *
 * Lenis owns the scroll position and feeds ScrollTrigger, and GSAP's ticker
 * drives Lenis' RAF — a single loop rather than two competing ones. Section
 * components add their own bespoke timelines on top via useGSAP.
 *
 * The `anim` class that hides [data-reveal] elements is set by a blocking
 * script in layout.js, so nothing flashes visible before this mounts. If JS
 * never runs, the class is never added and the page reads at full opacity.
 */
export default function Motion() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      document.documentElement.classList.remove("anim");
      return;
    }

    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.4,
      // Native touch scrolling feels better than a hijacked one on phones.
      smoothTouch: false,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Anchor links have to go through Lenis or they jump.
    const onAnchorClick = (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -80, duration: 1.4 });
    };
    document.addEventListener("click", onAnchorClick);

    const ctx = gsap.context(() => {
      // Soft fade + rise. The default motion of the whole site.
      gsap.utils.toArray("[data-reveal]").forEach((el) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: "power3.out",
          delay: parseFloat(el.dataset.reveal) || 0,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      // Text mask reveals — a line rises out from behind its own edge.
      gsap.utils.toArray("[data-mask]").forEach((el) => {
        gsap.to(el.children, {
          y: 0,
          duration: 1.25,
          ease: "power4.out",
          stagger: 0.09,
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });

      // Parallax on the large photographs.
      gsap.utils.toArray("[data-parallax]").forEach((el) => {
        const distance = parseFloat(el.dataset.parallax) || 60;
        gsap.fromTo(
          el,
          { y: -distance },
          {
            y: distance,
            ease: "none",
            scrollTrigger: {
              trigger: el.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });

      // Counters that tick up when they come into view.
      gsap.utils.toArray("[data-count]").forEach((el) => {
        const end = parseFloat(el.dataset.count);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: end,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          onUpdate: () => {
            el.textContent = Math.round(obj.v);
          },
        });
      });
    });

    // Late-loading media changes document height; ScrollTrigger needs telling.
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      document.removeEventListener("click", onAnchorClick);
      window.removeEventListener("load", onLoad);
      gsap.ticker.remove(raf);
      ctx.revert();
      lenis.destroy();
    };
  }, []);

  return null;
}
