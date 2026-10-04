import { useEffect, useState } from "react";

/**
 * Persisted UI preference. Starts from `fallback` on the server and during the
 * first client render (so SSR markup matches), then hydrates from localStorage.
 */
export function useStoredPref<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) setValue(JSON.parse(raw) as T);
    } catch {
      /* ignore unreadable storage */
    }
    setReady(true);
  }, [key]);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore full/blocked storage */
    }
  }, [key, ready, value]);

  return [value, setValue, ready] as const;
}

export const PREF_NAV_LABELS = "hoteliana-nav-labels";
