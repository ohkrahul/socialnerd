import { siteMeta, social } from "@/lib/content";

/**
 * Persistent way into the WhatsApp channel.
 *
 * No "use client" and no JavaScript: it is an anchor with fixed positioning, so
 * there is nothing to hydrate and nothing to go wrong. This replaced a planned
 * chatbot — for a community whose whole claim is that its facts are checkable, a
 * link to a human beats a model that might invent a date.
 *
 * Sits above StickyCta on small screens: that bar is full-width at z-50 and
 * mobile-only, so a float at the same corner would land underneath it.
 *
 * Deliberately in the site's own palette rather than WhatsApp green — the glyph
 * is what makes it recognisable, and a stock green FAB is exactly the templated
 * look this brand says it is allergic to.
 */
export default function WhatsappFloat() {
  return (
    <a
      href={social.whatsappChannel}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Join ${siteMeta.name} on WhatsApp`}
      className="btn btn-ivory fixed right-4 bottom-24 z-[55] shadow-[0_18px_40px_-18px_rgba(0,0,0,0.85)] lg:right-6 lg:bottom-6"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="currentColor" aria-hidden="true">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm5.8 14.03c-.24.68-1.4 1.3-1.93 1.35-.53.05-1.02.07-1.75-.2-.43-.16-.99-.35-1.7-.66-2.99-1.29-4.95-4.3-5.1-4.5-.15-.2-1.22-1.62-1.22-3.09s.77-2.19 1.04-2.49c.27-.3.59-.37.79-.37h.56c.18 0 .42-.07.65.5.24.58.81 1.99.88 2.13.07.15.12.32.02.52-.1.2-.15.32-.3.5-.15.17-.31.39-.44.52-.15.15-.3.31-.13.61.17.3.76 1.25 1.63 2.02 1.12.99 2.06 1.3 2.36 1.45.3.15.47.12.65-.07.17-.2.74-.86.94-1.16.2-.3.4-.25.67-.15.27.1 1.71.81 2.01.96.3.15.5.22.57.35.07.12.07.72-.17 1.4Z" />
      </svg>
      {/* Glyph alone on the narrowest screens, where the sticky bar is already
          competing for the same edge. */}
      <span className="hidden sm:inline">Join on WhatsApp</span>
    </a>
  );
}
