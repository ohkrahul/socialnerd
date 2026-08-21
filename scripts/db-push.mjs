/**
 * Creates or updates tables from the models. Run with:
 *   node --env-file=.env.local scripts/db-push.mjs
 *
 * ponytail: sequelize.sync({ alter: true }) rather than a migration tool. Fine
 * while this is the only writer and the schema is two tables. Switch to real
 * migrations (umzug, or hand-written SQL) the first time you need to alter a
 * column without risking data.
 */
import { sequelize } from "../lib/db.js";
import "../lib/models/Subscriber.js";
import "../lib/models/Event.js";
import "../lib/models/GalleryItem.js";

const [, , ...args] = process.argv;

try {
  await sequelize.authenticate();
  await sequelize.sync({ alter: args.includes("--alter") });
  const [rows] = await sequelize.query(
    "select tablename from pg_tables where schemaname = 'public' order by tablename",
  );
  console.log("tables:", rows.map((r) => r.tablename).join(", ") || "(none)");
} catch (err) {
  console.error("db-push failed:", err.message);
  process.exitCode = 1;
} finally {
  await sequelize.close();
}
