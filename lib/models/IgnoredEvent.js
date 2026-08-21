import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

/**
 * Meetup ids an organiser has deleted and does not want back.
 *
 * Without this, delete does not hold: syncAll reads every id off the group page
 * and creates any row it cannot find, so a deleted event reappears as a draft
 * on the next nightly run. The event looked deleted all evening and was back by
 * morning.
 *
 * A separate table rather than a soft-delete flag on Event, so delete still
 * means the row is gone — this remembers only the id, not the content.
 */
export const IgnoredEvent = sequelize.define(
  "IgnoredEvent",
  {
    meetupId: { type: DataTypes.TEXT, primaryKey: true },
    title: { type: DataTypes.TEXT, allowNull: true },
  },
  { tableName: "ignored_events" },
);
