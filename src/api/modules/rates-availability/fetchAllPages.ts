import type { RatesPageMeta } from "./types";

export const fetchAllPages = async <T>(
  fetchPage: (page: number) => Promise<{ items: T[]; meta: RatesPageMeta }>,
): Promise<T[]> => {
  const first = await fetchPage(1);
  const rest = await Promise.all(
    Array.from({ length: Math.max(first.meta.totalPages - 1, 0) }, (_, i) => fetchPage(i + 2)),
  );
  return [first, ...rest].flatMap((page) => page.items);
};
