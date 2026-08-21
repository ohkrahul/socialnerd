"use client";

import { useActionState, useRef, useState } from "react";
import { getUploadCredentials, saveGalleryItem } from "../actions";

/**
 * Two-step upload.
 *
 *   1. ask the server to sign an upload  (server action, admin-only)
 *   2. POST the file straight to Cloudinary from here
 *   3. tell the server what public id came back
 *
 * Step 2 skips this app entirely. A server action caps its body around 1MB and
 * these are videos, so routing the bytes through it would fail on anything but
 * a small still. It also means a slow upload never occupies a server worker.
 */
export default function UploadForm() {
  const [state, action, pending] = useActionState(saveGalleryItem, {});
  const [progress, setProgress] = useState(null);
  const [uploaded, setUploaded] = useState(null);
  const [error, setError] = useState(null);
  const fileRef = useRef(null);
  const kindRef = useRef(null);

  async function pushToCloudinary(event) {
    event.preventDefault();
    setError(null);
    const file = fileRef.current?.files?.[0];
    if (!file) return setError("Choose a file first.");

    const kind = kindRef.current?.value ?? "footage";
    const creds = await getUploadCredentials(kind);
    if (creds.error) return setError(creds.error);

    const resourceType = file.type.startsWith("video/") ? "video" : "image";
    const body = new FormData();
    body.append("file", file);
    body.append("api_key", creds.apiKey);
    body.append("timestamp", String(creds.timestamp));
    body.append("folder", creds.folder);
    body.append("signature", creds.signature);

    setProgress("Uploading…");
    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${creds.cloudName}/${resourceType}/upload`,
        { method: "POST", body },
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error?.message ?? `Upload failed (${res.status}).`);
      setUploaded({
        publicId: json.public_id,
        resourceType: json.resource_type,
        width: json.width,
        height: json.height,
        kind,
      });
      setProgress(null);
    } catch (e) {
      setProgress(null);
      setError(e.message);
    }
  }

  return (
    <div className="card p-6 text-ink">
      <h2 className="display text-[clamp(1.2rem,4.5vw,1.5rem)]">Add media</h2>

      {!uploaded ? (
        <form onSubmit={pushToCloudinary} className="mt-5 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-[0.875rem]">
            <span className="font-semibold">File</span>
            <input
              ref={fileRef}
              type="file"
              accept="image/*,video/*"
              required
              className="w-full rounded-lg border border-ink/20 p-2.5"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-[0.875rem]">
            <span className="font-semibold">What is it?</span>
            <select ref={kindRef} className="w-full rounded-lg border border-ink/20 p-2.5">
              <option value="footage">Footage — a real clip or photo of a room</option>
              <option value="poster">Poster — event artwork or a graphic</option>
            </select>
            <span className="text-ink/60">
              Posters go in their own strip, not the footage grid. A graphic in
              with the footage reads as a record of an evening.
            </span>
          </label>

          <button type="submit" disabled={Boolean(progress)} className="btn btn-solid self-start">
            {progress ?? "Upload"}
          </button>
          {error && <p className="text-[0.875rem] font-semibold text-red-700">{error}</p>}
        </form>
      ) : (
        <form action={action} className="mt-5 flex flex-col gap-4">
          <input type="hidden" name="publicId" value={uploaded.publicId} />
          <input type="hidden" name="resourceType" value={uploaded.resourceType} />
          <input type="hidden" name="width" value={uploaded.width ?? ""} />
          <input type="hidden" name="height" value={uploaded.height ?? ""} />
          <input type="hidden" name="kind" value={uploaded.kind} />

          <p className="text-[0.875rem] text-ink/70">
            Uploaded <code className="font-mono">{uploaded.publicId}</code> (
            {uploaded.width}×{uploaded.height})
          </p>

          <label className="flex flex-col gap-1.5 text-[0.875rem]">
            <span className="font-semibold">Caption</span>
            <input
              name="caption"
              required
              placeholder="Quote the clip's own on-screen text, or say what is in frame"
              className="w-full rounded-lg border border-ink/20 p-2.5"
            />
            <span className="text-ink/60">This is the alt text too, so describe it honestly.</span>
          </label>

          <label className="flex flex-col gap-1.5 text-[0.875rem]">
            <span className="font-semibold">Second line (optional)</span>
            <input
              name="meta"
              placeholder="18 July · Slow Brew, Chembur"
              className="w-full rounded-lg border border-ink/20 p-2.5"
            />
          </label>

          <div className="flex gap-3">
            <button type="submit" disabled={pending} className="btn btn-solid">
              {pending ? "Saving…" : "Save as draft"}
            </button>
            <button type="button" onClick={() => setUploaded(null)} className="btn btn-ghost">
              Discard
            </button>
          </div>
          {state?.error && (
            <p className="text-[0.875rem] font-semibold text-red-700">{state.error}</p>
          )}
        </form>
      )}

      {state?.ok && <p className="mt-4 text-[0.875rem] font-semibold text-green">{state.ok}</p>}
    </div>
  );
}
