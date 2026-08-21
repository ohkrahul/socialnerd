"use client";

import { useActionState } from "react";
import { signIn } from "../actions";

export default function LoginPage() {
  const [state, action, pending] = useActionState(signIn, {});

  return (
    <div className="shell flex min-h-svh items-center justify-center py-16">
      <div className="w-full max-w-[26rem]">
        <p className="eyebrow t-accent">Social Nerds</p>
        <h1 className="question mt-5 text-[clamp(1.6rem,7vw,2.4rem)]">Admin</h1>
        <p className="t-dim mt-4 text-[0.9375rem]">
          One password, shared by the organisers.
        </p>

        <form action={action} className="mt-9">
          <label htmlFor="password" className="eyebrow t-faint">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            autoFocus
            className="edge mt-3 min-h-11 w-full rounded-lg border bg-transparent px-4 text-ivory outline-none focus-visible:border-sage"
          />

          {state?.error && (
            <p role="alert" className="mt-4 text-[0.875rem] text-red-300">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="btn btn-ivory mt-6 w-full justify-center disabled:opacity-60"
          >
            {pending ? "Checking…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
