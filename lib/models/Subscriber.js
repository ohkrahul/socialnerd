import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

/**
 * The notify list. Someone asking to be told about the next conversation is the
 * site's only first-party conversion, so this is the one thing we store about
 * a visitor — and nothing more than we need to email them.
 */
export const Subscriber = sequelize.define(
  "Subscriber",
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
      // Lowercased on write so "A@b.com" and "a@b.com" can't both get in.
      set(value) {
        this.setDataValue("email", String(value).trim().toLowerCase());
      },
    },
    name: { type: DataTypes.TEXT, allowNull: true },
    // Which CTA they came through, so we can tell what actually works.
    source: { type: DataTypes.TEXT, allowNull: false, defaultValue: "hero" },
    confirmedAt: { type: DataTypes.DATE, allowNull: true },
    unsubscribedAt: { type: DataTypes.DATE, allowNull: true },
  },
  { tableName: "subscribers" },
);
