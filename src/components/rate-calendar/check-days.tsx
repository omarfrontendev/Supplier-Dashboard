/**
 * OV 04.BXF — the picked nights as a calendar, open or closed day by day.
 *
 * Restrictions is the one bulk overlay whose answer is not the same for
 * every night it touches: closing arrivals on one Friday is the ordinary
 * case, and a pair of Open / Closed toggles over the whole range cannot
 * say it. So the nights come back as the month they are in, each one
 * carrying its own In and Out.
 *
 * The week starts on Saturday. That is not a preference - it puts the
 * contract's weekend, Thursday and Friday, at the end of the row instead
 * of splitting it across both edges, which is how the frame draws it and
 * how a reader here thinks about a week.
 *
 * A weekday name is a control too: tapping it opens or closes that column
 * for every picked night in it, because "no arrivals on Fridays" is one
 * decision and clicking four Fridays is four chances to miss one.
 */

import { Moon } from "lucide-react";
import { fill } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** Saturday first, so Thu and Fri close the row rather than straddle it. */
const COLUMNS = [6, 0, 1, 2, 3, 4, 5];

type Shut = Record<string, { in?: boolean; out?: boolean }>;
type Tri = "open" | "closed";

/**
 * What a night inherits when the supplier leaves it on Inherit - the same
 * effective values the WHAT APPLIES NOW table shows, already resolved by the
 * backend. "mixed": the picked rooms disagree on that night.
 */
export type InheritedChecks = {
  in?: Tri | "mixed";
  out?: Tri | "mixed";
  /** Effective minimum stay across the picked rooms; lo !== hi when they disagree. 0 = none. */
  min?: { lo: number; hi: number };
};

/**
 * Live contracts: three states per side - Inherit (neutral, nothing sent),
 * Open and Closed (both sent explicitly). Same calendar, same chips.
 */
export interface TriStateChecks {
  states: Record<string, { in?: Tri; out?: Tri }>;
  /** Effective values per night, shown on Inherit chips. Absent while loading. */
  inherited?: Record<string, InheritedChecks> | undefined;
  /** The minimum the draft would set on this night, or undefined to inherit. */
  draftMin?: ((date: Date) => number | undefined) | undefined;
  onSet: (keys: string[], what: "in" | "out", value: Tri | undefined) => void;
  copy: {
    legendInherit: { en: string; ar: string };
    legendOpen: { en: string; ar: string };
    legendClosed: { en: string; ar: string };
    legendTap: { en: string; ar: string };
    valueOpen: { en: string; ar: string };
    valueClosed: { en: string; ar: string };
    minStay?: { en: string; ar: string };
    /** "{n} nights" */
    minNights?: { en: string; ar: string };
    noMinimum?: { en: string; ar: string };
  };
}

/** Tap order: Inherit -> Closed -> Open -> Inherit. Closing is the usual intent. */
const nextTri = (value: Tri | undefined): Tri | undefined =>
  value === undefined ? "closed" : value === "closed" ? "open" : undefined;

const chipTone = (value: Tri | undefined, inherited?: Tri | "mixed") =>
  value === "closed"
    ? "bg-status-danger-bg text-status-danger"
    : value === "open"
      ? "bg-[#e3f4e8] text-[#1d6b3f]"
      : /* Inherit keeps its dashed edge; the fill says what it inherits. */
        inherited === "closed"
        ? "border border-dashed border-status-danger/40 bg-status-danger-bg text-status-danger"
        : inherited === "open"
          ? "border border-dashed border-[#1d6b3f]/30 bg-[#e3f4e8] text-[#1d6b3f]"
          : "border border-dashed border-border-default bg-surface-subtle text-text-muted";

export function CheckDays({
  dates,
  covered,
  shut,
  onToggle,
  k,
  c,
  dp,
  n,
  year,
  dayKey,
  tri,
}: {
  tri?: TriStateChecks | undefined;
  dates: Date[];
  covered: (date: Date) => boolean;
  shut: Shut;
  onToggle: (keys: string[], what: "in" | "out") => void;
  k: "en" | "ar";
  c: {
    calWeekdays: readonly string[];
    calWeekdaysAr: readonly string[];
    inTag: { en: string; ar: string };
    outTag: { en: string; ar: string };
    legendOpen: { en: string; ar: string };
    legendClosed: { en: string; ar: string };
    legendTap: { en: string; ar: string };
  };
  dp: { monthsShort: readonly string[] };
  n: (value: number) => string;
  /** A year is a name, not a quantity: no thousands separator. */
  year: (value: number) => string;
  dayKey: (date: Date) => string;
}) {
  /* One block per month the picked nights fall in, in order. */
  const months: Array<{ year: number; month: number }> = [];
  for (const date of dates) {
    const last = months[months.length - 1];
    if (!last || last.year !== date.getFullYear() || last.month !== date.getMonth()) {
      months.push({ year: date.getFullYear(), month: date.getMonth() });
    }
  }
  const pickedKeys = new Set(dates.map(dayKey));

  return (
    <div className="mt-3 space-y-4">
      {months.map(({ year: y, month }) => {
        const days = new Date(y, month + 1, 0).getDate();
        const first = new Date(y, month, 1).getDay();
        /* How many blanks before the 1st, counting from Saturday. */
        const lead = COLUMNS.indexOf(first);
        return (
          <div key={`${y}-${month}`}>
            <p className="text-[13px] font-semibold text-text-primary">
              {dp.monthsShort[month]} {year(y)}
            </p>
            <div className="mt-2 grid w-fit grid-cols-7 gap-1">
              {COLUMNS.map((weekday, column) => {
                const inColumn = dates.filter(
                  (date) => date.getDay() === weekday && covered(date)
                );
                const keys = inColumn.map(dayKey);
                return (
                  <button
                    key={weekday}
                    type="button"
                    disabled={keys.length === 0}
                    onClick={() => {
                      if (!tri) return onToggle(keys, "in");
                      /* The column closes together; once all closed, it inherits again. */
                      const allClosed = keys.every((key) => tri.states[key]?.in === "closed");
                      tri.onSet(keys, "in", allClosed ? undefined : "closed");
                    }}
                    title={(k === "ar" ? c.calWeekdaysAr : c.calWeekdays)[column]}
                    className={cn(
                      "px-1 pb-1 text-center text-[11px] font-medium",
                      keys.length === 0
                        ? "text-text-muted"
                        : "text-brand-deep hover:underline"
                    )}
                  >
                    {(k === "ar" ? c.calWeekdaysAr : c.calWeekdays)[column]}
                  </button>
                );
              })}
              {Array.from({ length: lead }, (_, blank) => (
                <span key={`lead-${blank}`} aria-hidden="true" />
              ))}
              {Array.from({ length: days }, (_, index) => index + 1).map(
                (day) => {
                  const date = new Date(y, month, day);
                  const key = dayKey(date);
                  const inRule = pickedKeys.has(key) && covered(date);
                  const state = shut[key] ?? {};
                  return (
                    <div
                      key={day}
                      className={cn(
                        "flex h-[34px] min-w-[86px] items-center gap-1 rounded-[8px] px-1.5",
                        inRule
                          ? "border border-border-subtle bg-surface-default"
                          : "bg-surface-subtle"
                      )}
                    >
                      <span
                        className={cn(
                          "w-4 text-center text-[11.5px] font-semibold",
                          inRule ? "text-text-primary" : "text-text-muted/70"
                        )}
                      >
                        {n(day)}
                      </span>
                      {inRule && tri && (
                        <>
                          {(
                            [
                              ["in", c.inTag[k]],
                              ["out", c.outTag[k]],
                            ] as Array<["in" | "out", string]>
                          ).map(([what, label]) => {
                            const value = tri.states[key]?.[what];
                            const inherited = tri.inherited?.[key]?.[what];
                            const inheritedWord =
                              inherited === "closed"
                                ? ` (${tri.copy.valueClosed[k]})`
                                : inherited === "open"
                                  ? ` (${tri.copy.valueOpen[k]})`
                                  : "";
                            return (
                              <button
                                key={what}
                                type="button"
                                aria-label={`${label}: ${
                                  value === "closed"
                                    ? tri.copy.legendClosed[k]
                                    : value === "open"
                                      ? tri.copy.legendOpen[k]
                                      : `${tri.copy.legendInherit[k]}${inheritedWord}`
                                }`}
                                onClick={() => tri.onSet([key], what, nextTri(value))}
                                className={cn(
                                  "rounded-[5px] px-1.5 py-0.5 text-[10.5px] font-medium transition-colors",
                                  chipTone(value, inherited),
                                )}
                              >
                                {label}
                              </button>
                            );
                          })}
                          <MinChip
                            draft={tri.draftMin?.(date)}
                            inherited={tri.inherited?.[key]?.min}
                            copy={tri.copy}
                            k={k}
                            n={n}
                          />
                        </>
                      )}
                      {inRule && !tri && (
                        <>
                          {(
                            [
                              ["in", c.inTag[k], state.in],
                              ["out", c.outTag[k], state.out],
                            ] as Array<["in" | "out", string, boolean | undefined]>
                          ).map(([what, label, closed]) => (
                            <button
                              key={what}
                              type="button"
                              aria-pressed={Boolean(closed)}
                              onClick={() => onToggle([key], what)}
                              className={cn(
                                "rounded-[5px] px-1.5 py-0.5 text-[10.5px] font-medium transition-colors",
                                closed
                                  ? "bg-status-danger-bg text-status-danger"
                                  : "bg-[#e3f4e8] text-[#1d6b3f]"
                              )}
                            >
                              {label}
                            </button>
                          ))}
                        </>
                      )}
                    </div>
                  );
                }
              )}
            </div>
          </div>
        );
      })}

      {tri ? (
        <p className="flex flex-wrap items-center gap-1.5 text-[11.5px] text-text-body">
          <span className={cn("rounded-[5px] px-1.5 py-0.5 text-[10.5px] font-medium", chipTone(undefined))}>
            {c.inTag[k]}
          </span>
          {tri.copy.legendInherit[k]}
          <span className={cn("ms-1.5 rounded-[5px] px-1.5 py-0.5 text-[10.5px] font-medium", chipTone("open"))}>
            {c.inTag[k]}
          </span>
          {tri.copy.legendOpen[k]}
          <span className={cn("ms-1.5 rounded-[5px] px-1.5 py-0.5 text-[10.5px] font-medium", chipTone("closed"))}>
            {c.inTag[k]}
          </span>
          {tri.copy.legendClosed[k]}
          {tri.copy.minStay && (
            <>
              <span className="ms-1.5 inline-flex items-center gap-0.5 rounded-[5px] border border-dashed border-border-default bg-surface-subtle px-1 py-0.5 text-[10.5px] font-medium text-text-body">
                <Moon aria-hidden="true" className="h-2.5 w-2.5" />
                {n(2)}
              </span>
              {tri.copy.minStay[k]}
            </>
          )}
          <span className="ms-1 text-text-quiet">{tri.copy.legendTap[k]}</span>
        </p>
      ) : (
      <p className="flex flex-wrap items-center gap-1.5 text-[11.5px] text-text-body">
        <span className="rounded-[5px] bg-[#e3f4e8] px-1.5 py-0.5 text-[10.5px] font-medium text-[#1d6b3f]">
          {c.inTag[k]}
        </span>
        {c.legendOpen[k]}
        <span className="ms-1.5 rounded-[5px] bg-status-danger-bg px-1.5 py-0.5 text-[10.5px] font-medium text-status-danger">
          {c.inTag[k]}
        </span>
        {c.legendClosed[k]}
        <span className="ms-1 text-text-quiet">{c.legendTap[k]}</span>
      </p>
      )}
    </div>
  );
}

/**
 * Min stay for one live night: solid when the draft sets it, dashed when it
 * inherits what applies now. "–" is no minimum (0). Read-only - the minimum is
 * set by the field above, not per night.
 */
function MinChip({
  draft,
  inherited,
  copy,
  k,
  n,
}: {
  draft: number | undefined;
  inherited: { lo: number; hi: number } | undefined;
  copy: TriStateChecks["copy"];
  k: "en" | "ar";
  n: (value: number) => string;
}) {
  if (!copy.minStay || !copy.minNights || !copy.noMinimum) return null;
  const range = draft !== undefined ? { lo: draft, hi: draft } : inherited;
  if (!range) return null;
  const words = (value: number) =>
    value > 0 ? fill(copy.minNights![k], { n: n(value) }) : copy.noMinimum![k];
  const short = (value: number) => (value > 0 ? n(value) : "–");
  const same = range.lo === range.hi;
  const text = same ? short(range.lo) : `${short(range.lo)}-${short(range.hi)}`;
  const said = same ? words(range.lo) : `${words(range.lo)} - ${words(range.hi)}`;
  const label = `${copy.minStay[k]}: ${said}${draft === undefined ? ` (${copy.legendInherit[k]})` : ""}`;
  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex items-center gap-0.5 rounded-[5px] px-1 py-0.5 text-[10.5px] font-medium",
        draft !== undefined
          ? "bg-primary-subtle text-brand-deep"
          : "border border-dashed border-border-default bg-surface-subtle text-text-body",
      )}
    >
      <Moon aria-hidden="true" className="h-2.5 w-2.5" />
      {text}
    </span>
  );
}
