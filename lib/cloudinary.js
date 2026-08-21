import { createHash } from "node:crypto";

/**
 * Cloudinary, without the SDK.
 *
 * A signed upload needs one sha1 and delivery needs a URL template, so the
 * official package would be a dependency for a hash and some string joining.
 * The signature rule is stable and documented: take every parameter you are
 * sending except file, cloud_name, resource_type and api_key; sort by key; join
 * as k=v with &; append the api secret; sha1 the result.
 *
 * The secret is read here and never leaves the server. The browser only ever
 * receives a signature for one upload, valid for that exact parameter set.
 */

const CLOUD = process.env.CLOUDINARY_CLOUD_NAME;
const KEY = process.env.CLOUDINARY_API_KEY;
const SECRET = process.env.CLOUDINARY_API_SECRET;

/** Mirrors mailIsConfigured(): the caller decides what to do about it. */
export function cloudinaryIsConfigured() {
  return Boolean(CLOUD && KEY && SECRET);
}

export function cloudName() {
  return CLOUD;
}

const UNSIGNED = new Set(["file", "cloud_name", "resource_type", "api_key"]);

export function sign(params) {
  if (!SECRET) throw new Error("CLOUDINARY_API_SECRET is not set.");
  const payload = Object.keys(params)
    .filter((k) => !UNSIGNED.has(k) && params[k] !== undefined && params[k] !== null && params[k] !== "")
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return createHash("sha1").update(payload + SECRET).digest("hex");
}

/**
 * Credentials for a direct browser upload.
 *
 * The bytes go from the browser straight to Cloudinary and never through this
 * app, because a Next server action caps its request body around 1MB and these
 * are videos. Callers MUST be behind requireAdmin() — this hands out permission
 * to write into the account.
 */
export function uploadSignature({ folder, resourceType = "image" }) {
  const timestamp = Math.floor(Date.now() / 1000);
  const params = { folder, timestamp };
  return {
    cloudName: CLOUD,
    apiKey: KEY,
    timestamp,
    folder,
    resourceType,
    signature: sign(params),
    endpoint: `https://api.cloudinary.com/v1_1/${CLOUD}/${resourceType}/upload`,
  };
}

/** Server-side upload, for the Meetup sync and the seed script. */
export async function upload(bytes, { folder, publicId, resourceType = "image", filename }) {
  if (!cloudinaryIsConfigured()) throw new Error("Cloudinary is not configured.");

  const timestamp = Math.floor(Date.now() / 1000);
  const signed = { folder, timestamp, ...(publicId ? { public_id: publicId } : {}) };

  const form = new FormData();
  form.append("file", new Blob([bytes]), filename ?? "upload");
  form.append("api_key", KEY);
  form.append("timestamp", String(timestamp));
  form.append("folder", folder);
  if (publicId) form.append("public_id", publicId);
  form.append("signature", sign(signed));

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD}/${resourceType}/upload`,
    { method: "POST", body: form },
  );

  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(json?.error?.message ?? `Cloudinary upload failed (${res.status}).`);
  }
  return json; // { public_id, resource_type, width, height, duration, ... }
}

export async function destroy(publicId, resourceType = "image") {
  if (!cloudinaryIsConfigured()) return;
  const timestamp = Math.floor(Date.now() / 1000);
  const body = new URLSearchParams({
    public_id: publicId,
    api_key: KEY,
    timestamp: String(timestamp),
    signature: sign({ public_id: publicId, timestamp }),
  });
  await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/${resourceType}/destroy`, {
    method: "POST",
    body,
  });
}

/* ------------------------------------------------------------------ *
 * Delivery
 * ------------------------------------------------------------------ */

const base = (resourceType) =>
  `https://res.cloudinary.com/${CLOUD}/${resourceType}/upload`;

/** f_auto,q_auto lets Cloudinary pick AVIF/WebP and a quality per browser. */
export function imageUrl(publicId, { width, transform } = {}) {
  const t = ["f_auto", "q_auto", width ? `w_${width}` : null, transform]
    .filter(Boolean)
    .join(",");
  return `${base("image")}/${t}/${publicId}`;
}

export function videoUrl(publicId, { transform } = {}) {
  const t = ["f_auto", "q_auto", transform].filter(Boolean).join(",");
  return `${base("video")}/${t}/${publicId}.mp4`;
}

/**
 * Poster frame for a video.
 *
 * so_2 rather than so_auto: auto frame selection is not on every plan, and two
 * seconds in clears the fade these clips tend to open on — the same reason the
 * local import seeks before grabbing a frame. Switch to so_auto if the account
 * supports it; it picks a better frame.
 */
export function videoPosterUrl(publicId, { width, offset = 2 } = {}) {
  const t = ["f_auto", "q_auto", `so_${offset}`, width ? `w_${width}` : null]
    .filter(Boolean)
    .join(",");
  return `${base("video")}/${t}/${publicId}.jpg`;
}
