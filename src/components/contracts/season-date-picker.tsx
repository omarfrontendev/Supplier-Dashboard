/**
 * OV 03.14P / 03.15P / 03.16P / 03.17P — pick a season's first and last night.
 *
 * BR-03-93's sibling rule: a season cannot overlap another one. The picker
 * does not enforce that with an error after the fact - the nights another
 * season already owns are simply locked, drawn in its own colour, and the
 * legend names the season that owns them. A rule you cannot break is worth
 * more than a rule you are told about afterwards.
 *
 * Which is also why the description changes rather than disappearing: on a
 * season with nothing around it, "No other season falls in these months, so
 * every night is free" is the same sentence answered the other way. A blank
 * where an explanation was reads as a missing explanation.
 *
 * The months are the season's own. Widening a season into a month it does
 * not touch is a different job - moving it - and the frames do not draw it.
 */

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { counted, nightsWord } from "@/lib/arabic-count";
import { fill, useLanguage } from "@/lib/i18n";
import { panelMotion, scrimMotion, useDismiss } from "@/components/layout/overlay";
import {
  seasonDetails,
  seasonPickerCopy,
  type SeasonDetail,
} from "@/lib/season-detail-data";
import { cn } from "@/lib/utils";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** "February 2027" -> the month index and the year. */
function parseMonth(label: string): { index: number; year: number } {
  const [name, year] = label.split(" ");
  return { index: Math.max(MONTHS.indexOf(name ?? ""), 0), year: Number(year) };
}

interface Night {
  /** Index into the season's months. */
  month: number;
  night: number;
}

const before = (a: Night, b: Night) =>
  a.month < b.month || (a.month === b.month && a.night < b.night);

export function SeasonDatePicker({
  season,
  onApply,
  onClose,
}: {
  season: SeasonDetail;
  onApply: (dates: { en: string; ar: string }) => void;
  onClose: () => void;
}) {
  const { lang, dir } = useLanguage();
  const dismiss = useDismiss({ onClose });
  const k = lang === "ar" ? ("ar" as const) : ("en" as const);
  const ar = k === "ar";
  const c = seasonPickerCopy;

  /* The nights another season already owns, in the months on screen. */
  const locked = season.months.map((month) => {
    const owner = seasonDetails.find(
      (other) =>
        other.key !== season.key &&
        other.months.some(
          (theirs) =>
            theirs.label.en === month.label.en && theirs.from && theirs.to
        )
    );
    const theirs = owner?.months.find(
      (item) => item.label.en === month.label.en
    );
    return owner && theirs?.from && theirs.to
      ? { name: owner.name, from: theirs.from, to: theirs.to }
      : null;
  });
  const lockedSeason = locked.find(Boolean) ?? null;

  const firstMonth = season.months.findIndex((month) => month.from);
  const lastMonth =
    season.months.length -
    1 -
    [...season.months].reverse().findIndex((month) => month.to);
  const [start, setStart] = useState<Night>({
    month: Math.max(firstMonth, 0),
    night: season.months[Math.max(firstMonth, 0)]?.from ?? 1,
  });
  const [end, setEnd] = useState<Night | null>({
    month: lastMonth,
    night: season.months[lastMonth]?.to ?? 1,
  });

  const isLocked = (month: number, night: number) => {
    const range = locked[month];
    return Boolean(range && night >= range.from && night <= range.to);
  };

  /* A range may not jump over a night another season owns. */
  const clearBetween = (a: Night, b: Night) => {
    for (let month = a.month; month <= b.month; month += 1) {
      const from = month === a.month ? a.night : 1;
      const to = month === b.month ? b.night : season.months[month]?.days ?? 0;
      for (let night = from; night <= to; night += 1) {
        if (isLocked(month, night)) return false;
      }
    }
    return true;
  };

  const pick = (month: number, night: number) => {
    if (isLocked(month, night)) return;
    const at = { month, night };
    /* A complete range starts again; an open one closes if it can. */
    if (end || before(at, start)) {
      setStart(at);
      setEnd(null);
      return;
    }
    if (clearBetween(start, at)) setEnd(at);
  };

  const dateOf = (at: Night) => {
    const month = season.months[at.month]!;
    const { index, year } = parseMonth(month.label.en);
    return new Date(year, index, at.night);
  };

  const digits = (value: string, key: "en" | "ar") =>
    key === "ar"
      ? value.replace(/[0-9]/g, (digit) => "٠١٢٣٤٥٦٧٨٩"[Number(digit)]!)
      : value;

  const last = end ?? start;
  const nights =
    Math.round(
      (dateOf(last).getTime() - dateOf(start).getTime()) / 86_400_000
    ) + 1;

  /* Both languages, because Apply hands the page a value it keeps. */
  const rangeIn = (key: "en" | "ar") => {
    const side = (at: Night) => {
      const label = season.months[at.month]!.label[key];
      const name = key === "ar" ? label.split(" ")[0]! : label.slice(0, 3);
      return `${digits(String(at.night).padStart(2, "0"), key)} ${name}`;
    };
    return fill(c.range[key], {
      from: side(start),
      to: side(last),
      year: digits(String(dateOf(last).getFullYear()), key),
      nights: counted(nights, nightsWord, key),
    });
  };
  const range = rangeIn(k);

  return (
    <div
      dir={dir}
      {...dismiss.scrim}
      className={cn(
        "fixed inset-0 z-[60] overflow-y-auto bg-brand-deep/40 p-4",
        scrimMotion
      )}
    >
      <div className="flex min-h-full items-center justify-center">
        <div
          {...dismiss.panel}
          className={cn(
            "w-full max-w-[660px] rounded-[16px] bg-surface-default p-6 shadow-overlay",
            panelMotion
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-brand-deep">
                {fill(c.overline[k], { season: season.name[k] })}
              </p>
              <h2 className="mt-2 text-[24px] font-semibold leading-tight text-text-primary">
                {c.title[k]}
              </h2>
              <p className="mt-2 text-[13px] leading-6 text-text-secondary">
                {(lockedSeason ? c.bodyLocked : c.bodyFree)[k]}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label={c.close[k]}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#eef1ee] text-text-muted transition-colors hover:text-text-primary"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-4 space-y-5">
            {season.months.map((month, monthIndex) => {
              const { index, year: monthYear } = parseMonth(month.label.en);
              /* Sunday first, and `firstColumn` counts from Monday. */
              const lead = (month.firstColumn + 1) % 7;
              return (
                <div key={month.label.en}>
                  <p className="text-[15px] font-semibold text-text-primary">
                    {month.label[k]}
                  </p>
                  <div className="mt-2 grid w-fit grid-cols-7 gap-1">
                    {(ar ? c.weekdaysAr : c.weekdays).map((name, column) => (
                      <span
                        key={name}
                        className={cn(
                          "flex h-5 w-10 items-center justify-center text-[11px] font-medium",
                          column === 4 || column === 5
                            ? "font-semibold text-brand-deep"
                            : "text-text-muted"
                        )}
                      >
                        {name}
                      </span>
                    ))}
                    {Array.from({ length: lead }, (_, blank) => (
                      <span key={`lead-${blank}`} aria-hidden="true" />
                    ))}
                    {Array.from(
                      { length: month.days },
                      (_, night) => night + 1
                    ).map((night) => {
                      const at = { month: monthIndex, night };
                      const lock = isLocked(monthIndex, night);
                      const isStart =
                        at.month === start.month && at.night === start.night;
                      const isEnd =
                        end !== null &&
                        at.month === end.month &&
                        at.night === end.night;
                      const inside =
                        end !== null &&
                        !before(at, start) &&
                        !before(end, at);
                      const weekend =
                        (new Date(monthYear, index, night).getDay() + 6) % 7 ===
                          3 ||
                        (new Date(monthYear, index, night).getDay() + 6) % 7 ===
                          4;
                      return (
                        <button
                          key={night}
                          type="button"
                          disabled={lock}
                          onClick={() => pick(monthIndex, night)}
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-[10px] text-[13px] font-medium transition-colors",
                            lock
                              ? "cursor-not-allowed border border-dashed border-[#db7093] bg-[#fdecf1] text-[#b02a5a]"
                              : isStart || isEnd
                                ? "bg-brand-deep font-semibold text-white"
                                : inside
                                  ? "rounded-[4px] bg-[#edffd6] text-brand-deep"
                                  : weekend
                                    ? "text-brand-deep hover:bg-surface-subtle"
                                    : "text-text-primary hover:bg-surface-subtle",
                            /* The ends of a range are round outside, square in. */
                            isStart && end !== null && !isEnd
                              ? "rounded-e-[4px]"
                              : "",
                            isEnd && !isStart ? "rounded-s-[4px]" : ""
                          )}
                        >
                          {digits(String(night), k)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-3.5 gap-y-1.5">
            {(
              [
                [
                  "#0b3d2e",
                  fill(c.legendSelected[k], { season: season.name[k] }),
                ],
                ...(lockedSeason
                  ? ([
                      [
                        "#db7093",
                        fill(c.legendLocked[k], {
                          season: lockedSeason.name[k],
                        }),
                      ],
                    ] as Array<[string, string]>)
                  : []),
                ["#0b3d2e", c.legendWeekend[k]],
              ] as Array<[string, string]>
            ).map(([colour, label]) => (
              <span key={label} className="flex items-center gap-1.5">
                <span
                  style={{ backgroundColor: colour }}
                  className="h-2 w-2 rounded-full"
                  aria-hidden="true"
                />
                <span className="text-[11px] text-text-body">{label}</span>
              </span>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            {/* The range has to keep its line: a button on top of it is
                worse than a button under it. */}
            <p className="min-w-0 flex-1 basis-48 text-[13px] font-semibold text-text-primary">
              {range}
            </p>
            <Button
              className="shrink-0"
              disabled={end === null}
              reason={end === null ? c.pickLast[k] : undefined}
              onClick={() => {
                onApply({ en: rangeIn("en"), ar: rangeIn("ar") });
                onClose();
              }}
            >
              {c.apply[k]}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
