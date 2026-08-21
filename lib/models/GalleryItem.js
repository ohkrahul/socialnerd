import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

/**
 * A piece of media the organiser published, stored in Cloudinary.
 *
 * Only the public id lives here. Every URL is derived at render time by
 * lib/cloudinary.js, so a change to the delivery transformations is one edit
 * rather than a rewrite of every stored URL.
 *
 * `kind` keeps footage and artwork apart, and that distinction is editorial
 * rather than cosmetic: their posters are graphics, not photographs of a room,
 * and a poster sitting in a grid headed "what it actually looks like" quietly
 * passes a graphic off as a record of an evening. The rail says which is which.
 *
 * `span` is seeded from the uploaded dimensions and then left to the organiser,
 * because which clip deserves the wide tile is a judgement about the picture,
 * not about its aspect ratio.
 */
export const GalleryItem = sequelize.define(
  "GalleryItem",
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },

    publicId: { type: DataTypes.TEXT, allowNull: false, unique: true },
    resourceType: {
      type: DataTypes.ENUM("image", "video"),
      allowNull: false,
      defaultValue: "image",
    },
    kind: {
      type: DataTypes.ENUM("footage", "poster"),
      allowNull: false,
      defaultValue: "footage",
    },

    caption: { type: DataTypes.TEXT, allowNull: true },
    /** The small second line: a date, a venue, "Illustration". */
    meta: { type: DataTypes.TEXT, allowNull: true },

    span: {
      type: DataTypes.ENUM("tall", "wide", "normal"),
      allowNull: false,
      defaultValue: "normal",
    },

    // From Cloudinary's upload response. Used to pick a sensible default span.
    width: { type: DataTypes.INTEGER, allowNull: true },
    height: { type: DataTypes.INTEGER, allowNull: true },

    sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    status: {
      type: DataTypes.ENUM("draft", "published"),
      allowNull: false,
      defaultValue: "draft",
    },
  },
  {
    tableName: "gallery_items",
    indexes: [{ fields: ["kind", "status", "sort_order"] }],
  },
);

/** Portrait gets the tall tile, wide-ish gets the wide one. */
export function spanFor(width, height) {
  if (!width || !height) return "normal";
  if (height > width * 1.1) return "tall";
  if (width > height * 1.5) return "wide";
  return "normal";
}
