/**
 * Moves existing event posters out of Postgres bytea and into Cloudinary,
 * setting Event.posterPublicId. The bytes are left in place: once every row has
 * a public id you can drop the column and app/api/events/[meetupId]/poster,
 * and until then they are the fallback.
 *
 *   node --env-file=.env.local scripts/backfill-posters.mjs
 */
import { sequelize } from "../lib/db.js";
import { Event } from "../lib/models/Event.js";
import { cloudinaryIsConfigured, upload } from "../lib/cloudinary.js";

if (!cloudinaryIsConfigured()) {
  console.error("CLOUDINARY_* must be set.");
  process.exit(1);
}

try {
  await sequelize.authenticate();
  const rows = await Event.findAll();
  let done = 0;

  for (const event of rows) {
    if (event.posterPublicId || !event.posterBytes) continue;
    try {
      const result = await upload(event.posterBytes, {
        folder: "social-nerds/posters",
        publicId: `event-${event.meetupId}`,
        resourceType: "image",
        filename: `${event.slug}.jpg`,
      });
      await event.update({ posterPublicId: result.public_id });
      console.log(`  ${event.slug} -> ${result.public_id}`);
      done++;
    } catch (err) {
      console.warn(`  ${event.slug} failed: ${err.message}`);
    }
  }
  console.log(`\n${done} poster(s) moved to Cloudinary.`);
} catch (err) {
  console.error("backfill failed:", err.message);
  process.exitCode = 1;
} finally {
  await sequelize.close();
}
