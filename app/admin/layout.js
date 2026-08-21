import { isSignedIn } from "@/lib/auth";
import AdminNav from "./AdminNav";

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
 *
 * The header is a client component because the mobile menu needs open state and
 * the current path to mark itself; everything else here stays on the server.
 */
export default async function AdminLayout({ children }) {
  const signedIn = await isSignedIn();

  if (!signedIn) {
    return <div className="ground-ink min-h-svh">{children}</div>;
  }

  return (
    <div className="ground-ink min-h-svh">
      <header className="edge border-b">
        <AdminNav />
      </header>

      <main className="shell py-8 lg:py-12">{children}</main>
    </div>
  );
}
