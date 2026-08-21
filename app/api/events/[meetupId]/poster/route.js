import { Event } from "@/lib/models/Event";

/**
 * Serves an event poster out of Postgres.
 *
 * Posters live as bytea rather than files because Vercel's filesystem is
 * read-only at runtime, so the nightly sync cannot write into public/. See the
 * note on Event.posterBytes.
 *
 * Cached hard and immutably: a poster for a given event never changes, and if
 * one ever did it would arrive under a new event id.
 */
export async function GET(_request, { params }) {
  const { meetupId } = await params;

  const event = await Event.findOne({
    where: { meetupId },
    attributes: ["posterBytes", "posterMime", "updatedAt"],
  });

  if (!event?.posterBytes) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(event.posterBytes, {
    headers: {
      "Content-Type": event.posterMime ?? "image/jpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Length": String(event.posterBytes.byteLength),
    },
  });
}
