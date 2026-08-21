import { requireAdmin } from "@/lib/auth";
import ImportForm from "./ImportForm";

/**
 * Server wrapper so this page is guarded like every other admin route.
 *
 * The form itself needs useActionState, so it is a client component — and a
 * client component cannot call requireAdmin(). Without this wrapper the page
 * rendered for anyone who knew the URL.
 */
export default async function NewEventPage() {
  await requireAdmin();
  return <ImportForm />;
}
