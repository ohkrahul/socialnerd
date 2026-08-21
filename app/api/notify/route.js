import { NextResponse } from "next/server";
import { UniqueConstraintError } from "sequelize";
import { Subscriber } from "@/lib/models/Subscriber";

/**
 * The notify list. Someone asking to be told about the next conversation.
 *
 * Deliberately forgiving: an address already on the list is a success, not an
 * error. Telling a visitor "you're already subscribed" leaks who is on the list
 * and helps nobody — they wanted to be on it, and they are.
 */

// A real check, not a clever one. The only way to know an address works is to
// send to it; this catches typos and rejects junk without refusing valid mail.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const SOURCES = new Set(["hero", "event-full", "event-none", "final-cta"]);

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Expected JSON." }, { status: 400 });
  }

  const email = String(body?.email ?? "").trim();
  const name = String(body?.name ?? "").trim();
  const source = SOURCES.has(body?.source) ? body.source : "hero";

  if (!EMAIL.test(email) || email.length > 254) {
    return NextResponse.json(
      { error: "That doesn't look like an email address." },
      { status: 422 },
    );
  }

  try {
    await Subscriber.create({
      email,
      name: name.slice(0, 120) || null,
      source,
    });
  } catch (err) {
    // Already on the list — same outcome they asked for.
    if (!(err instanceof UniqueConstraintError)) {
      console.error("notify: insert failed", err);
      return NextResponse.json(
        { error: "Couldn't save that. Try again in a moment." },
        { status: 503 },
      );
    }
  }

  return NextResponse.json({ ok: true });
}
