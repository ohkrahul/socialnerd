/**
 * Reads a Meetup event page into a plain object.
 *
 * Meetup embeds a complete schema.org Event as JSON-LD on every event page —
 * markup published specifically for machines to read — so there is no scraping
 * of layout here, and a redesign of their page does not break this. Only a
 * change to their structured data would.
 *
 * Pure and network-free on purpose: this is the module with the real logic, so
 * it has to be testable without touching Meetup. Fetching lives in sync.js.
 */

const LD_JSON = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;

/** Meetup types its events variously — FoodEvent, SocialEvent, plain Event. */
function isEvent(node) {
  const type = node?.["@type"];
  const types = Array.isArray(type) ? type : [type];
  return types.some((t) => typeof t === "string" && t.endsWith("Event"));
}

/** schema.org/EventCancelled -> "cancelled" */
function readStatus(eventStatus) {
  const leaf = String(eventStatus ?? "").split("/").pop();
  if (leaf === "EventCancelled") return "cancelled";
  if (leaf === "EventPostponed" || leaf === "EventRescheduled") return "postponed";
  return "scheduled";
}

/**
 * The fee is not a schema.org field — Meetup keeps it in the description body,
 * written as "₹299/-" or "**Cost/Entry:** ₹299". Returns null rather than
 * guessing, so an admin is asked instead of a wrong price being published.
 */
function readFee(description) {
  const match = /₹\s*([\d,]{2,7})/.exec(description ?? "");
  if (!match) return null;
  const value = Number(match[1].replace(/,/g, ""));
  return Number.isFinite(value) && value > 0 ? value : null;
}

/** Prefers the largest crop Meetup offers; they are listed widest-first. */
function readImages(image) {
  if (!image) return [];
  return (Array.isArray(image) ? image : [image]).filter(
    (url) => typeof url === "string" && url.startsWith("http"),
  );
}

export function extractMeetupId(url) {
  return /\/events\/(\d{6,})/.exec(String(url ?? ""))?.[1] ?? null;
}

/** Discovers every event id linked from a group's events page. */
export function discoverEventIds(html) {
  const ids = new Set();
  for (const match of String(html ?? "").matchAll(/\/events\/(\d{6,})\//g)) {
    ids.add(match[1]);
  }
  return [...ids];
}

export function slugify(title) {
  return String(title ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80) || "conversation";
}

/**
 * @throws if the page carries no Event JSON-LD. A caller that swallows this
 *   would silently stop syncing, so it is loud on purpose.
 */
export function parseEventPage(html) {
  let node = null;

  for (const [, raw] of String(html ?? "").matchAll(LD_JSON)) {
    let parsed;
    try {
      parsed = JSON.parse(raw.trim());
    } catch {
      continue; // One malformed block shouldn't hide a valid one.
    }
    const candidates = Array.isArray(parsed) ? parsed : [parsed];
    const found = candidates.find(isEvent);
    if (found) {
      node = found;
      break;
    }
  }

  if (!node) throw new Error("No Event JSON-LD found on page");
  if (!node.name) throw new Error("Event JSON-LD has no name");
  if (!node.startDate) throw new Error("Event JSON-LD has no startDate");

  const place = node.location ?? {};
  const address = place.address ?? {};
  const description = typeof node.description === "string" ? node.description : "";

  return {
    meetupId: extractMeetupId(node.url),
    meetupUrl: node.url ?? null,
    title: String(node.name).trim(),
    slug: slugify(node.name),
    description,
    startAt: new Date(node.startDate),
    endAt: node.endDate ? new Date(node.endDate) : null,
    venueName: place.name ? String(place.name).trim() : null,
    venueAddress: address.streetAddress ? String(address.streetAddress).trim() : null,
    city: address.addressLocality ? String(address.addressLocality).trim() : "Mumbai",
    feeInr: readFee(description),
    imageUrls: readImages(node.image),
    meetupStatus: readStatus(node.eventStatus),
    organizerName: node.organizer?.name ?? null,
  };
}
