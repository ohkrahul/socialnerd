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

  /* ---------------- Gallery ---------------- */
  {
    slug: "room-circle",
    aspect: "16:9",
    prompt:
      "The interior of a warm Mumbai cafe in the evening, chairs pulled into a loose circle in the middle of the room, empty cups and a notebook left on a side table, wicker furniture, potted plants, wall lamps glowing. Completely empty of people. Wide establishing view.",
  },
  {
    slug: "gallery-notebook",
    aspect: "1:1",
    prompt:
      "An open notebook lying on a wooden cafe table with a pen resting across it, the pages blank and unmarked, a cup of coffee and a pair of glasses beside it. Close overhead view, warm and lived-in.",
  },
  {
    slug: "gallery-cups",
    aspect: "4:3",
    prompt:
      "Two coffee cups on a small round cafe table, close together, faint steam rising, two empty chairs pulled up on either side. Seen from table height. No people. Intimate and quiet.",
  },
];
