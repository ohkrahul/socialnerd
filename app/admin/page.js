import Link from "next/link";
import { Op } from "sequelize";
import { requireAdmin } from "@/lib/auth";
import { Event } from "@/lib/models/Event";
import { Subscriber } from "@/lib/models/Subscriber";
import { deleteEvent, setFeatured, setStatus } from "./actions";
import ConfirmSubmit from "./ConfirmSubmit";

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

/**
 * Publish / feature / unpublish / edit / delete for one event.
 *
 * Shared by the mobile cards and the desktop table so the two cannot drift —
 * the actions are the part most likely to gain a button later.
 */
function RowActions({ event, past, align = "start" }) {
  return (
    <div
      className={`flex flex-wrap gap-2 ${align === "end" ? "justify-end" : "justify-start"}`}
    >
      {event.status !== "published" && (
        <form action={setStatus.bind(null, event.id, "published")}>
          <button className="btn-row text-sage">Publish</button>
        </form>
      )}
      {event.status === "published" && !event.featured && !past && (
        <form action={setFeatured.bind(null, event.id)}>
          <button className="btn-row text-sand">Feature</button>
        </form>
      )}
      {event.status === "published" && (
        <form action={setStatus.bind(null, event.id, "draft")}>
          <button className="btn-row">Unpublish</button>
        </form>
      )}
      <Link href={`/admin/events/${event.id}`} className="btn-row">
        Edit
      </Link>
      {/* Irreversible, so it arms on the first click and commits on the second. */}
      <form action={deleteEvent.bind(null, event.id)}>
        <ConfirmSubmit
          className="btn-row border-red-400/40 text-red-300 hover:border-red-400/70 hover:bg-red-400/10 hover:text-red-200"
          armedClassName="btn-row border-red-400 bg-red-400/20 text-red-100"
          confirmLabel="Delete for good"
        />
      </form>
    </div>
  );
}

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
          <h1 className="question mt-4 text-[clamp(1.6rem,7vw,2.4rem)]">
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
          <p className="display text-[clamp(1.25rem,5vw,1.6rem)]">No events yet.</p>
          <p className="t-dim mx-auto mt-3 max-w-[26rem] text-[0.9375rem]">
            Paste a Meetup event URL and everything Meetup knows — title, date,
            venue, poster — is filled in for you.
          </p>
          <Link href="/admin/events/new" className="btn btn-ivory mt-7">
            Import the first one
          </Link>
        </div>
      ) : (
        <>
          {/* Cards below sm, table above.

              Six columns and five actions cannot fit 360px. Leaving it as a
              horizontally scrolling table meant the page itself panned, so the
              heading and the first column were both half off-screen — the table
              is only the right shape once there is room for it. */}
          <ul className="mt-8 flex flex-col gap-3 sm:hidden">
            {events.map((event) => {
              const past = new Date(event.endAt ?? event.startAt) < new Date();
              return (
                <li key={event.id} className="edge rounded-xl border p-4">
                  <Link
                    href={`/admin/events/${event.id}`}
                    className="t-fg block text-[1.0625rem] font-semibold hover:text-sage"
                  >
                    {event.title}
                  </Link>

                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
                    <span
                      className={`eyebrow rounded-full border px-2.5 py-1 ${BADGE[event.status]}`}
                    >
                      {event.status}
                    </span>
                    {event.featured && (
                      <span className="eyebrow text-sand">Featured</span>
                    )}
                    {past && <span className="eyebrow t-faint">Past</span>}
                  </div>

                  <dl className="mt-3 flex flex-col gap-1 text-[0.8125rem]">
                    <div className="flex gap-2">
                      <dt className="t-faint w-16 shrink-0">When</dt>
                      <dd className="t-dim">{IST.format(new Date(event.startAt))}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="t-faint w-16 shrink-0">Venue</dt>
                      <dd className="t-dim">{event.venueName ?? "—"}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="t-faint w-16 shrink-0">Meetup</dt>
                      <dd className="t-dim">{event.meetupStatus}</dd>
                    </div>
                  </dl>

                  <div className="mt-4">
                    <RowActions event={event} past={past} />
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="edge mt-10 hidden overflow-x-auto rounded-xl border sm:block">
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
                        {/* The row primary action, so it gets padding and a
                            block hit area rather than being a bare link. */}
                        <Link
                          href={`/admin/events/${event.id}`}
                          className="t-fg -mx-2 inline-block rounded px-2 py-1.5 text-[0.9375rem] font-semibold hover:text-sage hover:underline"
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
                        <RowActions event={event} past={past} align="end" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}
