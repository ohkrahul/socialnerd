import Link from "next/link";
import { Subscriber } from "@/lib/models/Subscriber";
import { verifyUnsubscribeToken } from "@/lib/mail";
import { siteMeta } from "@/lib/content";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Unsubscribe",
  robots: { index: false, follow: false },
};

/**
 * One click, no login, no "are you sure", no survey.
 *
 * The token is an HMAC of the address, so a link only works for the person it
 * was mailed to — but nobody has to prove who they are to leave a mailing list.
 * Making that hard is how you earn a spam complaint.
 */
export default async function UnsubscribePage({ searchParams }) {
  const { e: email, t: token } = await searchParams;

  const valid = email && token && verifyUnsubscribeToken(email, token);
  let done = false;
  let broke = false;

  if (valid) {
    try {
      await Subscriber.update(
        { unsubscribedAt: new Date() },
        { where: { email: String(email).toLowerCase(), unsubscribedAt: null } },
      );
      // Already unsubscribed counts as done — the outcome they wanted is true,
      // so zero rows updated is still success.
      done = true;
    } catch (error) {
      // Never 500 an unsubscribe page. Someone who wants out and meets a crash
      // reports spam instead, and that costs far more than an apology and a
      // fallback address.
      console.error(`unsubscribe: update failed — ${error.message}`);
      broke = true;
    }
  }

  return (
    <main className="ground-ink flex min-h-svh items-center justify-center">
      <div className="shell max-w-[34rem] py-20 text-center">
        <p className="eyebrow t-accent">{siteMeta.name}</p>

        {done ? (
          <>
            <h1 className="question mt-6 text-[clamp(2rem,5vw,3rem)]">
              You&rsquo;re off the list.
            </h1>
            <p className="t-dim mt-6">
              No more emails about dates. Nothing else changes — you can still
              RSVP on Meetup any time.
            </p>
          </>
        ) : broke ? (
          <>
            <h1 className="question mt-6 text-[clamp(2rem,5vw,3rem)]">
              Something went wrong on our end.
            </h1>
            <p className="t-dim mt-6">
              Your link was valid — we just couldn&rsquo;t save the change. Reply
              to any of our emails, or message {siteMeta.whatsapp} on WhatsApp,
              and we&rsquo;ll take you off by hand today.
            </p>
          </>
        ) : (
          <>
            <h1 className="question mt-6 text-[clamp(2rem,5vw,3rem)]">
              That link didn&rsquo;t work.
            </h1>
            <p className="t-dim mt-6">
              It may have been cut in half by an email client. Reply to any of our
              emails and we&rsquo;ll take you off by hand — that always works.
            </p>
          </>
        )}

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-ivory">
            Back to the site
          </Link>
          <a
            href={siteMeta.meetupUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost-light"
          >
            View on Meetup
          </a>
        </div>
      </div>
    </main>
  );
}
