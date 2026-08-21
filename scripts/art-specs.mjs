/**
 * What to draw. Kept separate from the generator so a prompt can be tweaked and
 * one slug re-rolled without touching the plumbing.
 *
 * Two rules hold across every prompt:
 *
 *   No people with faces. A generated photo-like image of attendees would be
 *   fabricated evidence of an event that did not happen. Rooms, objects and
 *   empty chairs carry the same feeling without claiming anything untrue.
 *
 *   No text. Type is our job, and generated lettering is always slightly wrong.
 */
export const ART = [
  /* ---------------- House rules ---------------- */
  {
    slug: "rule-phones",
    aspect: "1:1",
    prompt:
      "A shallow open wooden crate on a cafe table seen from a low three-quarter angle, four smartphones lying face down inside it, one more phone on the table beside it. A window and potted plants behind. Centred, calm, generous empty space.",
  },
  {
    slug: "rule-curiosity",
    aspect: "1:1",
    prompt:
      "A single hand holding a round magnifying glass above an open blank notebook on a cafe table, a cup of coffee to one side. The magnifying lens is empty and clear. Seen from a gentle overhead angle.",
  },
  {
    slug: "rule-disagree",
    aspect: "1:1",
    prompt:
      "Two large empty rounded speech bubbles overlapping each other softly at one corner, one sage green and one sand beige, floating above a small cafe table with two cups. The bubbles are completely empty inside. Simple and graphic.",
  },
  {
    slug: "rule-everyone",
    aspect: "1:1",
    prompt:
      "Eight empty cafe chairs arranged in a neat circle on a tiled floor, seen from directly overhead, one chair turned slightly outward as if someone just stood up. No people. Strong graphic circle composition.",
  },

  /* ---------------- Gallery ----------------
     Removed. The gallery shows the community's own photos and clips only —
     illustration next to documentary footage muddies what is a record and what
     is a drawing. These prompts are kept out rather than commented in, because
     a spec that is not generated is just a stale comment. */
];
