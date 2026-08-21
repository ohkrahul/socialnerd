"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import {
  clearThrottle,
  endSession,
  requireAdmin,
  startSession,
  throttle,
  verifyPassword,
} from "@/lib/auth";
import { Event } from "@/lib/models/Event";
import { previewFromUrl, syncEvent } from "@/lib/meetup/sync";
import { slugify } from "@/lib/meetup/parse";
import { Subscriber } from "@/lib/models/Subscriber";
import { mailIsConfigured, sendAnnouncement } from "@/lib/mail";
import { getEventForPreview } from "@/lib/events";

/**
 * Every admin mutation lives here as a server action.
 *
 * requireAdmin() is called in each one, not just in the layout: a server action
 * is a POST endpoint and is reachable without ever rendering the layout that
 * guards the page.
 */

/* ------------------------------------------------------------------ *
 * Session
 * ------------------------------------------------------------------ */

export async function signIn(_state, formData) {
  // Behind Vercel the client IP is in x-forwarded-for; fall back to a constant
  // so a missing header throttles globally rather than not at all.
  const ip =
    (await headers()).get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

  const gate = throttle(ip);
  if (!gate.allowed) {
    return { error: `Too many attempts. Try again in ${gate.minutes} minutes.` };
  }

  if (!(await verifyPassword(formData.get("password")))) {
    return { error: "That password is wrong." };
  }

  clearThrottle(ip);
  await startSession();
  redirect("/admin");
}

export async function signOut() {
  await endSession();
  redirect("/admin/login");
}

/* ------------------------------------------------------------------ *
 * Events
 * ------------------------------------------------------------------ */

/** Paste a Meetup URL, get a draft. Nothing is retyped. */
export async function importFromMeetup(_state, formData) {
  await requireAdmin();

  const url = String(formData.get("url") ?? "").trim();
  if (!url) return { error: "Paste a Meetup event URL." };

  let parsed;
  try {
    parsed = await previewFromUrl(url);
  } catch (error) {
    return { error: error.message };
  }

  const existing = await Event.findOne({ where: { meetupId: parsed.meetupId } });
  if (existing) {
    // Already known — refresh it and send the admin to the editor rather than
    // failing on a duplicate.
    await syncEvent(parsed.meetupId);
    revalidatePath("/admin");
    redirect(`/admin/events/${existing.id}`);
  }

  const result = await syncEvent(parsed.meetupId);
  if (result.error) return { error: result.error };

  const created = await Event.findOne({ where: { meetupId: parsed.meetupId } });
  revalidatePath("/admin");
  redirect(`/admin/events/${created.id}`);
}

/** Saves only the editorial fields. Synced fields are Meetup's to own. */
export async function saveEvent(_state, formData) {
  await requireAdmin();

  const id = String(formData.get("id"));
  const event = await Event.findByPk(id);
  if (!event) return { error: "That event no longer exists." };

  const number = (name) => {
    const raw = String(formData.get(name) ?? "").trim();
    if (raw === "") return null;
    const value = Number(raw);
    return Number.isFinite(value) && value >= 0 ? Math.floor(value) : null;
  };

  const text = (name) => String(formData.get(name) ?? "").trim() || null;

  const capacity = number("capacity");
  const seatsRemaining = number("seatsRemaining");

  if (capacity != null && seatsRemaining != null && seatsRemaining > capacity) {
    return { error: "Seats remaining can't exceed capacity." };
  }

  await event.update({
    subtitle: text("subtitle"),
    memorableQuestion: text("memorableQuestion"),
    recapUrl: text("recapUrl"),
    feeInr: number("feeInr"),
    capacity,
    seatsRemaining,
    attendance: number("attendance"),
    featured: formData.get("featured") === "on",
  });

  revalidatePath("/admin");
  revalidatePath("/");
  return { ok: "Saved." };
}

/** draft | published | cancelled */
export async function setStatus(id, status) {
  await requireAdmin();
  if (!["draft", "published", "cancelled"].includes(status)) return;

  const event = await Event.findByPk(id);
  if (!event) return;

  // A draft or cancelled event has no business being the featured one.
  const featured = status === "published" ? event.featured : false;
  await event.update({ status, featured });
  revalidatePath("/admin");
  revalidatePath("/");
}

/** Only one event can be the featured one. */
export async function setFeatured(id) {
  await requireAdmin();
  const event = await Event.findByPk(id);
  if (!event) return;

  await Event.update({ featured: false }, { where: { featured: true } });
  await event.update({ featured: true });
  revalidatePath("/admin");
  revalidatePath("/");
}

/** Re-read this event from Meetup now, without waiting for the nightly job. */
export async function resync(id) {
  await requireAdmin();
  const event = await Event.findByPk(id);
  if (!event) return;
  await syncEvent(event.meetupId);
  revalidatePath("/admin");
  revalidatePath(`/admin/events/${id}`);
  revalidatePath("/");
}

/**
 * Duplicates the editorial shape of an event as a fresh draft — useful for a
 * recurring topic. The copy has no Meetup id yet, so it carries a placeholder
 * until it is linked to a real listing.
 */
export async function duplicateEvent(id) {
  await requireAdmin();
  const event = await Event.findByPk(id);
  if (!event) return;

  const stamp = Date.now().toString(36);
  const copy = await Event.create({
    meetupId: `draft-${stamp}`,
    meetupUrl: event.meetupUrl,
    slug: `${slugify(event.title)}-${stamp}`,
    title: event.title,
    description: event.description,
    startAt: event.startAt,
    endAt: event.endAt,
    venueName: event.venueName,
    venueAddress: event.venueAddress,
    city: event.city,
    feeInr: event.feeInr,
    subtitle: event.subtitle,
    memorableQuestion: event.memorableQuestion,
    capacity: event.capacity,
    status: "draft",
    featured: false,
  });

  revalidatePath("/admin");
  redirect(`/admin/events/${copy.id}`);
}

export async function deleteEvent(id) {
  await requireAdmin();
  await Event.destroy({ where: { id } });
  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin");
}

/* ------------------------------------------------------------------ *
 * Announcements
 * ------------------------------------------------------------------ */

/**
 * Mails a published event to the notify list.
 *
 * Deliberately manual rather than firing on publish: sending to the whole list
 * is not something that should happen as a side effect of a checkbox. Publishing
 * and announcing are separate decisions.
 */
export async function announceEvent(_state, formData) {
  await requireAdmin();

  const id = String(formData.get("id"));
  const event = await Event.findByPk(id);
  if (!event) return { error: "That event no longer exists." };

  if (event.status !== "published") {
    return { error: "Publish it first — the email links to a live page." };
  }
  if (!mailIsConfigured()) {
    return { error: "SMTP isn't configured, so nothing was sent." };
  }

  const people = await Subscriber.findAll({
    where: { unsubscribedAt: null },
    attributes: ["email"],
  });

  if (people.length === 0) {
    return { error: "Nobody is on the list yet." };
  }

  // The presented shape carries the IST date labels the email needs.
  const presented = await getEventForPreview(id);
  const { sent, failed } = await sendAnnouncement(
    people.map((p) => p.email),
    presented,
  );

  await event.update({ announcedAt: new Date() });
  revalidatePath(`/admin/events/${id}`);

  return {
    ok:
      failed === 0
        ? `Sent to ${sent} ${sent === 1 ? "person" : "people"}.`
        : `Sent to ${sent}, ${failed} failed. Check the logs.`,
  };
}
