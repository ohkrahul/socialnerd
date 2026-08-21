import { isSignedIn } from "@/lib/auth";
import { Subscriber } from "@/lib/models/Subscriber";

/**
 * CSV of the notify list.
 *
 * Guarded like any admin page — this is the whole mailing list, so an
 * unauthenticated hit gets a 404 rather than a 401, which doesn't confirm the
 * route exists.
 */

/**
 * A value starting with =, +, - or @ is interpreted as a formula by Excel and
 * Sheets. Prefixing with a quote neutralises it, so an address someone chose
 * can't execute anything when the organiser opens the file.
 */
function cell(value) {
  const text = String(value ?? "");
  const safe = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
  return `"${safe.replace(/"/g, '""')}"`;
}

export async function GET() {
  if (!(await isSignedIn())) return new Response("Not found", { status: 404 });

  const people = await Subscriber.findAll({
    where: { unsubscribedAt: null },
    order: [["createdAt", "DESC"]],
  });

  const rows = [
    ["email", "name", "source", "joined"].join(","),
    ...people.map((p) =>
      [
        cell(p.email),
        cell(p.name),
        cell(p.source),
        cell(new Date(p.createdAt).toISOString()),
      ].join(","),
    ),
  ];

  const stamp = new Date().toISOString().slice(0, 10);

  return new Response(`﻿${rows.join("\r\n")}\r\n`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="social-nerds-notify-list-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
