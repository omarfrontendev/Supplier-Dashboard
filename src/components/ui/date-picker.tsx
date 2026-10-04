import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { datePickerCopy } from "@/lib/date-picker-copy";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const DAY = 86_400_000;

/** A night, held as a plain yyyy-mm-dd so nothing drifts across time zones. */
export type DayKey = string;

export interface DayRange {
  start: DayKey;
  /** null while only the first night has been picked. */
  end: DayKey | null;
}

export function keyOf(date: Date): DayKey {
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${date.getFullYear()}-${m}-${d}`;
}

export function dateOf(key: DayKey): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1);
}

function addDays(key: DayKey, days: number): DayKey {
  return keyOf(new Date(dateOf(key).getTime() + days * DAY));
}

function eachDay(range: DayRange): DayKey[] {
  const end = range.end ?? range.start;
  const out: DayKey[] = [];
  for (let key = range.start; ; key = addDays(key, 1)) {
    out.push(key);
    if (key === end) break;
    if (out.length > 400) break;
  }
  return out;
}

/** Arabic reads its own digits everywhere else in the portal. */
function num(value: string | number, ar: boolean) {
  return ar
    ? String(value).replace(/[0-9]/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]!)
    : String(value);
}

/** Sorted, so picking backwards still reads as a range. */
function ordered(a: DayKey, b: DayKey): DayRange {
  return a <= b ? { start: a, end: b } : { start: b, end: a };
}

export interface DatePickerProps {
  /** The night, or the range, the picker opens on. */
  value?: DayRange | undefined;
  onApply: (range: DayRange) => void;
  onCancel: () => void;
  /** Weekday numbers the contract sells as weekend — 0 is Sunday. */
  weekend?: number[] | undefined;
  /** Nights that already carry an unpublished change — they get the dot. */
  changed?: DayKey[] | undefined;
  /** Nights that cannot be picked at all, drawn closed. */
  locked?: DayKey[] | undefined;
  /** Nothing before this can be picked; defaults to no limit. */
  min?: DayKey | undefined;
  max?: DayKey | undefined;
  /** The season "Whole season" fills in, when the caller is inside one. */
  season?: DayRange | undefined;
  /** One night only — a second click moves the night instead of ranging. */
  single?: boolean | undefined;
  /** Fires on every pick, for callers that carry their own footer. */
  onChange?: ((range: DayRange | null) => void) | undefined;
  /** False embeds the picker in a panel that already has Cancel / Apply. */
  actions?: boolean | undefined;
  /**
   * OV 05.16D / 05.17D - what the summary says the range means. The
   * picker counts nights by default, which is right for a stay and wrong
   * for "booked on": a booking made on Sunday and again on Tuesday did
   * not last three nights, and saying so would be a small lie.
   */
  hint?: string | undefined;
  countNights?: boolean | undefined;
  /** "Use 20 - 26 Sep" reads as an edit; a filter shows. */
  actionLabel?: string | undefined;
  className?: string | undefined;
}

/**
 * Flow 12 · Row I — Supplier / Date picker. A month, the four shortcuts, a
 * summary of what is picked, the legend and the two actions.
 */
export function DatePicker({
  value,
  onApply,
  onCancel,
  weekend = [4, 5],
  changed = [],
  locked = [],
  min,
  max,
  season,
  single = false,
  onChange,
  actions = true,
  hint,
  countNights = true,
  actionLabel,
  className,
}: DatePickerProps) {
  const { lang, dir } = useLanguage();
  const ar = lang === "ar";
  const t = datePickerCopy[ar ? "ar" : "en"];
  const n = (value: string | number) => num(value, ar);
  const today = keyOf(new Date());

  const [range, setRangeState] = useState<DayRange | null>(value ?? null);
  const setRange = (next: DayRange | null) => {
    setRangeState(next);
    onChange?.(next);
  };
  const [cursor, setCursor] = useState(() =>
    dateOf(value?.start ?? min ?? today)
  );

  const changedSet = useMemo(() => new Set(changed), [changed]);
  const lockedSet = useMemo(() => new Set(locked), [locked]);
  const inRange = useMemo(
    () => (range?.end ? new Set(eachDay(range)) : new Set<DayKey>()),
    [range]
  );

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const first = new Date(year, month, 1);
  const lead = first.getDay();
  const length = new Date(year, month + 1, 0).getDate();
  const cells: Array<DayKey | null> = [
    ...Array.from({ length: lead }, () => null),
    ...Array.from({ length }, (_, i) => keyOf(new Date(year, month, i + 1))),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const closed = (key: DayKey) =>
    lockedSet.has(key) || (min ? key < min : false) || (max ? key > max : false);

  const pick = (key: DayKey) => {
    if (closed(key)) return;
    if (single || !range || range.end || key === range.start) {
      setRange({ start: key, end: null });
      return;
    }
    setRange(ordered(range.start, key));
  };

  const step = (by: number) => setCursor(new Date(year, month + by, 1));

  const shortcut = (from: DayKey, to: DayKey) => {
    setRange(ordered(from, to));
    setCursor(dateOf(from));
  };

  const weekendNames = weekend.map((d) => t.weekdays[d]).join(ar ? "، " : ", ");

  // ---- what the summary box says -------------------------------------
  const label = (() => {
    if (!range) return null;
    const a = dateOf(range.start);
    if (!range.end) {
      const kind = weekend.includes(a.getDay()) ? t.weekendNight : t.weekdayNight;
      return {
        head: `${t.daysShort[a.getDay()]} ${n(a.getDate())} ${t.monthsShort[a.getMonth()]} ${n(a.getFullYear())} · ${kind}`,
        hint:
          hint ??
          (min && min > keyOf(new Date(year, month, 1))
            ? `${t.oneHint} ${t.pastClosed}`
            : t.oneHint),
        use: `${n(a.getDate())} ${t.monthsShort[a.getMonth()]}`,
      };
    }
    const b = dateOf(range.end);
    /*
     * §0.2 - a range may straddle nights that cannot be picked at all. They
     * are taken out of the count rather than silently included, and the
     * summary says how many were dropped.
     */
    const spanned = eachDay(range);
    const days = spanned.filter((k) => !closed(k));
    const dropped = spanned.length - days.length;
    const weekendDays = days.filter((k) => weekend.includes(dateOf(k).getDay()));
    const changedDays = days.filter((k) => changedSet.has(k));
    const list = weekendDays
      .map((k) => `${t.daysShort[dateOf(k).getDay()]} ${n(dateOf(k).getDate())}`)
      .join(ar ? "، " : ", ");
    const parts = [
      t.weekdaysCount.replace("{count}", n(days.length - weekendDays.length)),
      weekendDays.length === 1
        ? t.oneWeekendNight.replace("{list}", list)
        : t.weekendNights
            .replace("{count}", n(weekendDays.length))
            .replace("{list}", list),
    ];
    if (changedDays.length) {
      parts.push(t.alreadyChanged.replace("{count}", n(changedDays.length)));
    }
    if (dropped > 0) {
      parts.push(
        dropped === 1
          ? t.oneClosedDropped
          : t.closedDropped.replace("{count}", n(dropped))
      );
    }
    const span =
      a.getMonth() === b.getMonth()
        ? `${t.daysShort[a.getDay()]} ${n(a.getDate())} - ${t.daysShort[b.getDay()]} ${n(b.getDate())} ${t.monthsShort[b.getMonth()]}`
        : `${t.daysShort[a.getDay()]} ${n(a.getDate())} ${t.monthsShort[a.getMonth()]} - ${t.daysShort[b.getDay()]} ${n(b.getDate())} ${t.monthsShort[b.getMonth()]}`;
    return {
      head: countNights
        ? `${span} · ${days.length === 1 ? t.oneNight : t.nights.replace("{count}", n(days.length))}`
        : span,
      hint: hint ?? parts.join(" · "),
      use:
        a.getMonth() === b.getMonth()
          ? `${n(a.getDate())} - ${n(b.getDate())} ${t.monthsShort[b.getMonth()]}`
          : `${n(a.getDate())} ${t.monthsShort[a.getMonth()]} - ${n(b.getDate())} ${t.monthsShort[b.getMonth()]}`,
    };
  })();

  const Prev = dir === "rtl" ? ChevronRight : ChevronLeft;
  const Next = dir === "rtl" ? ChevronLeft : ChevronRight;

  return (
    <div
      className={cn(
        "w-[393px] max-w-full space-y-3 rounded-2xl border border-border-subtle bg-surface-default p-[17px] shadow-overlay",
        className
      )}
    >
      {/* Month */}
      <div className="w-full max-w-[304px] space-y-2">
        <div className="flex h-8 items-center gap-2">
          <button
            type="button"
            aria-label={t.prev}
            onClick={() => step(-1)}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-[10px] border border-border-default text-text-secondary transition-colors hover:bg-surface-subtle"
          >
            <Prev className="h-4 w-4" aria-hidden="true" />
          </button>
          <span className="min-w-0 flex-1 text-center text-[15px] font-semibold text-text-primary">
            {t.months[month]} {n(year)}
          </span>
          <button
            type="button"
            aria-label={t.next}
            onClick={() => step(1)}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-[10px] border border-border-default text-text-secondary transition-colors hover:bg-surface-subtle"
          >
            <Next className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {t.weekdays.map((day, index) => (
            <span
              key={day}
              className={cn(
                "grid h-5 place-items-center text-[12px] leading-5",
                weekend.includes(index)
                  ? "font-semibold text-brand-deep"
                  : "text-text-muted"
              )}
            >
              {day}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {cells.map((key, index) => {
            if (!key) return <span key={`gap-${index}`} className="h-10" />;
            const date = dateOf(key);
            const picked = range?.end ? inRange.has(key) : range?.start === key;
            const edge = Boolean(range && (range.start === key || range.end === key));
            const isLocked = lockedSet.has(key);
            const isClosed = closed(key);
            return (
              <button
                key={key}
                type="button"
                disabled={isClosed}
                aria-pressed={picked}
                onClick={() => pick(key)}
                className={cn(
                  "relative grid h-10 w-full place-items-center rounded-[10px] text-[13px] font-medium transition-colors",
                  isClosed && !isLocked && "cursor-not-allowed text-[#bec6c1]",
                  isLocked &&
                    "cursor-not-allowed border border-dashed border-[#db7093] bg-[#fdecf1] text-[#b02a5a]",
                  !isClosed &&
                    !picked &&
                    (weekend.includes(date.getDay())
                      ? "text-brand-deep hover:bg-surface-subtle"
                      : "text-text-primary hover:bg-surface-subtle"),
                  picked && !edge && "rounded-[4px] bg-primary-subtle text-brand-deep",
                  edge && "bg-brand-deep font-semibold text-text-inverse",
                  !picked && key === today && "border-[1.5px] border-brand-deep"
                )}
              >
                {n(date.getDate())}
                {changedSet.has(key) && !edge && (
                  <span
                    className="absolute bottom-1 h-1 w-1 rounded-full bg-status-warning"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Shortcuts */}
      <div className="flex flex-wrap gap-1.5">
        {[
          [t.thisWeekend, () => {
            const base = new Date();
            const ahead = (weekend[0] ?? 4) - base.getDay();
            const from = keyOf(new Date(base.getTime() + ((ahead + 7) % 7) * DAY));
            shortcut(from, addDays(from, Math.max(weekend.length - 1, 0)));
          }],
          [t.next7, () => shortcut(today, addDays(today, 6))],
          [t.next30, () => shortcut(today, addDays(today, 29))],
          ...(season
            ? ([[t.wholeSeason, () => shortcut(season.start, season.end ?? season.start)]] as Array<[string, () => void]>)
            : []),
        ].map(([text, run]) => (
          <button
            key={text as string}
            type="button"
            onClick={run as () => void}
            className="h-[27px] rounded-full bg-surface-subtle px-2.5 text-[12px] font-medium text-text-primary transition-colors hover:bg-border-subtle"
          >
            {text as string}
          </button>
        ))}
      </div>

      {/* Summary */}
      <div className="rounded-[10px] bg-surface-subtle px-3 py-2.5">
        <p className="text-[13px] font-semibold leading-4 text-text-primary">
          {label ? label.head : t.pickFirst}
        </p>
        <p className="mt-0.5 text-[12px] leading-[15px] text-text-body">
          {label ? label.hint : t.oneHint}
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-text-secondary">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-brand-deep" aria-hidden="true" />
          {t.legendWeekend.replace("{days}", weekendNames)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-status-warning" aria-hidden="true" />
          {t.legendChanged}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="h-2 w-2 rounded-full border-[1.5px] border-brand-deep"
            aria-hidden="true"
          />
          {t.legendToday}
        </span>
      </div>

      {/* Actions */}
      {actions && (
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            {t.cancel}
          </Button>
          <Button disabled={!range} onClick={() => range && onApply(range)}>
            {(actionLabel ?? t.use).replace(
              "{label}",
              label ? label.use : ""
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
