/**
 * Generates the value for ADMIN_PASSWORD_HASH, plus a SESSION_SECRET and
 * CRON_SECRET if you still need them.
 *
 *   node scripts/hash-password.mjs "the password you want"
 *
 * The password is passed as an argument rather than read from stdin so this
 * works in any shell; clear your shell history afterwards if that matters to you.
 */
import { randomBytes, scrypt as scryptCallback } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);
const password = process.argv[2];

if (!password) {
  console.error('usage: node scripts/hash-password.mjs "your-password"');
  process.exit(1);
}

if (password.length < 12) {
  console.error(`Refusing: that password is ${password.length} characters.`);
  console.error("Use at least 12 — this is the only lock on the admin.");
  process.exit(1);
}

const salt = randomBytes(16).toString("hex");
const hash = (await scrypt(password, salt, 64)).toString("hex");

console.log("\nPaste these into .env.local (and into Vercel's env vars):\n");
console.log(`ADMIN_PASSWORD_HASH="${salt}:${hash}"`);
console.log(`SESSION_SECRET="${randomBytes(32).toString("hex")}"`);
console.log(`CRON_SECRET="${randomBytes(24).toString("hex")}"`);
console.log("");
