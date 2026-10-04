import { useEffect, useState } from "react";

/**
 * Bridge for the demo data. Today it resolves static data after a short delay
 * so every screen exercises its skeleton state; swapping the resolver for a
 * real API call later requires no change in the consuming screens.
 */
export function useRemoteData<T>(resolver: () => T | Promise<T>, delay = 550) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    const timer = setTimeout(async () => {
      const value = await resolver();
      if (!alive) return;
      setData(value);
      setLoading(false);
    }, delay);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, loading };
}
