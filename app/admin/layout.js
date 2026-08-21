import Link from "next/link";
import { isSignedIn } from "@/lib/auth";
import { signOut } from "./actions";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

/**
 * The admin shell. Styled from the site's own tokens rather than a component
 * library — this is forms and a table, and shadcn would mean Radix, CVA and
 * tailwind-merge for six screens.
 *
 * The login page renders without the chrome, so it opts out via isSignedIn
 * rather than being nested somewhere else.
 */
export default async function AdminLayout({ children }) {
  const signedIn = await isSignedIn();

  if (!signedIn) {
    return <div className="ground-ink min-h-svh">{children}</div>;
  }

  return (
    <div className="ground-ink min-h-svh">
      <header className="edge border-b">
        <div className="shell flex flex-wrap items-center justify-between gap-4 py-5">
          <div className="flex items-baseline gap-6">
            <Link href="/admin" className="display text-xl">
              Social Nerds<span className="text-sage">.</span>
            </Link>
            <nav className="flex gap-5 text-[0.875rem]" aria-label="Admin">
              <Link href="/admin" className="t-dim hover:text-ivory">
                Events
              </Link>
              <Link href="/admin/subscribers" className="t-dim hover:text-ivory">
                Notify list
              </Link>
              <Link href="/" className="t-dim hover:text-ivory">
                View site ↗
              </Link>
            </nav>
          </div>

          <form action={signOut}>
            <button type="submit" className="eyebrow t-faint hover:text-ivory">
              Sign out
            </button>
          </form>
        </div>
      </header>

      <main className="shell py-12">{children}</main>
    </div>
  );
}
