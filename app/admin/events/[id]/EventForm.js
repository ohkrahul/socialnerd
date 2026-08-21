"use client";

import { useActionState } from "react";
import {
  announceEvent,
  deleteEvent,
  duplicateEvent,
  resync,
  saveEvent,
  setStatus,
} from "../../actions";

const IST = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Kolkata",
});

const fmt = (iso) => (iso ? IST.format(new Date(iso)) : "—");

/** Read-only: Meetup owns these, and an edit here would be overwritten anyway. */
function Synced({ label, value }) {
  return (
    <div className="edge border-t py-3">
      <dt className="eyebrow t-faint">{label}</dt>
      <dd className="t-dim mt-1 text-[0.9375rem]">{value || "—"}</dd>
    </div>
  );
}

function Field({ label, name, defaultValue, hint, type = "text", ...rest }) {
  return (
    <label className="block">
      <span className="eyebrow t-faint">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        className="edge mt-2 min-h-11 w-full rounded-lg border bg-transparent px-4 text-[0.9375rem] text-ivory outline-none focus-visible:border-sage"
        {...rest}
      />
      {hint && <span className="t-faint mt-2 block text-[0.75rem]">{hint}</span>}
    </label>
  );
}

function Announce({ event }) {
  const [state, action, pending] = useActionState(announceEvent, {});

  return (
    <div className="edge mt-6 rounded-xl border p-6">
      <p className="eyebrow t-accent">Announce</p>

      {event.announcedAt ? (
        <p className="t-dim mt-4 text-[0.875rem]">
          Already announced on {fmt(event.announcedAt)}. Sending again mails
          everyone a second time.
        </p>
      ) : (
        <p className="t-dim mt-4 text-[0.875rem]">
          Emails the notify list with the date, venue, fee and the three booking
          steps. One message each, so every unsubscribe link is personal.
        </p>
      )}

      <form action={action} className="mt-5">
        <input type="hidden" name="id" value={event.id} />
        <button
          type="submit"
          disabled={pending || event.status !== "published"}
          className="btn btn-ghost-light disabled:opacity-45"
        >
          {pending
            ? "Sending…"
            : event.announcedAt
              ? "Send again"
              : "Announce to the list"}
        </button>
      </form>

      {event.status !== "published" && (
        <p className="t-faint mt-3 text-[0.75rem]">Publish it first.</p>
      )}
      {state?.error && (
        <p role="alert" className="mt-3 text-[0.8125rem] text-red-300">
          {state.error}
        </p>
      )}
      {state?.ok && (
        <p role="status" className="mt-3 text-[0.8125rem] text-sage">
          {state.ok}
        </p>
      )}
    </div>
  );
}

export default function EventForm({ event }) {
  const [state, action, pending] = useActionState(saveEvent, {});

  return (
    <div className="mt-6 grid grid-cols-1 gap-x-14 gap-y-10 lg:grid-cols-12">
      {/* -------- editorial: the admin owns all of this -------- */}
      <div className="lg:col-span-7">
        <h1 className="question text-[2.2rem]">{event.title}</h1>
        <p className="t-dim mt-3 text-[0.9375rem]">
          Everything below is yours. The panel on the right comes from Meetup and
          is overwritten on every sync.
        </p>

        <form action={action} className="mt-9 flex flex-col gap-6">
          <input type="hidden" name="id" value={event.id} />

          <label className="block">
            <span className="eyebrow t-faint">Subtitle</span>
            <input
              name="subtitle"
              defaultValue={event.subtitle}
              placeholder="Knowing the vocabulary is not the same as practising empathy."
              className="edge mt-2 min-h-11 w-full rounded-lg border bg-transparent px-4 text-[0.9375rem] text-ivory outline-none focus-visible:border-sage"
            />
            <span className="t-faint mt-2 block text-[0.75rem]">
              One line, shown on the poster and under the title.
            </span>
          </label>

          <label className="block">
            <span className="eyebrow t-faint">The one question</span>
            <textarea
              name="memorableQuestion"
              defaultValue={event.memorableQuestion}
              rows={3}
              placeholder="Are we emotionally intelligent — or have we only learned the vocabulary?"
              className="edge mt-2 w-full rounded-lg border bg-transparent px-4 py-3 text-[0.9375rem] text-ivory outline-none focus-visible:border-sage"
            />
            <span className="t-faint mt-2 block text-[0.75rem]">
              The question that opens the room. This is the line people remember,
              and Meetup has nowhere to put it.
            </span>
          </label>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Field
              label="Fee (₹)"
              name="feeInr"
              type="number"
              min="0"
              defaultValue={event.feeInr}
              hint="Read from the listing"
            />
            <Field
              label="Capacity"
              name="capacity"
              type="number"
              min="0"
              defaultValue={event.capacity}
              hint="Rooms run 8–12"
            />
            <Field
              label="Seats left"
              name="seatsRemaining"
              type="number"
              min="0"
              defaultValue={event.seatsRemaining}
              hint="0 shows a waitlist"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              label="Attendance"
              name="attendance"
              type="number"
              min="0"
              defaultValue={event.attendance}
              hint="After the event. Not shown publicly."
            />
            <Field
              label="Recap URL"
              name="recapUrl"
              type="url"
              defaultValue={event.recapUrl}
              hint="Optional write-up"
            />
          </div>

          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={event.featured}
              className="mt-1 h-4 w-4 accent-sage"
            />
            <span className="text-[0.9375rem]">
              <span className="t-fg font-medium">Feature on the homepage</span>
              <span className="t-faint mt-1 block text-[0.8125rem]">
                Only one event is featured at a time. Publishing is separate.
              </span>
            </span>
          </label>

          {state?.error && (
            <p role="alert" className="text-[0.875rem] text-red-300">
              {state.error}
            </p>
          )}
          {state?.ok && (
            <p role="status" className="text-[0.875rem] text-sage">
              {state.ok}
            </p>
          )}

          <div>
            <button
              type="submit"
              disabled={pending}
              className="btn btn-ivory disabled:opacity-60"
            >
              {pending ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </div>

      {/* -------- synced facts and state changes -------- */}
      <aside className="lg:col-span-5">
        <div className="edge rounded-xl border p-6">
          <div className="flex items-center justify-between gap-3">
            <p className="eyebrow t-accent">From Meetup</p>
            <form action={resync.bind(null, event.id)}>
              <button className="eyebrow t-faint hover:text-ivory">Re-sync now</button>
            </form>
          </div>

          {event.syncError && (
            <p className="mt-4 rounded-lg border border-red-400/40 bg-red-400/5 p-3 text-[0.8125rem] text-red-300">
              {event.syncError}
            </p>
          )}

          <dl className="mt-4">
            <Synced label="Starts" value={fmt(event.startAt)} />
            <Synced label="Ends" value={fmt(event.endAt)} />
            <Synced label="Venue" value={event.venueName} />
            <Synced label="Address" value={event.venueAddress} />
            <Synced label="Meetup says" value={event.meetupStatus} />
            <Synced label="Last synced" value={fmt(event.syncedAt)} />
          </dl>

          <div className="edge mt-5 flex flex-wrap gap-4 border-t pt-5 text-[0.8125rem]">
            <a
              href={event.meetupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="t-accent hover:underline"
            >
              Open on Meetup ↗
            </a>
            {event.hasPoster && (
              <a
                href={`/api/events/${event.meetupId}/poster`}
                target="_blank"
                rel="noopener noreferrer"
                className="t-accent hover:underline"
              >
                View poster ↗
              </a>
            )}
          </div>
        </div>

        {event.hasPoster && (
          // Served from Postgres, so next/image would only add a proxy hop.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/api/events/${event.meetupId}/poster`}
            alt=""
            className="edge mt-6 w-full rounded-xl border"
          />
        )}

        <div className="edge mt-6 rounded-xl border p-6">
          <p className="eyebrow t-accent">This event is {event.status}</p>

          <div className="mt-5 flex flex-wrap gap-3">
            {event.status !== "published" && (
              <form action={setStatus.bind(null, event.id, "published")}>
                <button className="btn btn-ivory">Publish</button>
              </form>
            )}
            {event.status === "published" && (
              <form action={setStatus.bind(null, event.id, "draft")}>
                <button className="btn btn-ghost-light">Back to draft</button>
              </form>
            )}
            {event.status !== "cancelled" && (
              <form action={setStatus.bind(null, event.id, "cancelled")}>
                <button className="btn btn-ghost-light">Mark cancelled</button>
              </form>
            )}
          </div>

          <div className="edge mt-6 flex flex-wrap items-center gap-5 border-t pt-5 text-[0.8125rem]">
            <form action={duplicateEvent.bind(null, event.id)}>
              <button className="t-dim hover:text-ivory">Duplicate as draft</button>
            </form>
            <form action={deleteEvent.bind(null, event.id)}>
              <button className="text-red-300/80 hover:text-red-300">Delete</button>
            </form>
          </div>
        </div>

        <Announce event={event} />
      </aside>
    </div>
  );
}
