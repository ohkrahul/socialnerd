"use client";

import { useActionState } from "react";
import Link from "next/link";
import { importFromMeetup } from "../../actions";

export default function ImportForm() {
  const [state, action, pending] = useActionState(importFromMeetup, {});

  return (
    <div className="max-w-[42rem]">
      <Link href="/admin" className="eyebrow t-faint hover:text-ivory">
        ← Events
      </Link>

      <h1 className="question mt-6 text-[clamp(1.6rem,7vw,2.4rem)]">Import from Meetup</h1>
      <p className="t-dim mt-4">
        Paste the event URL. Title, date, time, venue, address and the poster are
        read straight off the listing — you only add what Meetup can&rsquo;t know.
      </p>

      <form action={action} className="mt-9">
        <label htmlFor="url" className="eyebrow t-faint">
          Meetup event URL
        </label>
        <input
          id="url"
          name="url"
          type="url"
          required
          autoFocus
          placeholder="https://www.meetup.com/mumbai-social-intelligence-meetup-group/events/315737367/"
          className="edge mt-3 min-h-11 w-full rounded-lg border bg-transparent px-4 text-[0.9375rem] text-ivory outline-none focus-visible:border-sage"
        />

        {state?.error && (
          <p role="alert" className="mt-4 text-[0.875rem] text-red-300">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="btn btn-ivory mt-6 disabled:opacity-60"
        >
          {pending ? "Reading the listing…" : "Import as draft"}
        </button>

        <p className="t-faint mt-4 text-[0.8125rem]">
          It arrives as a draft. Nothing appears on the site until you publish it.
        </p>
      </form>
    </div>
  );
}
