"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { nav } from "@/lib/content";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Nav() {
  const root = useRef(null);
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);

  useGSAP(() => {
    ScrollTrigger.create({
      start: "top -120",
      end: 99999,
      onToggle: (self) => setSolid(self.isActive),
    });
  });

  return (
    <>
      <header
        ref={root}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          solid
            ? "bg-ink/85 backdrop-blur-md py-3 shadow-[0_1px_0_rgba(249,241,223,0.12)]"
            : "bg-transparent py-6"
        }`}
      >
        <div className="shell flex items-center justify-between gap-8">
          <a
            href="#top"
            className="display text-ivory text-2xl leading-none tracking-tight"
          >
            Social Nerds<span className="text-sage">.</span>
          </a>

          <nav className="hidden items-center gap-9 lg:flex" aria-label="Main">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="group relative text-[0.9rem] font-medium text-ivory/75 transition-colors hover:text-ivory"
              >
                {item.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-sage transition-all duration-[400ms] group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a href="#top" className="btn btn-ivory hidden md:inline-flex">
              Join the Next Conversation
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="flex h-11 w-11 flex-col items-center justify-center gap-[5px] lg:hidden"
            >
              <span className="block h-px w-6 bg-ivory" />
              <span className="block h-px w-6 bg-ivory" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-[70] bg-ink transition-opacity duration-[400ms] lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="shell flex h-full flex-col py-6">
          <div className="flex items-center justify-between">
            <span className="display text-ivory text-2xl">
              Social Nerds<span className="text-sage">.</span>
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="flex h-11 w-11 items-center justify-center text-3xl text-ivory"
            >
              &times;
            </button>
          </div>

          <nav className="mt-16 flex flex-col gap-2" aria-label="Mobile">
            {nav.map((item, i) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="display border-b border-ivory/10 py-4 text-[2.25rem] text-ivory"
              >
                <span className="eyebrow mr-4 align-super text-sage">
                  0{i + 1}
                </span>
                {item.label}
              </a>
            ))}
          </nav>

          <a
            href="#top"
            onClick={() => setOpen(false)}
            className="btn btn-ivory mt-auto justify-center"
          >
            Join the Next Conversation
          </a>
        </div>
      </div>
    </>
  );
}
