/**
 * Uploads the locally imported assets to Cloudinary and creates the matching
 * gallery rows, so the admin gallery starts populated instead of empty.
 *
 * Reads captions from lib/content.js rather than inventing new ones — those were
 * written against the actual frames.
 *
 * Idempotent: an asset already in the account under the same public id is
 * skipped, so re-running after a partial failure is safe.
 *
 *   node --env-file=.env.local scripts/seed-cloudinary.mjs
 *   node --env-file=.env.local scripts/seed-cloudinary.mjs --publish
 */
import fs from "node:fs";
import path from "node:path";
import { sequelize } from "../lib/db.js";
import { GalleryItem, spanFor } from "../lib/models/GalleryItem.js";
import { cloudinaryIsConfigured, upload } from "../lib/cloudinary.js";
import { gallery, posters } from "../lib/content.js";

if (!cloudinaryIsConfigured()) {
  console.error("CLOUDINARY_CLOUD_NAME / _API_KEY / _API_SECRET must all be set.");
  process.exit(1);
}

const publish = process.argv.includes("--publish");

/** "/video/clip-03.mp4" -> "clip-03" */
const idOf = (src) => path.basename(src, path.extname(src));

const rows = [
  ...gallery.map((item, i) => ({ ...item, kind: "footage", order: i })),
  ...posters.map((item, i) => ({ ...item, kind: "poster", order: i })),
];

try {
  await sequelize.authenticate();
  await sequelize.sync();

  let added = 0;
  let skipped = 0;

  for (const item of rows) {
    const isVideo = item.src.endsWith(".mp4");
    const resourceType = isVideo ? "video" : "image";
    const folder = item.kind === "poster" ? "social-nerds/posters" : "social-nerds/gallery";
    const publicId = `${folder}/${idOf(item.src)}`;

    if (await GalleryItem.findOne({ where: { publicId } })) {
      skipped++;
      continue;
    }

    const file = path.join("public", item.src);
    if (!fs.existsSync(file)) {
      console.warn(`  missing on disk, skipped: ${file}`);
      continue;
    }

    const result = await upload(fs.readFileSync(file), {
      folder,
      publicId: idOf(item.src),
      resourceType,
      filename: path.basename(file),
    });

    await GalleryItem.create({
      publicId: result.public_id,
      resourceType,
      kind: item.kind,
      caption: item.caption ?? null,
      meta: item.meta ?? null,
      width: result.width ?? null,
      height: result.height ?? null,
      span: item.span ?? spanFor(result.width, result.height),
      sortOrder: item.order,
      status: publish ? "published" : "draft",
    });

    added++;
    console.log(`  ${item.kind.padEnd(7)} ${result.public_id}  (${result.width}x${result.height})`);
  }

  console.log(`\n${added} uploaded, ${skipped} already present.`);
  console.log(
    publish
      ? "Published — the homepage now reads these instead of the local fallback."
      : "Saved as drafts. Publish them in /admin/gallery, or re-run with --publish.",
  );
} catch (err) {
  console.error("seed failed:", err.message);
  process.exitCode = 1;
} finally {
  await sequelize.close();
}
