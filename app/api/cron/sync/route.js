import { NextResponse } from "next/server";
import { syncAll } from "@/lib/meetup/sync";

/**
 * Nightly Meetup sync. Wired up in vercel.json.
 *
 * Guarded by a shared secret rather than left open: syncing makes outbound
 * requests and writes rows, so it is not something an anonymous caller should
 * be able to trigger repeatedly.
 *
 * Vercel Cron sends the secret as `Authorization: Bearer <CRON_SECRET>`.
 */
export const maxDuration = 60;

export async function GET(request) {
  const expected = process.env.CRON_SECRET;

  if (!expected) {
    console.error("cron/sync: CRON_SECRET is not set; refusing to run");
    return NextResponse.json({ error: "Not configured." }, { status: 503 });
  }

  if (request.headers.get("authorization") !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const summary = await syncAll();
    console.log(
      `cron/sync: discovered ${summary.discovered}, created ${summary.created}, updated ${summary.updated}, failed ${summary.failed}`,
    );
    return NextResponse.json(summary);
  } catch (error) {
    console.error("cron/sync failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
