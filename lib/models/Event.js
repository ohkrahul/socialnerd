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
    posterPath: { type: DataTypes.TEXT, allowNull: true },
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
