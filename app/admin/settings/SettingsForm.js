"use client";

import { useActionState } from "react";
import { saveSettings } from "../actions";

export default function SettingsForm({ fields }) {
  const [state, action, pending] = useActionState(saveSettings, {});

  return (
    <form action={action} className="card flex flex-col gap-7 p-6 text-ink">
      {fields.map((field) => (
        <label key={field.key} className="flex flex-col gap-1.5">
          <span className="flex items-baseline gap-2 text-[0.9375rem] font-semibold">
            {field.label}
            {!field.saved && (
              <span className="rounded-full bg-ink/10 px-2 py-0.5 text-[0.6875rem] font-bold uppercase tracking-wider text-ink/60">
                default
              </span>
            )}
          </span>

          {field.type === "textarea" ? (
            <textarea
              name={field.key}
              defaultValue={field.value}
              rows={3}
              className="w-full rounded-lg border border-ink/20 p-2.5 text-[0.9375rem]"
            />
          ) : (
            <input
              name={field.key}
              type={field.type}
              inputMode={field.type === "number" ? "numeric" : undefined}
              min={field.type === "number" ? 0 : undefined}
              defaultValue={field.value}
              className="max-w-[12rem] rounded-lg border border-ink/20 p-2.5 text-[0.9375rem]"
            />
          )}

          <span className="text-[0.8125rem] text-ink/60">{field.help}</span>
        </label>
      ))}

      <div className="flex items-center gap-4">
        <button type="submit" disabled={pending} className="btn btn-solid self-start">
          {pending ? "Saving…" : "Save settings"}
        </button>
        {state?.ok && (
          <p className="text-[0.875rem] font-semibold text-green">{state.ok}</p>
        )}
        {state?.error && (
          <p className="text-[0.875rem] font-semibold text-red-700">{state.error}</p>
        )}
      </div>
    </form>
  );
}
