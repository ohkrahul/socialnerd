"use client";

import { useRef, useState } from "react";
import Magnetic from "./Magnetic";

/**
 * The site's only first-party conversion: tell me when the next conversation is.
 *
 * `source` records which call to action a person came through, so it's possible
 * to tell later which framing actually worked.
 *
 * Validation is duplicated here and in the route handler on purpose — this copy
 * is for fast feedback, the server's copy is the one that's trusted.
 */
export default function NotifyForm({
  source = "hero",
  tone = "dark",
  label = "Tell me when the next one is",
  className = "",
}) {
  const [state, setState] = useState("idle"); // idle | sending | done | error
  const [message, setMessage] = useState("");
  const input = useRef(null);

  const light = tone === "dark";

  async function onSubmit(event) {
    event.preventDefault();
    if (state === "sending") return;

    const email = input.current.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setState("error");
      setMessage("That doesn't look like an email address.");
      input.current.focus();
      return;
    }

    setState("sending");
    setMessage("");

    try {
      const response = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "Couldn't save that. Try again in a moment.");
      }

      setState("done");
      setMessage("You're on the list. We'll write before it goes up on Meetup.");
    } catch (error) {
      setState("error");
      setMessage(error.message);
    }
  }

  // Success replaces the form: there is nothing left to do here.
  if (state === "done") {
    return (
      <p
        role="status"
        className={`flex items-start gap-3 text-[0.9375rem] font-medium ${className}`}
      >
        <svg
          viewBox="0 0 24 24"
          className="mt-0.5 h-5 w-5 shrink-0 t-accent"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M5 12.5l4.5 4.5L19 7" />
        </svg>
        <span className="t-fg">{message}</span>
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className={className}>
      <div
        className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-2 sm:rounded-full sm:border sm:p-1.5 ${
          light ? "sm:border-ivory/25" : "sm:border-ink/20"
        }`}
      >
        <label htmlFor={`notify-${source}`} className="sr-only">
          Email address
        </label>
        <input
          ref={input}
          id={`notify-${source}`}
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
          aria-invalid={state === "error"}
          aria-describedby={state === "error" ? `notify-${source}-error` : undefined}
          onChange={() => state === "error" && setState("idle")}
          className={`min-h-11 grow rounded-full bg-transparent px-5 text-[0.9375rem] outline-none placeholder:opacity-45 ${
            light ? "text-ivory" : "text-ink"
          } ${
            state === "error"
              ? "ring-1 ring-red-400/70"
              : "border sm:border-0 " + (light ? "border-ivory/25" : "border-ink/20")
          }`}
        />

        <Magnetic strength={0.16}>
          <button
            type="submit"
            disabled={state === "sending"}
            className={`btn w-full justify-center sm:w-auto ${
              light ? "btn-ivory" : "btn-solid"
            } disabled:opacity-60`}
          >
            {state === "sending" ? "Adding you…" : label}
          </button>
        </Magnetic>
      </div>

      {state === "error" && (
        <p
          id={`notify-${source}-error`}
          role="alert"
          className="mt-3 pl-1 text-[0.8125rem] text-red-300"
        >
          {message}
        </p>
      )}

      {state === "idle" && (
        <p className="t-faint mt-3 pl-1 text-[0.8125rem]">
          One email when a date is set. Nothing else, ever.
        </p>
      )}
    </form>
  );
}
