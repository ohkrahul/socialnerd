/**
 * Manual sync. Run with: npm run sync
 * The nightly job hits app/api/cron/sync instead; this is the same code path
 * for local use and first population.
 */
import { sequelize } from "../lib/db.js";
import { syncAll } from "../lib/meetup/sync.js";

try {
  const summary = await syncAll();
  console.log(
    `discovered ${summary.discovered} · created ${summary.created} · updated ${summary.updated} · failed ${summary.failed}`,
  );
  for (const r of summary.results) {
    console.log(` ${r.created ? "new " : r.error ? "FAIL" : "sync"} ${r.meetupId} ${r.title ?? r.error ?? ""}`);
  }
} catch (error) {
  console.error("sync failed:", error.message);
  process.exitCode = 1;
} finally {
  await sequelize.close();
}
