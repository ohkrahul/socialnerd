import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

/**
 * A conversation. Most fields arrive from Meetup's schema.org JSON-LD; the rest
 * are editorial and only an organiser can know them.
 *
 * Two status columns on purpose:
 *   meetupStatus — synced, never hand-edited. What Meetup says.
 *   status       — editorial. What this site shows.
 * Keeping them apart lets the admin see "Meetup says cancelled" and still
 * decide what the homepage does about it.
 *
 * There is no `completed` status: an event whose endAt has passed IS completed.
 * Deriving it removes a field and a manual step the organiser would forget.
 */
export const Event = sequelize.define(
  "Event",
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },

    // --- identity ---
    meetupId: { type: DataTypes.TEXT, allowNull: false, unique: true },
    meetupUrl: { type: DataTypes.TEXT, allowNull: false },
    slug: { type: DataTypes.TEXT, allowNull: false, unique: true },

    // --- synced from Meetup ---
    title: { type: DataTypes.TEXT, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    startAt: { type: DataTypes.DATE, allowNull: false },
    endAt: { type: DataTypes.DATE, allowNull: true },
    venueName: { type: DataTypes.TEXT, allowNull: true },
    venueAddress: { type: DataTypes.TEXT, allowNull: true },
    city: { type: DataTypes.TEXT, allowNull: false, defaultValue: "Mumbai" },
    feeInr: { type: DataTypes.INTEGER, allowNull: true },
    posterSourceUrl: { type: DataTypes.TEXT, allowNull: true },
    meetupStatus: {
      type: DataTypes.ENUM("scheduled", "cancelled", "postponed"),
      allowNull: false,
      defaultValue: "scheduled",
    },

    // --- editorial ---
    subtitle: { type: DataTypes.TEXT, allowNull: true },
    memorableQuestion: { type: DataTypes.TEXT, allowNull: true },
    capacity: { type: DataTypes.INTEGER, allowNull: true },
    seatsRemaining: { type: DataTypes.INTEGER, allowNull: true },
    /**
     * Posters are stored as bytes, not files.
     *
     * The plan was to download them into public/ at sync time, but Vercel's
     * filesystem is read-only at runtime, so a cron writing into public/ would
     * fail in production. Keeping the bytes in Postgres preserves the point of
     * that decision — no hotlinking, survives Meetup rotating or deleting an
     * image, no third-party account — and works on serverless. Served by
     * app/api/events/[meetupId]/poster with a long cache header.
     *
     * ponytail: bytea is the right call for a handful of ~80KB posters. If this
     * ever holds hundreds of images, move them to blob storage and keep the URL.
     */
    posterBytes: { type: DataTypes.BLOB, allowNull: true },
    posterMime: { type: DataTypes.TEXT, allowNull: true },
    /**
     * Set once a poster has been pushed to Cloudinary. Preferred over the bytes
     * when present; the bytea column and its route stay as the fallback because
     * rows synced before this existed still only have bytes. Backfill with
     * scripts/backfill-posters.mjs, then the column can go.
     */
    posterPublicId: { type: DataTypes.TEXT, allowNull: true },
    attendance: { type: DataTypes.INTEGER, allowNull: true },
    recapUrl: { type: DataTypes.TEXT, allowNull: true },
    featured: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    status: {
      type: DataTypes.ENUM("draft", "published", "cancelled"),
      allowNull: false,
      defaultValue: "draft",
    },
    // null means "live the moment it's published".
    publishAt: { type: DataTypes.DATE, allowNull: true },

    // Set when the notify list was mailed about this event, so the admin can
    // see at a glance whether an announcement already went out.
    announcedAt: { type: DataTypes.DATE, allowNull: true },

    // --- sync bookkeeping ---
    syncedAt: { type: DataTypes.DATE, allowNull: true },
    syncError: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    tableName: "events",
    indexes: [{ fields: ["status", "start_at"] }, { fields: ["featured"] }],
  },
);

/** An event is over once its end time has passed. Never stored. */
export function isPast(event) {
  const end = event.endAt ?? event.startAt;
  return new Date(end).getTime() < Date.now();
}
