import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

/**
 * Key/value overrides for the handful of content values that go stale between
 * deploys.
 *
 * Deliberately not a CMS. Most of lib/content.js — the steps, the rules, the
 * FAQ, the audience lists, the hero copy — changes once or twice a year and is
 * design-sensitive; a textarea in an admin panel is a worse place to edit it
 * than the file, and building forms for nested arrays would be a lot of surface
 * for something nobody touches.
 *
 * What lives here is the opposite: figures and one paragraph that are wrong
 * within weeks if nobody can change them without a deploy. content.js stays the
 * default, so an empty table renders exactly what ships in the repo.
 */
export const Setting = sequelize.define(
  "Setting",
  {
    key: { type: DataTypes.TEXT, primaryKey: true },
    value: { type: DataTypes.TEXT, allowNull: true },
  },
  { tableName: "settings" },
);
