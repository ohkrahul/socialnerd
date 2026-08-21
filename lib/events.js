import { Op } from "sequelize";
import { Event } from "./models/Event.js";

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
    // Bytes never leave the server; components get a URL.
    posterPath: event.posterBytes ? `/api/events/${event.meetupId}/poster` : null,
    isPast: (end ?? start).getTime() < Date.now(),
  };
}

/**
 * The next conversation, or null when nothing is scheduled — which is a real
 * state, not an error. Prefers an explicitly featured event, then the soonest
 * upcoming one.
 */
export async function getFeaturedEvent() {
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
  const event = await Event.findByPk(id);
  return present(event);
}

/** How many conversations have actually been held. Used in copy, so it's real. */
export async function countHeld() {
  return Event.count({
    where: {
      status: "published",
      meetupStatus: { [Op.ne]: "cancelled" },
      startAt: { [Op.lt]: new Date() },
    },
  });
}
