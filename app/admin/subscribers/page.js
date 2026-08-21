import { requireAdmin } from "@/lib/auth";
import { Subscriber } from "@/lib/models/Subscriber";

export const dynamic = "force-dynamic";

const IST = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium",
  timeZone: "Asia/Kolkata",
});

/** Which call to action brought them in, so you can tell what actually works. */
const SOURCE = {
  hero: "Hero",
  "event-none": "No date yet",
  "event-full": "Waitlist",
  "final-cta": "Closing",
};

export default async function SubscribersPage() {
  await requireAdmin();

  const people = await Subscriber.findAll({
    where: { unsubscribedAt: null },
    order: [["createdAt", "DESC"]],
    limit: 500,
  });

  const bySource = people.reduce((acc, person) => {
    acc[person.source] = (acc[person.source] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow t-accent">Notify list</p>
          <h1 className="question mt-4 text-[2.4rem]">
            {people.length} {people.length === 1 ? "person" : "people"}
          </h1>
          <p className="t-dim mt-3 text-[0.9375rem]">
            {Object.entries(bySource)
              .map(([source, count]) => `${SOURCE[source] ?? source}: ${count}`)
              .join(" · ") || "Nobody yet."}
          </p>
        </div>

        {people.length > 0 && (
          <a href="/api/admin/subscribers.csv" className="btn btn-ivory">
            Export CSV
          </a>
        )}
      </div>

      <p className="t-faint mt-6 max-w-[42rem] text-[0.8125rem]">
        To mail this list, open a published event and use{" "}
        <span className="t-dim">Announce to the list</span> — each person gets
        their own unsubscribe link. The CSV is for everything else.
      </p>

      {people.length === 0 ? (
        <div className="edge mt-10 rounded-xl border border-dashed p-12 text-center">
          <p className="display text-[1.6rem]">Nobody on the list yet.</p>
          <p className="t-dim mx-auto mt-3 max-w-[28rem] text-[0.9375rem]">
            The hero, the closing section and the &ldquo;no date yet&rdquo; card all
            feed this list.
          </p>
        </div>
      ) : (
        <div className="edge mt-10 overflow-x-auto rounded-xl border">
          <table className="w-full min-w-[34rem] text-left text-[0.875rem]">
            <thead>
              <tr className="edge border-b">
                {["Email", "Came from", "Joined"].map((h) => (
                  <th key={h} className="eyebrow t-faint px-5 py-4 font-bold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {people.map((person) => (
                <tr key={person.id} className="edge border-b last:border-b-0">
                  <td className="t-fg px-5 py-3.5">{person.email}</td>
                  <td className="t-dim px-5 py-3.5">
                    {SOURCE[person.source] ?? person.source}
                  </td>
                  <td className="t-faint px-5 py-3.5 whitespace-nowrap">
                    {IST.format(new Date(person.createdAt))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {people.length === 500 && (
        <p className="t-faint mt-5 text-[0.8125rem]">
          Showing the 500 most recent. The CSV export contains everyone.
        </p>
      )}
    </>
  );
}
