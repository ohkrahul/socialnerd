import { requireAdmin } from "@/lib/auth";
import { getEditableValues } from "@/lib/settings";
import SettingsForm from "./SettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsAdmin() {
  await requireAdmin();
  const fields = await getEditableValues();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="question text-[clamp(1.45rem,6vw,2rem)]">Settings</h1>
        <p className="t-dim mt-2 max-w-[44rem] text-[0.9375rem]">
          The values that go out of date between deploys. Everything else on the
          site — the steps, the house rules, the FAQ, who it is and is not for —
          lives in <code>lib/content.js</code> on purpose: it changes once or
          twice a year and reads better edited as copy than as form fields.
        </p>
      </div>

      <SettingsForm fields={fields} />
    </div>
  );
}
