import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { Event } from "@/lib/models/Event";
import EventForm from "./EventForm";

export const dynamic = "force-dynamic";

export default async function EditEventPage({ params }) {
  await requireAdmin();
  const { id } = await params;

  const event = await Event.findByPk(id);
  if (!event) notFound();

  // Plain object across the server/client boundary; a Sequelize instance is not
  // serialisable and Buffers must not be shipped to the browser.
  const plain = {
    id: event.id,
    meetupId: event.meetupId,
    meetupUrl: event.meetupUrl,
    title: event.title,
    description: event.description,
    startAt: event.startAt?.toISOString() ?? null,
    endAt: event.endAt?.toISOString() ?? null,
    venueName: event.venueName,
    venueAddress: event.venueAddress,
    city: event.city,
    meetupStatus: event.meetupStatus,
    status: event.status,
    featured: event.featured,
    subtitle: event.subtitle ?? "",
    memorableQuestion: event.memorableQuestion ?? "",
    recapUrl: event.recapUrl ?? "",
    feeInr: event.feeInr ?? "",
    capacity: event.capacity ?? "",
    seatsRemaining: event.seatsRemaining ?? "",
    attendance: event.attendance ?? "",
    syncedAt: event.syncedAt?.toISOString() ?? null,
    announcedAt: event.announcedAt?.toISOString() ?? null,
    syncError: event.syncError,
    hasPoster: Boolean(event.posterBytes),
  };

  return (
    <>
      <Link href="/admin" className="eyebrow t-faint hover:text-ivory">
        ← Events
      </Link>
      <EventForm event={plain} />
    </>
  );
}
