import { GalleryItem, spanFor } from "./models/GalleryItem.js";
import { imageUrl, videoPosterUrl, videoUrl, cloudinaryIsConfigured } from "./cloudinary.js";
import { gallery as fallbackGallery, posters as fallbackPosters } from "./content.js";

/**
 * The public read layer for organiser-published media.
 *
 * When the table is empty — a fresh database, or Cloudinary not configured yet —
 * this falls back to the hardcoded lists in content.js, which point at files in
 * public/. That keeps the section rendering something real during the migration
 * instead of showing an empty grid, and means the site does not hard-depend on a
 * third-party account being reachable.
 */

function present(row) {
  const isVideo = row.resourceType === "video";
  return {
    type: isVideo ? "video" : row.kind === "poster" ? "poster" : "image",
    src: isVideo ? videoUrl(row.publicId) : imageUrl(row.publicId, { width: 1440 }),
    poster: isVideo ? videoPosterUrl(row.publicId, { width: 960 }) : undefined,
    caption: row.caption ?? "",
    meta: row.meta ?? null,
    span: row.span ?? spanFor(row.width, row.height),
  };
}

async function published(kind) {
  if (!cloudinaryIsConfigured()) return [];
  try {
    const rows = await GalleryItem.findAll({
      where: { kind, status: "published" },
      order: [
        ["sortOrder", "ASC"],
        ["createdAt", "ASC"],
      ],
    });
    return rows.map(present);
  } catch (error) {
    // A missing table on a database that has not been pushed yet is not worth
    // taking the homepage down for.
    console.warn(`gallery: falling back to content.js (${error.message})`);
    return [];
  }
}

export async function getGallery() {
  const rows = await published("footage");
  return rows.length ? rows : fallbackGallery;
}

export async function getPosters() {
  const rows = await published("poster");
  return rows.length ? rows : fallbackPosters;
}

/** Admin listing: everything, both kinds, drafts included. */
export async function getAllGalleryItems() {
  const rows = await GalleryItem.findAll({
    order: [
      ["kind", "ASC"],
      ["sortOrder", "ASC"],
      ["createdAt", "ASC"],
    ],
  });
  return rows.map((row) => ({
    id: row.id,
    publicId: row.publicId,
    resourceType: row.resourceType,
    kind: row.kind,
    caption: row.caption,
    meta: row.meta,
    span: row.span,
    status: row.status,
    sortOrder: row.sortOrder,
    thumb:
      row.resourceType === "video"
        ? videoPosterUrl(row.publicId, { width: 320 })
        : imageUrl(row.publicId, { width: 320 }),
  }));
}
