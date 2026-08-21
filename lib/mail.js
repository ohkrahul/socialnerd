import { createHmac, timingSafeEqual } from "node:crypto";
import nodemailer from "nodemailer";
import { siteMeta } from "./content.js";

/**
 * Outbound email over Gmail SMTP.
 *
 * Gmail's own limits are the real constraint: roughly 500 recipients a day on a
 * free account. That is comfortable for a list of this size, and it is why
 * announcements are sent in small batches with a pause rather than all at once.
 *
 * Every send carries a working unsubscribe — in the body and in the
 * List-Unsubscribe header. These people agreed to hear about dates, nothing more.
 */

const BATCH_SIZE = 25;
const BATCH_PAUSE_MS = 1_500;

function baseUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  );
}

/* ------------------------------------------------------------------ *
 * Unsubscribe tokens
 * ------------------------------------------------------------------ */

/**
 * Signed with SESSION_SECRET so a link cannot be forged for someone else's
 * address, and stateless so there is no token table to expire.
 */
export function unsubscribeToken(email) {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is required to sign unsubscribe links");
  return createHmac("sha256", secret)
    .update(`unsubscribe:${String(email).toLowerCase()}`)
    .digest("base64url");
}

export function verifyUnsubscribeToken(email, token) {
  try {
    const expected = Buffer.from(unsubscribeToken(email));
    const given = Buffer.from(String(token ?? ""));
    return expected.length === given.length && timingSafeEqual(expected, given);
  } catch {
    return false;
  }
}

export function unsubscribeUrl(email) {
  const params = new URLSearchParams({ e: email, t: unsubscribeToken(email) });
  return `${baseUrl()}/unsubscribe?${params}`;
}

/* ------------------------------------------------------------------ *
 * Transport
 * ------------------------------------------------------------------ */

function createTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT ?? 587),
    // 587 is STARTTLS, not implicit TLS — secure:false here means "upgrade",
    // not "unencrypted".
    secure: Number(SMTP_PORT ?? 587) === 465,
    requireTLS: true,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    pool: true,
    maxConnections: 1,
    maxMessages: 50,
  });
}

function transport() {
  globalThis.__snMailer ??= createTransport();
  return globalThis.__snMailer;
}

export function mailIsConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

export async function verifyMail() {
  const mailer = transport();
  if (!mailer) throw new Error("SMTP is not configured");
  await mailer.verify();
  return true;
}

/* ------------------------------------------------------------------ *
 * Templates
 * ------------------------------------------------------------------ */

/**
 * Plain text, deliberately. A community whose pitch is "less screen, more
 * conversation" should not send an HTML template with a hero image, and plain
 * text lands in inboxes rather than the Promotions tab.
 */
function layout(body, email) {
  return `${body}

—
${siteMeta.name} · ${siteMeta.city}
${siteMeta.meetupUrl}

You're getting this because you asked to hear about dates.
Unsubscribe: ${unsubscribeUrl(email)}
`;
}

export function welcomeEmail(email) {
  return {
    subject: "You're on the list — Social Nerds",
    text: layout(
      `Thanks for asking.

You'll get one email when the next conversation has a date — before it goes up on Meetup. Nothing else.

How a seat works, so there are no surprises:

  1. RSVP on Meetup
  2. Pay ₹${siteMeta.fee} over WhatsApp
  3. Your seat is confirmed

Rooms run 8 to 12 people. Phones go in a box by the door.

See you in one.`,
      email,
    ),
  };
}

export function announcementEmail(email, event) {
  const question = event.memorableQuestion
    ? `\n\nThe question on the table:\n\n  "${event.memorableQuestion}"`
    : "";

  return {
    subject: `Next conversation: ${event.title}`,
    text: layout(
      `A date is set.

  ${event.title}
  ${event.dateLabel}
  ${event.timeLabel}
  ${[event.venueName, event.city].filter(Boolean).join(", ")}
  ₹${event.feeInr ?? siteMeta.fee}${question}

To take a seat:

  1. RSVP on Meetup — ${event.meetupUrl}
  2. Pay ₹${event.feeInr ?? siteMeta.fee} over WhatsApp
  3. Your seat is confirmed

${event.capacity ? `The room holds ${event.capacity}. ` : ""}You're hearing this before it goes out anywhere else.`,
      email,
    ),
  };
}

/* ------------------------------------------------------------------ *
 * Sending
 * ------------------------------------------------------------------ */

/**
 * Sends one message. Resolves false rather than throwing, because no email is
 * worth failing a signup over — the address is already saved by the time this
 * is called.
 */
export async function sendMail(to, { subject, text }) {
  const mailer = transport();
  if (!mailer) {
    console.warn("mail: SMTP not configured, skipping send to", to);
    return false;
  }

  try {
    await mailer.sendMail({
      from: process.env.MAIL_FROM ?? process.env.SMTP_USER,
      to,
      subject,
      text,
      headers: {
        "List-Unsubscribe": `<${unsubscribeUrl(to)}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    });
    return true;
  } catch (error) {
    console.error(`mail: send to ${to} failed —`, error.message);
    return false;
  }
}

/**
 * Sends an announcement to a list of addresses, one message each so every
 * unsubscribe link is that person's own. Batched with a pause to stay well
 * inside Gmail's rate limits.
 */
export async function sendAnnouncement(emails, event) {
  let sent = 0;
  let failed = 0;

  for (let i = 0; i < emails.length; i += BATCH_SIZE) {
    const batch = emails.slice(i, i + BATCH_SIZE);

    const results = await Promise.all(
      batch.map((email) => sendMail(email, announcementEmail(email, event))),
    );
    sent += results.filter(Boolean).length;
    failed += results.filter((ok) => !ok).length;

    if (i + BATCH_SIZE < emails.length) {
      await new Promise((resolve) => setTimeout(resolve, BATCH_PAUSE_MS));
    }
  }

  return { sent, failed };
}
