/**
 * §0.4 — the twenty states, as one wrapper any list can put its rows inside.
 *
 * The rules the wrapper enforces, in the specification's own order:
 *
 *   • first load        → a skeleton shaped like the table, never a spinner
 *                         floating in the middle.
 *   • load after filter → the rows stay on screen, dimmed, with a small
 *                         indicator above them. The table does not blink out.
 *   • empty, first time → the teaching screen, with the first step on it.
 *   • empty after data  → one line saying why.
 *   • filter matched 0  → "Nothing matches" and a Clear filters button.
 *   • load failed       → the message sits where the content would be, with
 *                         Try again. The page around it stays up.
 */

import type { ReactNode } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { dataStateCopy } from "@/lib/data-state-copy";
import { fill, useLanguage } from "@/lib/i18n";

export interface DataStatesProps {
  /** Nothing has arrived yet: the skeleton is the whole screen. */
  loading?: boolean;
  /** Rows are on screen and a new page or filter is on its way. */
  refreshing?: boolean;
  /** The request failed. `onRetry` draws Try again beside the message. */
  error?: boolean;
  onRetry?: (() => void) | undefined;
  /** How many rows came back, and whether a filter is narrowing them. */
  count: number;
  filtered?: boolean;
  onClearFilters?: (() => void) | undefined;
  /** The skeleton shaped like this screen's own table or cards. */
  skeleton: ReactNode;
  /** The teaching screen for an account that has never had data here. */
  empty?: ReactNode;
  /** One line for a list that had rows before and has none now. */
  emptyAfterData?: ReactNode;
  children: ReactNode;
}

export function DataStates({
  loading = false,
  refreshing = false,
  error = false,
  onRetry,
  count,
  filtered = false,
  onClearFilters,
  skeleton,
  empty,
  emptyAfterData,
  children,
}: DataStatesProps) {
  const { lang } = useLanguage();
  const c = dataStateCopy[lang === "ar" ? "ar" : "en"];

  if (loading) return <>{skeleton}</>;

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-border-subtle bg-surface-default px-6 py-14 text-center">
        <AlertCircle
          className="h-6 w-6 text-status-danger"
          aria-hidden="true"
        />
        <p className="text-base font-semibold text-text-primary">
          {c.loadFailed}
        </p>
        <p className="max-w-[420px] text-sm leading-6 text-text-secondary">
          {c.loadFailedBody}
        </p>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            {c.tryAgain}
          </Button>
        )}
      </div>
    );
  }

  if (count === 0) {
    /* A filter is on: the rows exist, this view just excludes them all. */
    if (filtered) {
      return (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-border-subtle bg-surface-default px-6 py-14 text-center">
          <p className="text-base font-semibold text-text-primary">
            {c.nothingMatches}
          </p>
          <p className="max-w-[420px] text-sm leading-6 text-text-secondary">
            {c.nothingMatchesBody}
          </p>
          {onClearFilters && (
            <Button variant="outline" size="sm" onClick={onClearFilters}>
              {c.clearFilters}
            </Button>
          )}
        </div>
      );
    }
    if (emptyAfterData) return <>{emptyAfterData}</>;
    if (empty) return <>{empty}</>;
  }

  if (refreshing) {
    return (
      <div className="relative">
        <div
          className="pointer-events-none absolute inset-x-0 -top-3 z-10 flex justify-center"
          aria-live="polite"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface-default px-3 py-1 text-xs font-medium text-text-secondary shadow-card">
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
            {c.updating}
          </span>
        </div>
        <div className="pointer-events-none opacity-55 transition-opacity">
          {children}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

/** §0.4 — the footer line every paged list prints. */
export function ShowingRows({
  from,
  to,
  total,
  noun,
}: {
  from: number;
  to: number;
  total: number;
  /** "of 48 bookings" rather than "of 48", where the frame says so. */
  noun?: string;
}) {
  const { lang } = useLanguage();
  const c = dataStateCopy[lang === "ar" ? "ar" : "en"];
  const line = fill(c.showing, {
    from: total === 0 ? 0 : from,
    to,
    total: total.toLocaleString(lang === "ar" ? "ar-EG" : "en-US"),
  });
  return (
    <p className="text-xs text-text-muted">
      {noun ? `${line} ${noun}` : line}
    </p>
  );
}
