import Link from "next/link";
import { Op } from "sequelize";
import { requireAdmin } from "@/lib/auth";
import { Event } from "@/lib/models/Event";
import { Subscriber } from "@/lib/models/Subscriber";
import { setFeatured, setStatus } from "./actions";

export const dynamic = "force-dynamic";

const IST = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZone: "Asia/Kolkata",
});

const BADGE = {
  draft: "border-ivory/25 text-ivory/60",
  published: "border-sage text-sage",
  cancelled: "border-red-400/50 text-red-300",
};

export default async function AdminHome() {
  await requireAdmin();

  const [events, subscriberCount, unseen] = await Promise.all([
    Event.findAll({ order: [["startAt", "DESC"]] }),
    Subscriber.count({ where: { unsubscribedAt: null } }),
    Event.count({ where: { status: "draft", syncError: null } }),
  ]);

  const failed = events.filter((e) => e.syncError);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow t-accent">Conversations</p>
          <h1 className="question mt-4 text-[2.4rem]">
            {events.length} event{events.length === 1 ? "" : "s"}
          </h1>
          <p className="t-dim mt-3 text-[0.9375rem]">
            {unseen} in draft · {subscriberCount} on the notify list
          </p>
        </div>

        <Link href="/admin/events/new" className="btn btn-ivory">
          Import from Meetup
        </Link>
      </div>

      {failed.length > 0 && (
        <div className="mt-8 rounded-lg border border-red-400/40 bg-red-400/5 p-5">
          <p className="eyebrow text-red-300">Sync failed</p>
          <ul className="mt-3 flex flex-col gap-1 text-[0.875rem]">
            {failed.map((event) => (
              <li key={event.id} className="t-dim">
                <span className="t-fg font-medium">{event.title}</span> — {event.syncError}
              </li>
            ))}
          </ul>
          <p className="t-faint mt-3 text-[0.8125rem]">
            The site is still showing the last good copy of these. Nothing is broken
            for visitors.
          </p>
        </div>
      )}

      {events.length === 0 ? (
        <div className="edge mt-12 rounded-xl border border-dashed p-12 text-center">
          <p className="display text-[1.6rem]">No events yet.</p>
          <p className="t-dim mx-auto mt-3 max-w-[26rem] text-[0.9375rem]">
            Paste a Meetup event URL and everything Meetup knows — title, date,
            venue, poster — is filled in for you.
          </p>
          <Link href="/admin/events/new" className="btn btn-ivory mt-7">
            Import the first one
          </Link>
        </div>
      ) : (
        <div className="edge mt-10 overflow-x-auto rounded-xl border">
          <table className="w-full min-w-[52rem] text-left text-[0.875rem]">
            <thead>
              <tr className="edge border-b">
                {["Conversation", "When", "Venue", "Status", "Meetup", ""].map((h) => (
                  <th key={h} className="eyebrow t-faint px-5 py-4 font-bold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {events.map((event) => {
                const past = new Date(event.endAt ?? event.startAt) < new Date();
                return (
                  <tr key={event.id} className="edge border-b last:border-b-0">
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/events/${event.id}`}
                        className="t-fg font-medium hover:text-sage"
                      >
                        {event.title}
                      </Link>
                      {event.featured && (
                        <span className="eyebrow ml-3 text-sand">Featured</span>
                      )}
                      {past && <span className="eyebrow t-faint ml-3">Past</span>}
                    </td>
                    <td className="t-dim px-5 py-4 whitespace-nowrap">
                      {IST.format(new Date(event.startAt))}
                    </td>
                    <td className="t-dim px-5 py-4">{event.venueName ?? "—"}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`eyebrow rounded-full border px-3 py-1 ${BADGE[event.status]}`}
                      >
                        {event.status}
                      </span>
                    </td>
                    <td className="t-faint px-5 py-4">{event.meetupStatus}</td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2 whitespace-nowrap">
                        {event.status !== "published" && (
                          <form action={setStatus.bind(null, event.id, "published")}>
                            <button className="eyebrow t-accent hover:underline">
                              Publish
                            </button>
                          </form>
                        )}
                        {event.status === "published" && !event.featured && !past && (
                          <form action={setFeatured.bind(null, event.id)}>
                            <button className="eyebrow text-sand hover:underline">
                              Feature
                            </button>
                          </form>
                        )}
                        {event.status === "published" && (
                          <form action={setStatus.bind(null, event.id, "draft")}>
                            <button className="eyebrow t-faint hover:underline">
                              Unpublish
                            </button>
                          </form>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
