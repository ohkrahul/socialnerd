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
import { Op } from "sequelize";
import { GalleryItem, spanFor } from "@/lib/models/GalleryItem";
import {
  cloudinaryIsConfigured,
  destroy,
  uploadSignature,
} from "@/lib/cloudinary";

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

/**
 * draft | published | cancelled
 *
 * Ends on the list rather than wherever it was called from. This runs from both
 * /admin and the event editor; from the editor, not redirecting left you on a
 * page whose only remaining actions were to undo what you just did, with no
 * sign the change had landed anywhere else. From the list the redirect is the
 * same route, so it reads as a refresh.
 */
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
  redirect("/admin");
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

/* ------------------------------------------------------------------ *
 * Gallery
 * ------------------------------------------------------------------ */

/**
 * Hands the browser permission to write one file into the Cloudinary account.
 *
 * requireAdmin() is the whole security boundary here: without it this endpoint
 * would let anyone upload into the account. The secret itself never goes over
 * the wire — only a signature over this exact folder and timestamp.
 *
 * The upload goes browser -> Cloudinary directly, not through this app, because
 * a server action caps its request body around 1MB and these are videos.
 */
export async function getUploadCredentials(kind = "footage") {
  await requireAdmin();
  if (!cloudinaryIsConfigured()) {
    return { error: "Cloudinary isn't configured. Set CLOUDINARY_* in the env." };
  }
  const folder = kind === "poster" ? "social-nerds/posters" : "social-nerds/gallery";
  const { cloudName, apiKey, timestamp, signature } = uploadSignature({ folder });
  return { cloudName, apiKey, timestamp, folder, signature };
}

/** Records what the browser just pushed to Cloudinary. */
export async function saveGalleryItem(_state, formData) {
  await requireAdmin();

  const publicId = String(formData.get("publicId") ?? "").trim();
  if (!publicId) return { error: "That upload didn't return a public id." };

  const resourceType = formData.get("resourceType") === "video" ? "video" : "image";
  const kind = formData.get("kind") === "poster" ? "poster" : "footage";
  const width = Number(formData.get("width")) || null;
  const height = Number(formData.get("height")) || null;

  const existing = await GalleryItem.findOne({ where: { publicId } });
  if (existing) return { error: "That file is already in the gallery." };

  // New items land at the end of their own kind.
  const last = await GalleryItem.max("sortOrder", { where: { kind } });

  await GalleryItem.create({
    publicId,
    resourceType,
    kind,
    width,
    height,
    span: spanFor(width, height),
    sortOrder: Number.isFinite(last) ? last + 1 : 0,
    caption: String(formData.get("caption") ?? "").trim() || null,
    meta: String(formData.get("meta") ?? "").trim() || null,
    status: "draft",
  });

  revalidatePath("/admin/gallery");
  revalidatePath("/");
  return { ok: "Uploaded. It's a draft until you publish it." };
}

export async function updateGalleryItem(_state, formData) {
  await requireAdmin();

  const item = await GalleryItem.findByPk(String(formData.get("id")));
  if (!item) return { error: "That item no longer exists." };

  const span = String(formData.get("span"));
  await item.update({
    caption: String(formData.get("caption") ?? "").trim() || null,
    meta: String(formData.get("meta") ?? "").trim() || null,
    span: ["tall", "wide", "normal"].includes(span) ? span : item.span,
    kind: formData.get("kind") === "poster" ? "poster" : "footage",
  });

  revalidatePath("/admin/gallery");
  revalidatePath("/");
  return { ok: "Saved." };
}

export async function setGalleryStatus(id, status) {
  await requireAdmin();
  if (!["draft", "published"].includes(status)) return;
  const item = await GalleryItem.findByPk(id);
  if (!item) return;
  await item.update({ status });
  revalidatePath("/admin/gallery");
  revalidatePath("/");
}

/** Swaps sortOrder with the neighbour above or below, within the same kind. */
export async function moveGalleryItem(id, direction) {
  await requireAdmin();
  const item = await GalleryItem.findByPk(id);
  if (!item) return;

  const neighbour = await GalleryItem.findOne({
    where: {
      kind: item.kind,
      sortOrder:
        direction === "up"
          ? { [Op.lt]: item.sortOrder }
          : { [Op.gt]: item.sortOrder },
    },
    order: [["sortOrder", direction === "up" ? "DESC" : "ASC"]],
  });
  if (!neighbour) return;

  const mine = item.sortOrder;
  await item.update({ sortOrder: neighbour.sortOrder });
  await neighbour.update({ sortOrder: mine });

  revalidatePath("/admin/gallery");
  revalidatePath("/");
}

/**
 * Removes the row and the file. Deleting the row alone would leave the asset
 * billable and orphaned in the account with nothing pointing at it.
 */
export async function deleteGalleryItem(id) {
  await requireAdmin();
  const item = await GalleryItem.findByPk(id);
  if (!item) return;

  await destroy(item.publicId, item.resourceType);
  await item.destroy();

  revalidatePath("/admin/gallery");
  revalidatePath("/");
}
