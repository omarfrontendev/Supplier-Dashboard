/**
 * BR-00-17 / P5.2 — "الجلسة بتخلص بعد 30 دقيقة من غير نشاط، وتحذير بعد 28
 * دقيقة (OV 11.30)، يعني قبلها بدقيقتين."
 *
 * The guide's other rules on the same timer:
 *
 *   • activity in any tab extends the session for every tab on that browser,
 *     which is what the `BroadcastChannel` is for;
 *   • pressing "Stay signed in" in one tab clears the warning in all of them;
 *   • a session has a twelve-hour ceiling even with activity;
 *   • sessions are per device — one expiring says nothing about another.
 *
 * Nothing here signs anyone out on its own: it reports `phase`, and the
 * screen decides. BR-00-18 is the reason — the sign-out screen depends on
 * *why*, and one generic modal for all four causes is forbidden.
 */

import { useCallback, useEffect, useRef, useState } from "react";

export const IDLE_LIMIT_MS = 30 * 60 * 1000;
export const WARN_AFTER_MS = 28 * 60 * 1000;
/** The ceiling a session cannot outlive, however busy the person is. */
export const SESSION_CEILING_MS = 12 * 60 * 60 * 1000;

const CHANNEL = "hoteliana-session";
const ACTIVITY = [
  "pointerdown",
  "keydown",
  "wheel",
  "touchstart",
  "visibilitychange",
] as const;

export type SessionPhase = "active" | "warning" | "expired";

export interface SessionWatch {
  phase: SessionPhase;
  /** Milliseconds left before the sign-out, for the live countdown. */
  remaining: number;
  /** "Stay signed in" — tells every tab the session is alive again. */
  stay: () => void;
}

export function useSessionWatch(
  { enabled = true }: { enabled?: boolean } = {}
): SessionWatch {
  const [phase, setPhase] = useState<SessionPhase>("active");
  const [remaining, setRemaining] = useState(IDLE_LIMIT_MS - WARN_AFTER_MS);
  const lastActive = useRef(Date.now());
  const startedAt = useRef(Date.now());
  const channel = useRef<BroadcastChannel | null>(null);

  const touch = useCallback((broadcast = true) => {
    lastActive.current = Date.now();
    setPhase((current) => (current === "expired" ? current : "active"));
    if (broadcast) channel.current?.postMessage({ at: lastActive.current });
  }, []);

  const stay = useCallback(() => touch(), [touch]);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    /* One channel for the browser, so every tab shares one idle clock. */
    if ("BroadcastChannel" in window) {
      channel.current = new BroadcastChannel(CHANNEL);
      channel.current.onmessage = (event: MessageEvent<{ at: number }>) => {
        if (event.data?.at > lastActive.current) touch(false);
      };
    }

    /* Passive, and only the timestamp is written - no render per keystroke. */
    const onActivity = () => touch();
    for (const type of ACTIVITY) {
      window.addEventListener(type, onActivity, { passive: true });
    }

    const tick = window.setInterval(() => {
      const idle = Date.now() - lastActive.current;
      const lived = Date.now() - startedAt.current;
      if (idle >= IDLE_LIMIT_MS || lived >= SESSION_CEILING_MS) {
        setPhase("expired");
        setRemaining(0);
      } else if (idle >= WARN_AFTER_MS) {
        setPhase("warning");
        setRemaining(IDLE_LIMIT_MS - idle);
      } else {
        setPhase("active");
        setRemaining(IDLE_LIMIT_MS - WARN_AFTER_MS);
      }
    }, 1000);

    return () => {
      for (const type of ACTIVITY) {
        window.removeEventListener(type, onActivity);
      }
      window.clearInterval(tick);
      channel.current?.close();
      channel.current = null;
    };
  }, [enabled, touch]);

  return { phase, remaining, stay };
}

/** 2:00 → 0:00, the countdown the warning writes into its own title. */
export function countdown(ms: number, lang: string): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  const text = `${minutes}:${String(seconds).padStart(2, "0")}`;
  return lang === "ar"
    ? text.replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]!)
    : text;
}
