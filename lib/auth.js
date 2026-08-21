import {
  createHmac,
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const scrypt = promisify(scryptCallback);

/**
 * Admin auth for one or two organisers sharing access.
 *
 * A shared password with a scrypt hash and a signed cookie is about forty lines
 * and has a small, auditable surface. An OAuth provider for a single admin would
 * be more code to own and more to misconfigure. If this ever needs per-person
 * logins, swap this module for magic links — nothing outside it knows how a
 * session is made.
 */

const COOKIE = "sn_admin";
const SESSION_DAYS = 7;
const KEY_LENGTH = 64;

function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value || value.length < 32) {
    throw new Error("SESSION_SECRET must be set to at least 32 characters");
  }
  return value;
}

/* ------------------------------------------------------------------ *
 * Password
 * ------------------------------------------------------------------ */

/** Returns `salt:hash`, which is what ADMIN_PASSWORD_HASH holds. */
export async function hashPassword(plain) {
  const salt = randomBytes(16).toString("hex");
  const derived = await scrypt(plain, salt, KEY_LENGTH);
  return `${salt}:${derived.toString("hex")}`;
}

export async function verifyPassword(plain) {
  const stored = process.env.ADMIN_PASSWORD_HASH;
  if (!stored?.includes(":")) return false;

  const [salt, expectedHex] = stored.split(":");
  const expected = Buffer.from(expectedHex, "hex");
  if (expected.length !== KEY_LENGTH) return false;

  const actual = await scrypt(String(plain ?? ""), salt, KEY_LENGTH);
  return timingSafeEqual(actual, expected);
}

/* ------------------------------------------------------------------ *
 * Session
 * ------------------------------------------------------------------ */

function sign(payload) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function createToken() {
  const expires = Date.now() + SESSION_DAYS * 86_400_000;
  const payload = String(expires);
  return `${payload}.${sign(payload)}`;
}

function isValidToken(token) {
  const [payload, signature] = String(token ?? "").split(".");
  if (!payload || !signature) return false;

  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(signature);
  // timingSafeEqual throws on a length mismatch, so check that first.
  if (expected.length !== given.length) return false;
  if (!timingSafeEqual(expected, given)) return false;

  return Number(payload) > Date.now();
}

export async function startSession() {
  (await cookies()).set(COOKIE, createToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_DAYS * 86_400,
  });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

export async function isSignedIn() {
  try {
    return isValidToken((await cookies()).get(COOKIE)?.value);
  } catch {
    // A missing SESSION_SECRET must read as "not signed in", never as "allowed".
    return false;
  }
}

/**
 * Guard for admin pages and every admin action.
 *
 * Called in the admin layout AND inside each action: a layout check alone does
 * not protect a server action, which is reachable directly.
 */
export async function requireAdmin() {
  if (!(await isSignedIn())) redirect("/admin/login");
}

/* ------------------------------------------------------------------ *
 * Login throttle
 * ------------------------------------------------------------------ */

const attempts = new Map();
const WINDOW_MS = 15 * 60_000;
const MAX_ATTEMPTS = 5;

/**
 * ponytail: in-memory, so the limit is per server instance rather than global.
 * Enough to stop a password being guessed by a script; move it to a table if
 * this ever runs on many instances at once.
 */
export function throttle(key) {
  const now = Date.now();
  const record = attempts.get(key);

  if (!record || now > record.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true };
  }

  record.count += 1;
  if (record.count > MAX_ATTEMPTS) {
    return { allowed: false, minutes: Math.ceil((record.resetAt - now) / 60_000) };
  }
  return { allowed: true };
}

export function clearThrottle(key) {
  attempts.delete(key);
}
