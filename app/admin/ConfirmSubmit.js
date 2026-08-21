"use client";

import { useEffect, useState } from "react";

/**
 * Two-step destructive action. Click once to arm, again to commit.
 *
 * This replaced a window.confirm() wrapper, which was actively broken: browsers
 * suppress repeat dialogs from the same page — Chrome and Edge offer "prevent
 * this page from creating additional dialogs" — and once that is on, confirm()
 * returns false without showing anything. The handler then cancelled the submit
 * and the button silently did nothing. The first delete worked and every one
 * after it looked dead.
 *
 * An inline arm/commit cannot be suppressed by the browser, needs no dialog,
 * and keeps the destructive click two deliberate actions apart. It disarms
 * itself after a few seconds so a half-pressed row does not sit armed.
 *
 * The unarmed state is type="button" so it cannot submit the surrounding form;
 * only the armed state is a submit.
 */
export default function ConfirmSubmit({
  label = "Delete",
  confirmLabel = "Sure?",
  className = "",
  armedClassName = "",
  disarmAfterMs = 4000,
}) {
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (!armed) return;
    const timer = setTimeout(() => setArmed(false), disarmAfterMs);
    return () => clearTimeout(timer);
  }, [armed, disarmAfterMs]);

  if (!armed) {
    return (
      <button type="button" className={className} onClick={() => setArmed(true)}>
        {label}
      </button>
    );
  }

  return (
    <button
      type="submit"
      autoFocus
      onBlur={() => setArmed(false)}
      className={armedClassName || className}
    >
      {confirmLabel}
    </button>
  );
}
