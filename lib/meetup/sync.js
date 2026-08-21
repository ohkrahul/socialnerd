import { Event } from "../models/Event.js";
import { IgnoredEvent } from "../models/IgnoredEvent.js";
import { cloudinaryIsConfigured, upload } from "../cloudinary.js";
import { discoverEventIds, parseEventPage } from "./parse.js";

/**
 * Pulls events from Meetup into Postgres.
 *
 * The organiser already does this work once in Meetup. Retyping it into a
 * second CMS is the thing being designed away, so sync owns every field Meetup
 * knows and never touches the editorial ones.
 *
 * Two rules that matter:
 *
 *   1. A new event always arrives as a DRAFT. A Meetup edit must never silently
 *      change the homepage.
 *   2. Every sync writes through, so the site always renders the last-good copy.
 *      A parse failure records syncError against the row and moves on — it never
 *      blanks a page.
 */

const GROUP = "mumbai-social-intelligence-meetup-group";
const BASE = `https://www.meetup.com/${GROUP}`;

// Meetup serves different markup to obvious bots. This is a normal desktop UA.
const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36",
  "Accept-Language": "en-IN,en;q=0.9",
};

const TIMEOUT_MS = 20_000;
const MAX_POSTER_BYTES = 3_000_000;

/** Fields sync owns. Anything absent from this list is the admin's to set. */
const SYNCED_FIELDS = [
  "title",
  "description",
  "startAt",
  "endAt",
  "venueName",
  "venueAddress",
  "city",
  "meetupStatus",
  "meetupUrl",
];

async function get(url, { asBuffer = false } = {}) {
  const response = await fetch(url, {
    headers: HEADERS,
    signal: AbortSignal.timeout(TIMEOUT_MS),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`${response.status} from ${url}`);
  return asBuffer ? response : response.text();
}

/**
 * Meetup lists three crops widest-first; the first is the 676x676 square, which
 * is the most useful shape for a poster. Failure is non-fatal — an event with no
 * poster still publishes.
 */
async function fetchPoster(imageUrls) {
  const url = imageUrls?.[0];
  if (!url) return null;

  try {
    const response = await get(url, { asBuffer: true });
    const declared = Number(response.headers.get("content-length") ?? 0);
    if (declared > MAX_POSTER_BYTES) {
      console.warn(`sync: poster too large (${declared} bytes), skipping ${url}`);
      return null;
    }

    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.byteLength > MAX_POSTER_BYTES) return null;

    const poster = {
      posterBytes: bytes,
      posterMime: response.headers.get("content-type") ?? "image/jpeg",
      posterSourceUrl: url,
    };

    /**
     * Push it to Cloudinary too when configured. The bytes are kept either way:
     * they cost little at this volume and they mean a Cloudinary outage, or the
     * account going away, does not blank every poster on the site.
     */
    if (cloudinaryIsConfigured()) {
      try {
        const uploaded = await upload(bytes, {
          folder: "social-nerds/posters",
          resourceType: "image",
        });
        poster.posterPublicId = uploaded.public_id;
      } catch (error) {
        console.warn(`sync: cloudinary poster upload failed: ${error.message}`);
      }
    }

    return poster;
  } catch (error) {
    console.warn(`sync: poster fetch failed for ${url}: ${error.message}`);
    return null;
  }
}

/** Slugs are unique; two events can legitimately share a title. */
async function uniqueSlug(base, meetupId) {
  const clash = await Event.findOne({ where: { slug: base } });
  if (!clash || clash.meetupId === meetupId) return base;
  return `${base}-${meetupId.slice(-4)}`;
}

/**
 * Syncs one event by its Meetup id.
 * @returns {Promise<{meetupId: string, created: boolean, title?: string, error?: string}>}
 */
export async function syncEvent(meetupId) {
  const url = `${BASE}/events/${meetupId}/`;
  const existing = await Event.findOne({ where: { meetupId } });

  let parsed;
  try {
    parsed = parseEventPage(await get(url));
  } catch (error) {
    // Record the failure against the row so it surfaces in the admin, and leave
    // the last-good data exactly as it was.
    if (existing) {
      await existing.update({ syncError: error.message, syncedAt: new Date() });
    }
    console.error(`sync: ${meetupId} failed — ${error.message}`);
    return { meetupId, created: false, error: error.message };
  }

  const synced = {};
  for (const field of SYNCED_FIELDS) {
    if (parsed[field] !== undefined && parsed[field] !== null) synced[field] = parsed[field];
  }
  synced.meetupUrl = url;
  synced.syncError = null;
  synced.syncedAt = new Date();

  if (existing) {
    // Never overwrite a fee an admin has corrected by hand.
    if (parsed.feeInr && !existing.feeInr) synced.feeInr = parsed.feeInr;

    // Only re-download a poster we don't already have in either place.
    if (!existing.posterBytes && !existing.posterPublicId) {
      const poster = await fetchPoster(parsed.imageUrls);
      if (poster) Object.assign(synced, poster);
    }

    await existing.update(synced);
    return { meetupId, created: false, title: existing.title };
  }

  const poster = await fetchPoster(parsed.imageUrls);

  await Event.create({
    ...synced,
    ...(poster ?? {}),
    meetupId,
    slug: await uniqueSlug(parsed.slug, meetupId),
    feeInr: parsed.feeInr,
    // Drafts, always. A human decides what the homepage says.
    status: "draft",
  });

  return { meetupId, created: true, title: parsed.title };
}

/**
 * Discovers every event on the group page and syncs each one.
 * Runs sequentially — four events, and hammering Meetup in parallel buys
 * nothing but a rate limit.
 */
export async function syncAll() {
  const ids = discoverEventIds(await get(`${BASE}/events/`));
  if (ids.length === 0) throw new Error("No event ids found on the group page");

  const results = [];
  const skipped = [];
  for (const id of ids) {
    if (await isIgnored(id)) {
      skipped.push(id);
      continue;
    }
    results.push(await syncEvent(id));
  }
  if (skipped.length) {
    console.log(`sync: skipped ${skipped.length} deleted event(s): ${skipped.join(", ")}`);
  }

  return {
    discovered: ids.length,
    skipped: skipped.length,
    created: results.filter((r) => r.created).length,
    updated: results.filter((r) => !r.created && !r.error).length,
    failed: results.filter((r) => r.error).length,
    results,
  };
}

/**
 * An id an organiser deleted. Skipped by the nightly sync so a delete holds,
 * but NOT by the manual import — pasting the URL again is an explicit decision
 * to bring it back, and it clears the entry.
 */
async function isIgnored(meetupId) {
  try {
    return Boolean(await IgnoredEvent.findByPk(meetupId));
  } catch {
    // Table not pushed yet: better to sync than to silently skip everything.
    return false;
  }
}

/** Used by the admin's "import from URL" flow: parse without saving. */
export async function previewFromUrl(url) {
  const meetupId = /\/events\/(\d{6,})/.exec(String(url))?.[1];
  if (!meetupId) throw new Error("That isn't a Meetup event URL.");

  const parsed = parseEventPage(await get(`${BASE}/events/${meetupId}/`));
  return { ...parsed, meetupId, meetupUrl: `${BASE}/events/${meetupId}/` };
}
