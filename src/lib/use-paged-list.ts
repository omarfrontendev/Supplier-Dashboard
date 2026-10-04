/**
 * §0.4 — "الفلتر والصفحة بيتحفظوا في الـ URL": the page and the filters a
 * list is showing belong in the address, so a reload, a Back, or a pasted
 * link lands on the same rows.
 *
 * It reads and writes the raw search object rather than a route's typed one,
 * because every list carries its own filter names and they should not each
 * need a bespoke hook.
 */

import { useCallback, useMemo } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";

/**
 * The frames draw "20 per page", and §0.4 proposes 25 - marked مقترح, a
 * suggestion rather than a rule, so the drawn number stands and 25 is offered
 * in the menu. Recorded in `roadmap.md`.
 */
export const DEFAULT_PAGE_SIZE = 20;

type Search = Record<string, unknown>;

export function useListSearch() {
  const navigate = useNavigate();
  const search = useRouterState({
    select: (state) => state.location.search as Search,
  });

  /** Merge keys into the address; `undefined` drops a key from the URL. */
  const setSearch = useCallback(
    (patch: Search) => {
      void navigate({
        to: ".",
        search: (current: Search) => {
          const next: Search = { ...current, ...patch };
          for (const key of Object.keys(next)) {
            if (next[key] === undefined || next[key] === "") delete next[key];
          }
          return next;
        },
        replace: true,
      } as never);
    },
    [navigate]
  );

  return { search, setSearch };
}

export interface PagedList<T> {
  /** The rows this page shows. */
  rows: T[];
  page: number;
  pages: number;
  /** 1-based, for the "Showing 1-20 of 48" line. */
  from: number;
  to: number;
  total: number;
  size: number;
  setPage: (page: number) => void;
  setSize: (size: number) => void;
}

/**
 * Slices `rows` for the page named in the URL. A filter change that shortens
 * the list past the current page falls back to the last one that exists,
 * rather than showing an empty table with rows behind it.
 */
export function usePagedList<T>(
  rows: readonly T[],
  { size: sizeProp }: { size?: number } = {}
): PagedList<T> {
  const { search, setSearch } = useListSearch();

  const size = Number(search["size"]) || sizeProp || DEFAULT_PAGE_SIZE;
  const total = rows.length;
  const pages = Math.max(1, Math.ceil(total / size));
  const asked = Number(search["page"]) || 1;
  const page = Math.min(Math.max(1, asked), pages);

  const setPage = useCallback(
    (next: number) => setSearch({ page: next <= 1 ? undefined : next }),
    [setSearch]
  );
  const setSize = useCallback(
    (next: number) =>
      setSearch({
        size: next === DEFAULT_PAGE_SIZE ? undefined : next,
        page: undefined,
      }),
    [setSearch]
  );

  const paged = useMemo(
    () => rows.slice((page - 1) * size, page * size) as T[],
    [rows, page, size]
  );

  return {
    rows: paged,
    page,
    pages,
    from: (page - 1) * size + 1,
    to: Math.min(page * size, total),
    total,
    size,
    setPage,
    setSize,
  };
}
