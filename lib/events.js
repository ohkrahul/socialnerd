import { Op } from "sequelize";
import { Event } from "./models/Event.js";
import { cloudinaryIsConfigured, imageUrl } from "./cloudinary.js";

/**
 * The public read layer. Everything the site shows about events comes through
 * here, shaped for components rather than for the database.
 *
 * Drafts are invisible unless explicitly previewed, and `publishAt` is honoured
 * so an event can be queued ahead of time.
 */

/** Only published, only past its publish time. */
function liveClause() {
  return {
    status: { [Op.ne]: "draft" },
    [Op.or]: [{ publishAt: null }, { publishAt: { [Op.lte]: new Date() } }],
  };
}

const DATE = new Intl.DateTimeFormat("en-IN", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Kolkata",
});

const TIME = new Intl.DateTimeFormat("en-IN", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZone: "Asia/Kolkata",
});

/**
 * Rows carry UTC; the community is in Mumbai. Formatting in IST on the server
 * means the date a visitor reads is the date the organiser meant, wherever the
 * visitor happens to be.
 */
function present(event) {
  if (!event) return null;

  const start = new Date(event.startAt);
  const end = event.endAt ? new Date(event.endAt) : null;

  return {
    id: event.id,
    meetupId: event.meetupId,
    meetupUrl: event.meetupUrl,
    slug: event.slug,
    title: event.title,
    subtitle: event.subtitle,
    memorableQuestion: event.memorableQuestion,
    dateLabel: DATE.format(start),
    timeLabel: end ? `${TIME.format(start)} — ${TIME.format(end)}` : TIME.format(start),
    shortDate: start.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    }),
    venueName: event.venueName,
    venueAddress: event.venueAddress,
    city: event.city,
    feeInr: event.feeInr,
    capacity: event.capacity,
    seatsRemaining: event.seatsRemaining,
    attendance: event.attendance,
    recapUrl: event.recapUrl,
    status: event.status,
    meetupStatus: event.meetupStatus,
    /**
     * Cloudinary when we have it, the bytea route otherwise. Components only
     * ever see a URL, so neither of them has to know which one it got.
     */
    posterPath:
      event.posterPublicId && cloudinaryIsConfigured()
        ? imageUrl(event.posterPublicId, { width: 1080 })
        : event.posterBytes
          ? `/api/events/${event.meetupId}/poster`
          : null,
    isPast: (end ?? start).getTime() < Date.now(),
  };
}

/**
 * Reads here fail soft.
 *
 * "No event scheduled" and "the database is unreachable" look the same to a
 * visitor, and the difference is not theirs to care about — the hero, how it
 * works, the gallery, the rules, the FAQ and the closing CTA are all static and
 * should still render. Letting a query error escape turns a missing env var into
 * a fully blank site, which is what happened in production.
 *
 * The error is logged so it is visible in Vercel's logs rather than swallowed.
 */
async function safely(label, run, fallback) {
  try {
    return await run();
  } catch (error) {
    console.error(`events: ${label} failed — ${error.message}`);
    return fallback;
  }
}

/**
 * The next conversation, or null when nothing is scheduled — which is a real
 * state, not an error. Prefers an explicitly featured event, then the soonest
 * upcoming one.
 */
export async function getFeaturedEvent() {
  return safely("getFeaturedEvent", loadFeaturedEvent, null);
}

async function loadFeaturedEvent() {
  const upcoming = {
    ...liveClause(),
    startAt: { [Op.gte]: new Date() },
  };

  const featured = await Event.findOne({
    where: { ...upcoming, featured: true },
    order: [["startAt", "ASC"]],
  });
  if (featured) return present(featured);

  const soonest = await Event.findOne({
    where: upcoming,
    order: [["startAt", "ASC"]],
  });
  return present(soonest);
}

/** Conversations that actually happened: published, past, and not cancelled. */
export async function getArchive(limit = 12) {
  return safely("getArchive", () => loadArchive(limit), []);
}

async function loadArchive(limit) {
  const rows = await Event.findAll({
    where: {
      ...liveClause(),
      status: "published",
      meetupStatus: { [Op.ne]: "cancelled" },
      startAt: { [Op.lt]: new Date() },
    },
    order: [["startAt", "DESC"]],
    limit,
  });
  return rows.map(present);
}

/** Admin preview: fetch any event by id, draft or not. */
export async function getEventForPreview(id) {
  if (!id) return null;
  return safely("getEventForPreview", async () => present(await Event.findByPk(id)), null);
}

/** How many conversations have actually been held. Used in copy, so it's real. */
export async function countHeld() {
  return safely("countHeld", () => Event.count({
    where: {
      status: "published",
      meetupStatus: { [Op.ne]: "cancelled" },
      startAt: { [Op.lt]: new Date() },
    },
  }), 0);
}
