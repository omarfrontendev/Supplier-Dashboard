import { useEffect, useRef, useState } from "react";
import { CalendarDays, FileText, Info, Lock } from "lucide-react";
import {
  counted,
  countedOf,
  nightsWord,
  roomsWord,
  seasonsWord,
  weekdaysWord,
  weekendNightsWord,
} from "@/lib/arabic-count";
import { Drawer, IconModal } from "@/components/layout/overlay";
import { Button } from "@/components/ui/button";
import {
  DatePicker,
  dateOf,
  type DayRange,
} from "@/components/ui/date-picker";
import { datePickerCopy } from "@/lib/date-picker-copy";
import {
  nationalityCopy,
  nationalityGroups,
} from "@/lib/nationality-price-data";
import { sellingFloor } from "@/lib/rate-overlay-data";
import { fill, useLanguage } from "@/lib/i18n";
import {
  calendarGroups,
  pricesForCopy,
  type CalendarGroupId,
} from "@/lib/nationality-calendar";
import { cn } from "@/lib/utils";
import {
  arNum,
  bulkRateRows,
  bulkLineRows,
  bulkRateStates,
  bulkRates,
  bulkRatesFixed,
  contractPicker,
  dayChips,
  pickNights,
  exportView,
  hotelPicker,
  monthPicker,
  nightStatus,
  oneNight,
  oneNightStates,
  poolBreakdown,
  rangeStates,
  releaseRange,
  reviewPublish,
  releaseRules,
  stopSale,
  stopSaleRanges,
  type Bi,
  type ReleaseRule,
  type SetRange,
} from "@/lib/rate-overlay-data";

/** The three toolbar overlays are drawn on the same 920 frame. */
const WIDE = "920px";

/** The overline above a block — 10px, uppercase, muted. */
function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-medium uppercase tracking-[0.04em] text-text-muted">
      {children}
    </p>
  );
}

/** A 16px box and its label, the checkbox the frames draw everywhere. */
function Check({
  checked,
  onChange,
  label,
  note,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  note?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-[7px]">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mt-px h-4 w-4 shrink-0 rounded accent-[var(--brand-deep)]"
      />
      <span className="min-w-0">
        <span className="block text-[12.5px] leading-4 text-text-primary">
          {label}
        </span>
        {note && (
          <span className="mt-1 block text-[11.5px] leading-4 text-text-muted">
            {note}
          </span>
        )}
      </span>
    </label>
  );
}

/** A bordered card the rows of a list sit inside. */
function Panel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string | undefined;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[12px] border border-border-subtle",
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * OV 04.6H — a band that says what the picked nights already carry.
 * Amber where saving will overwrite something, grey where it will not.
 */
function Band({
  tone = "quiet",
  children,
}: {
  tone?: "warning" | "quiet";
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "mt-3.5 rounded-xl p-3.5 text-[12px] leading-5",
        tone === "warning"
          ? "bg-[#fdf0d9] text-[#8a5a00] [&_b]:block [&_b]:font-semibold"
          : "bg-surface-subtle text-text-body [&_b]:block [&_b]:font-semibold [&_b]:text-text-primary"
      )}
    >
      {children}
    </div>
  );
}

/** One line of a Panel; the head row is tinted, the rest are ruled. */
function PanelRow({
  head = false,
  tint = false,
  children,
}: {
  head?: boolean;
  tint?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3 px-3.5",
        head ? "bg-surface-subtle py-2.5" : "border-t border-border-subtle py-2",
        !head && tint && "bg-surface-subtle/60"
      )}
    >
      {children}
    </div>
  );
}

/** A 150-wide box — the date and price field the frames draw. */
function Box({
  value,
  onChange,
  onEnter,
  placeholder,
  icon,
  suffix,
  className,
  readOnly = false,
  invalid = false,
}: {
  value?: string;
  onChange?: (next: string) => void;
  onEnter?: () => void;
  placeholder?: string;
  icon?: boolean;
  /** OV 04.5E — a per-person supplement names its unit inside the box. */
  suffix?: string | undefined;
  className?: string;
  readOnly?: boolean;
  /** OV 04.1V — a box that has to be filled before saving reads in red. */
  invalid?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex h-[38px] w-[150px] shrink-0 items-center gap-2 rounded-[10px] border bg-surface-default px-3",
        invalid ? "border-status-danger" : "border-border-default",
        !readOnly && "focus-within:border-brand-deep",
        className
      )}
    >
      <input
        value={value ?? ""}
        readOnly={readOnly}
        onChange={(event) => onChange?.(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") onEnter?.();
        }}
        placeholder={placeholder ?? ""}
        className="min-w-0 flex-1 bg-transparent text-[12.5px] font-medium text-text-primary outline-none placeholder:font-normal placeholder:text-text-muted"
      />
      {suffix && (
        <span className="shrink-0 text-[11px] text-text-muted">{suffix}</span>
      )}
      {icon && (
        <CalendarDays
          className="h-3.5 w-3.5 shrink-0 text-text-muted"
          aria-hidden="true"
        />
      )}
    </div>
  );
}

/** A small sentence-case label over a field. */
function FieldLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-1 text-[11px] leading-4 text-text-muted">{children}</p>;
}

/**
 * The tinted row every range is picked on: From, to, To, the seven day
 * boxes, and the Add button that stays off until a range is chosen.
 */
function DateRow({
  copy,
  days,
  onToggleDay,
  from,
  to,
  onFrom,
  onTo,
  onAdd,
  blocked = false,
  k,
}: {
  copy: { from: string; to: string; to2: string; add: string };
  days: number[];
  onToggleDay: (index: number) => void;
  from: string;
  to: string;
  onFrom: (next: string) => void;
  onTo: (next: string) => void;
  onAdd: () => void;
  /** OV 04.1O — a range that overlaps one already added cannot be added. */
  blocked?: boolean;
  k: "en" | "ar";
}) {
  const ready = Boolean(from && to && days.length) && !blocked;
  const [picking, setPicking] = useState(false);
  const holder = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!picking) return;
    const away = (event: MouseEvent) => {
      if (!holder.current?.contains(event.target as Node)) setPicking(false);
    };
    document.addEventListener("mousedown", away);
    return () => document.removeEventListener("mousedown", away);
  }, [picking]);

  const shown = from && to ? `${short(from)} - ${short(to)}` : short(from);

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-[12px] bg-surface-subtle px-3 py-2.5">
      {/* Flow 12 · Row J — one field for the nights, not a From and a To. */}
      <div className="relative min-w-[190px] flex-1 sm:max-w-[318px]" ref={holder}>
        <button
          type="button"
          onClick={() => setPicking((prev) => !prev)}
          className={cn(
            "flex h-11 w-full items-center gap-2 rounded-[10px] border bg-surface-default px-3.5 text-start transition-colors",
            blocked
              ? "border-status-danger"
              : "border-border-default hover:border-border-strong"
          )}
        >
          <span
            className={cn(
              "min-w-0 flex-1 truncate text-sm",
              shown ? "text-text-primary" : "text-text-muted"
            )}
          >
            {shown || pickNights[k]}
          </span>
          <CalendarDays
            className="h-4 w-4 shrink-0 text-text-muted"
            aria-hidden="true"
          />
        </button>
        {picking && (
          <div className="absolute z-50 mt-2 w-[393px] max-w-[calc(100vw-6.5rem)] start-0">
            <DatePicker
              className="w-full"
              onCancel={() => setPicking(false)}
              onApply={(range) => {
                onFrom(longDate(range.start));
                onTo(longDate(range.end ?? range.start));
                setPicking(false);
              }}
            />
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {dayChips.map((day, index) => (
          <button
            key={day.en}
            type="button"
            aria-pressed={days.includes(index)}
            onClick={() => onToggleDay(index)}
            className={cn(
              "h-9 w-11 rounded-[10px] border text-[13px] font-medium transition-colors",
              days.includes(index)
                ? "border-brand-deep bg-brand-deep text-text-inverse"
                : "border-border-default bg-surface-default text-text-primary hover:bg-surface-subtle"
            )}
          >
            {day[k]}
          </button>
        ))}
      </div>

      <button
        type="button"
        disabled={!ready}
        onClick={onAdd}
        className={cn(
          "ms-auto h-9 rounded-[10px] px-4 text-[13px] font-medium transition-colors",
          ready
            ? "bg-brand-deep text-text-inverse hover:brightness-110"
            : "cursor-not-allowed bg-border-default text-text-muted"
        )}
      >
        {copy.add}
      </button>
    </div>
  );
}

/** "24 Sep 2026" → "24 Sep", for the one field that shows both ends. */
function short(value: string) {
  return value.replace(/\s+\d{4}$/, "");
}

/** The picker speaks yyyy-mm-dd; the overlays speak "24 Sep 2026". */
function longDate(key: string) {
  const date = dateOf(key);
  return `${date.getDate()} ${MONTHS_EN[date.getMonth()]} ${date.getFullYear()}`;
}

/** The ranges added so far, or the line that says none have been. */
function AddedRanges({
  ranges,
  onRemove,
  empty,
  remove,
}: {
  ranges: string[];
  onRemove: (index: number) => void;
  empty: string;
  remove: string;
}) {
  if (ranges.length === 0) {
    return (
      <div className="rounded-[12px] border border-border-subtle px-3.5 py-3">
        <p className="text-[12px] leading-4 text-text-muted">{empty}</p>
      </div>
    );
  }
  return (
    <Panel>
      {ranges.map((range, index) => (
        <div
          key={`${range}-${index}`}
          className="flex items-center justify-between gap-3 px-3.5 py-2.5 [&:not(:first-child)]:border-t [&:not(:first-child)]:border-border-subtle"
        >
          <span className="text-[12.5px] font-medium text-text-primary">
            {range}
          </span>
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="text-[12.5px] font-medium text-status-danger hover:underline"
          >
            {remove}
          </button>
        </div>
      ))}
    </Panel>
  );
}

/** The ten room boxes, three to a row, the way the frames lay them out. */
function RoomGrid({
  allLabel,
  rows = bulkRateRows.map((row) => row.room),
  rooms,
  onToggle,
  onToggleAll,
  k,
}: {
  allLabel: string;
  /** The rooms a contract sells, or the lines a fixed-price one prices. */
  rows?: Bi[];
  rooms: number[];
  onToggle: (index: number) => void;
  onToggleAll: () => void;
  k: "en" | "ar";
}) {
  return (
    <div className="grid gap-x-4 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-3">
      <Check
        checked={rooms.length === rows.length}
        onChange={onToggleAll}
        label={allLabel}
      />
      {rows.map((row, index) => (
        <Check
          key={row.en}
          checked={rooms.includes(index)}
          onChange={() => onToggle(index)}
          label={row[k]}
        />
      ))}
    </div>
  );
}

/** Cancel on one side of the foot, the commit on the other. */
function Actions({
  children,
  lead,
}: {
  children: React.ReactNode;
  lead?: React.ReactNode;
}) {
  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-3">{lead}</div>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

/** The months the From and To boxes are typed and printed in. */
const MONTHS_EN = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
const MONTHS_AR = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];
const DAY_SHORT_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_SHORT_AR = ["أحد", "إثن", "ثلا", "أرب", "خمي", "جمع", "سبت"];

/** Thursday and Friday carry the weekend price. */
const WEEKEND = [4, 5];
const DAY = 86400000;

export interface DateRange {
  start: number;
  end: number;
  nights: number;
}

/** "24 Sep 2026" — the shape the From and To boxes take. */
function parseDay(value: string) {
  const match = /^\s*(\d{1,2})\s+([A-Za-z]{3})[a-z]*\s+(\d{4})\s*$/.exec(value);
  if (!match) return null;
  const month = MONTHS_EN.findIndex(
    (name) => name.toLowerCase() === match[2]!.toLowerCase()
  );
  if (month < 0) return null;
  return Date.UTC(Number(match[3]), month, Number(match[1]));
}

function parseRange(from: string, to: string): DateRange | null {
  const start = parseDay(from);
  const end = parseDay(to);
  if (start === null || end === null || end < start) return null;
  return { start, end, nights: Math.round((end - start) / DAY) + 1 };
}

/** A thousands separator, in the digits the language reads. */
function group(value: number, k: "en" | "ar") {
  const text = value.toLocaleString("en-US");
  return k === "ar" ? arNum(text).replace(/,/g, "٬") : text;
}

const dayOf = (stamp: number) => new Date(stamp).getUTCDate();
const monthOf = (stamp: number, k: "en" | "ar") =>
  (k === "ar" ? MONTHS_AR : MONTHS_EN)[new Date(stamp).getUTCMonth()] ?? "";

/** OV 04.1B — "24 - 30 Sep 2026", or without the year inside a sentence. */
function labelOf(range: DateRange, k: "en" | "ar", short = false) {
  const year = new Date(range.end).getUTCFullYear();
  const tail = short ? "" : ` ${k === "ar" ? arNum(year) : year}`;
  /** A dated range pads its days to two; a range inside a sentence does not. */
  const day = (stamp: number) => {
    const text = short
      ? String(dayOf(stamp))
      : String(dayOf(stamp)).padStart(2, "0");
    return k === "ar" ? arNum(text) : text;
  };
  const from = day(range.start);
  const to = day(range.end);
  return monthOf(range.start, k) === monthOf(range.end, k)
    ? `${from} - ${to} ${monthOf(range.end, k)}${tail}`
    : `${from} ${monthOf(range.start, k)} - ${to} ${monthOf(range.end, k)}${tail}`;
}

/** OV 04.1B — what the range covers, split into weekdays and weekend. */
function metaOf(range: DateRange, days: number[], k: "en" | "ar") {
  const nights: number[] = [];
  for (let stamp = range.start; stamp <= range.end; stamp += DAY) {
    nights.push(stamp);
  }
  // Both dayChips and getUTCDay run Sunday first, so the index is the day.
  const chosen = nights.filter((stamp) =>
    days.includes(new Date(stamp).getUTCDay())
  );
  const weekend = chosen.filter((stamp) =>
    WEEKEND.includes(new Date(stamp).getUTCDay())
  );
  const names = weekend
    .map(
      (stamp) =>
        `${(k === "ar" ? DAY_SHORT_AR : DAY_SHORT_EN)[new Date(stamp).getUTCDay()]} ${
          k === "ar" ? arNum(dayOf(stamp)) : dayOf(stamp)
        }`
    )
    .join(", ");
  return fill(bulkRateStates.rangeMeta[k], {
    nights: k === "ar" ? arNum(chosen.length) : chosen.length,
    weekdays:
      k === "ar"
        ? arNum(chosen.length - weekend.length)
        : chosen.length - weekend.length,
    weekend: k === "ar" ? arNum(weekend.length) : weekend.length,
    days: names,
  });
}

/**
 * OV 04.2B / 04.3B — what a range covers where the weekend price does
 * not matter: every day of it, or only the days that were picked.
 */
function plainMetaOf(range: DateRange, days: number[], k: "en" | "ar") {
  const nights: number[] = [];
  for (let stamp = range.start; stamp <= range.end; stamp += DAY) {
    nights.push(stamp);
  }
  const chosen = nights.filter((stamp) =>
    days.includes((new Date(stamp).getUTCDay() + 1) % 7)
  );
  const count = k === "ar" ? arNum(chosen.length) : chosen.length;
  if (days.length === 7) {
    return fill(rangeStates.everyDay[k], { nights: count });
  }
  return fill(rangeStates.someDays[k], {
    nights: count,
    days: days
      .slice()
      .sort((a, b) => a - b)
      .map((index) => dayChips[index]?.[k] ?? "")
      .join(", "),
  });
}

/** OV 04.5E — a supplement's number, without the unit that follows it. */
const bare = (value: string) =>
  value.replace(/\s*(per person|لكل شخص)$/, "");

/** Toggling one item of a list of indices. */
const flip = (list: number[], index: number) =>
  list.includes(index) ? list.filter((item) => item !== index) : [...list, index];

/**
 * OV 04.1A — the room price for many nights at once. The base room sets
 * the number; every other room reads as what it adds on top of it.
 */
export function BulkRatesOverlay({
  fixed = false,
  onClose,
}: {
  /** OV 04.1AF — a fixed-price contract prices whole lines. */
  fixed?: boolean;
  onClose: () => void;
}) {
  const { lang } = useLanguage();
  const k = lang === "ar" ? "ar" : "en";
  const c = bulkRates;
  const x = bulkRatesFixed;
  const s = bulkRateStates;
  /** One entry per priced row: a room off the base, or a whole line. */
  const list = fixed
    ? bulkLineRows.map((row) => ({ name: row.line, meta: row.meta }))
    : bulkRateRows.map((row) => ({
        name: row.room,
        meta: null as Bi | null,
      }));
  const [rooms, setRooms] = useState<number[]>(list.map((_, index) => index));
  const [days, setDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [ranges, setRanges] = useState<DateRange[]>([]);
  const [allWeekday, setAllWeekday] = useState("");
  const [allWeekend, setAllWeekend] = useState("");
  const [typing, setTyping] = useState(false);
  const [prices, setPrices] = useState<Array<[string, string]>>(
    list.map(() => ["", ""])
  );
  const [follow, setFollow] = useState(false);
  const [showFix, setShowFix] = useState(false);

  const base = prices[0] ?? ["", ""];
  /** OV 04.1B — every other room reads off the base while it follows it. */
  const cellFor = (index: number, side: 0 | 1) => {
    if (fixed || index === 0 || !follow) return prices[index]?.[side] ?? "";
    const root = Number((base[side] ?? "").replace(/[^0-9]/g, ""));
    if (!root) return "";
    return group(root + (bulkRateRows[index]?.supplement ?? 0), k);
  };

  /** OV 04.1O — a new range may not sit on top of one already added. */
  const pending = parseRange(from, to);
  const clash = pending
    ? ranges.find(
        (range) => pending.start <= range.end && range.start <= pending.end
      )
    : undefined;

  const nights = ranges.reduce((sum, range) => sum + range.nights, 0);
  const priced =
    prices.some(
      ([a, b], index) => (fixed || index === 0 || !follow) && Boolean(a || b)
    ) || Boolean(allWeekday || allWeekend);
  const total = rooms.length * nights;
  const ready = ranges.length > 0 && priced;

  const fillAll = () => {
    if (!allWeekday && !allWeekend) return;
    setPrices((prev) =>
      prev.map(
        ([a, b]) => [allWeekday || a, allWeekend || b] as [string, string]
      )
    );
    setAllWeekday("");
    setAllWeekend("");
    setTyping(false);
  };

  return (
    <IconModal
      width={WIDE}
      overline={fixed ? x.overline[k] : c.overline[k]}
      title={c.title[k]}
      body={fixed ? x.body[k] : c.body[k]}
      onClose={onClose}
      footer={
        <Actions
          lead={
            <Button variant="outline" onClick={onClose}>
              {c.cancel[k]}
            </Button>
          }
        >
          <Button disabled={!ready} onClick={onClose}>
            {total > 0
              ? fill(s.saveCount[k], {
                  count: k === "ar" ? arNum(total) : total,
                })
              : c.save[k]}
          </Button>
        </Actions>
      }
    >
      {showFix && !ready && <Alarm>{s.fixTitle[k]}</Alarm>}

      <Label>{fixed ? x.linesTitle[k] : c.roomsTitle[k]}</Label>
      <RoomGrid
        rows={list.map((row) => row.name)}
        allLabel={fixed ? x.allLines[k] : c.allRooms[k]}
        rooms={rooms}
        onToggle={(index) => {
          setRooms((prev) => flip(prev, index));
          setShowFix(true);
        }}
        onToggleAll={() => {
          setRooms(
            rooms.length === list.length ? [] : list.map((_, index) => index)
          );
          setShowFix(true);
        }}
        k={k}
      />

      <Label>{c.datesTitle[k]}</Label>
      <div className="space-y-2">
        <DateRow
          copy={{ from: c.from[k], to: c.to[k], to2: c.to2[k], add: c.add[k] }}
          days={days}
          onToggleDay={(index) => {
            setDays((prev) => flip(prev, index));
            setShowFix(true);
          }}
          from={from}
          to={to}
          onFrom={(next) => {
            setFrom(next);
            setShowFix(true);
          }}
          onTo={(next) => {
            setTo(next);
            setShowFix(true);
          }}
          blocked={Boolean(clash)}
          onAdd={() => {
            const range = parseRange(from, to);
            if (!range) return;
            setRanges((prev) => [...prev, range]);
            setFrom("");
            setTo("");
          }}
          k={k}
        />
        {clash && pending && (
          <Alarm
            action={
              <button
                type="button"
                onClick={() => {
                  setFrom("");
                  setTo("");
                }}
                className="shrink-0 text-[12px] font-semibold text-status-danger underline"
              >
                {s.pickOther[k]}
              </button>
            }
          >
            {fill(s.overlap[k], {
              range: labelOf(pending, k, true),
              added: labelOf(clash, k, true),
            })}
          </Alarm>
        )}
        {showFix && ranges.length === 0 && <Alarm>{s.fixDates[k]}</Alarm>}
        {ranges.length === 0 ? (
          <div className="rounded-[12px] border border-border-subtle px-3.5 py-3">
            <p className="text-[12px] leading-4 text-text-muted">
              {c.noDates[k]}
            </p>
          </div>
        ) : (
          <Panel>
            {ranges.map((range, index) => (
              <div
                key={`${range.start}-${index}`}
                className="flex flex-wrap items-center gap-3 px-3.5 py-2.5 [&:not(:first-child)]:border-t [&:not(:first-child)]:border-border-subtle"
              >
                <Lock
                  className="h-3.5 w-3.5 shrink-0 text-status-warning"
                  aria-hidden="true"
                />
                <span className="text-[12.5px] font-semibold text-text-primary">
                  {labelOf(range, k)}
                </span>
                <span className="min-w-0 flex-1 text-[11.5px] text-text-muted">
                  {metaOf(range, days, k)}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setRanges((prev) => prev.filter((_, item) => item !== index))
                  }
                  className="text-[12.5px] font-medium text-status-danger hover:underline"
                >
                  {c.removeRange[k]}
                </button>
              </div>
            ))}
          </Panel>
        )}
      </div>

      <Label>{c.priceTitle[k]}</Label>
      <Panel>
        <PanelRow head>
          <span className="min-w-0 flex-1 text-[10px] text-text-muted">
            {fixed ? x.colLine[k] : c.colRoom[k]}
          </span>
          <span className="w-[150px] shrink-0 text-[10px] text-text-muted">
            {c.colWeekday[k]}
          </span>
          <span className="w-[150px] shrink-0 text-[10px] text-text-muted">
            {c.colWeekend[k]}
          </span>
        </PanelRow>

        <PanelRow tint>
          <span className="min-w-0 flex-1">
            <span className="block text-[12.5px] font-medium text-text-primary">
              {fixed ? x.allSelectedLines[k] : c.allSelectedRooms[k]}
            </span>
            <span className="mt-px block text-[11px] text-text-muted">
              {typing
                ? fill(s.typingHint[k], {
                    count: k === "ar" ? arNum(rooms.length) : rooms.length,
                  })
                : fixed
                  ? x.fillsEveryLine[k]
                  : c.fillsEvery[k]}
            </span>
          </span>
          <Box
            value={allWeekday}
            onChange={(next) => {
              setAllWeekday(next);
              setTyping(true);
            }}
            onEnter={fillAll}
            placeholder={c.samePrice[k]}
            invalid={showFix && !priced}
          />
          <Box
            value={allWeekend}
            onChange={(next) => {
              setAllWeekend(next);
              setTyping(true);
            }}
            onEnter={fillAll}
            placeholder={c.samePrice[k]}
            invalid={showFix && !priced}
          />
        </PanelRow>

        {list.map((row, index) => (
          <PanelRow key={row.name.en}>
            <span
              className={cn(
                "min-w-0 flex-1",
                !rooms.includes(index) && "opacity-45"
              )}
            >
              <span className="block text-[12.5px] text-text-primary">
                {row.name[k]}
              </span>
              <span className="mt-px block text-[11px] text-text-muted">
                {row.meta
                  ? row.meta[k]
                  : (bulkRateRows[index]?.supplement ?? 0) === 0
                    ? c.baseRoom[k]
                    : fill(follow ? s.followsBase[k] : c.supplementRow[k], {
                        amount:
                          k === "ar"
                            ? arNum(bulkRateRows[index]!.supplement)
                            : bulkRateRows[index]!.supplement,
                      })}
              </span>
            </span>
            {([0, 1] as const).map((side) => (
              <Box
                key={side}
                value={cellFor(index, side)}
                onChange={(next) =>
                  setPrices((prev) =>
                    prev.map((pair, item) =>
                      item === index
                        ? side === 0
                          ? [next, pair[1]]
                          : [pair[0], next]
                        : pair
                    )
                  )
                }
                readOnly={!rooms.includes(index) || (index > 0 && follow)}
                invalid={showFix && !priced}
              />
            ))}
          </PanelRow>
        ))}
      </Panel>

      {showFix && !priced && (
        <p className="text-[12px] leading-4 text-status-danger">
          {s.fixPrice[k]}
        </p>
      )}

      {/* A fixed-price line has no base to follow. */}
      {!fixed && (
        <Check
          checked={follow}
          onChange={() => setFollow(!follow)}
          label={c.footNote[k]}
        />
      )}

      {ready && (
        <p className="rounded-[10px] bg-status-success-bg px-3.5 py-3 text-[12px] leading-4 text-status-success">
          {fill(fixed ? x.summary[k] : s.summary[k], {
            lines: k === "ar" ? arNum(rooms.length) : rooms.length,
            rooms: k === "ar" ? arNum(rooms.length) : rooms.length,
            nights: k === "ar" ? arNum(nights) : nights,
            range: ranges.map((range) => labelOf(range, k, true)).join(", "),
            total: k === "ar" ? arNum(total) : total,
          })}
        </p>
      )}
    </IconModal>
  );
}

/** OV 04.1V / 04.1O — a line in red, with an optional way out of it. */
function Alarm({
  children,
  action,
}: {
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-[10px] bg-status-danger-bg px-3.5 py-2.5">
      <p className="min-w-0 flex-1 text-[12px] leading-4 text-status-danger">
        {children}
      </p>
      {action}
    </div>
  );
}

/** OV 04.3K — a release may not reach further back than a month. */
const RELEASE_MAX = 30;

/** "18 - 19 Sep 2026" as it sits in the data, read back as a span. */
function rangeOf(label: string) {
  const match = /^(\d{1,2})\s*-\s*(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})$/.exec(
    label.trim()
  );
  if (!match) return null;
  return parseRange(
    `${match[1]} ${match[3]} ${match[4]}`,
    `${match[2]} ${match[3]} ${match[4]}`
  );
}

const overlaps = (a: DateRange, b: DateRange) =>
  a.start <= b.end && b.start <= a.end;

/** OV 04.2D / 04.3D / 04.2O — a line the overlay answers back with. */
function Notice({
  children,
  action,
  tone = "info",
}: {
  children: React.ReactNode;
  action?: React.ReactNode;
  tone?: "info" | "warning";
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3 rounded-[10px] px-3.5 py-2.5",
        tone === "warning" ? "bg-notice" : "bg-surface-subtle"
      )}
    >
      <p
        className={cn(
          "min-w-0 flex-1 text-[12px] leading-4",
          tone === "warning" ? "text-status-warning" : "text-text-body"
        )}
      >
        {children}
      </p>
      {action}
    </div>
  );
}

/** OV 04.1B / 04.2B / 04.3B — the ranges added, each locked and removable. */
function LockedRanges({
  ranges,
  days,
  onRemove,
  empty,
  remove,
  k,
}: {
  ranges: DateRange[];
  days: number[];
  onRemove: (index: number) => void;
  empty: string;
  remove: string;
  k: "en" | "ar";
}) {
  if (ranges.length === 0) {
    return (
      <div className="rounded-[12px] border border-border-subtle px-3.5 py-3">
        <p className="text-[12px] leading-4 text-text-muted">{empty}</p>
      </div>
    );
  }
  return (
    <Panel>
      {ranges.map((range, index) => (
        <div
          key={`${range.start}-${index}`}
          className="flex flex-wrap items-center gap-3 px-3.5 py-2.5 [&:not(:first-child)]:border-t [&:not(:first-child)]:border-border-subtle"
        >
          <Lock
            className="h-3.5 w-3.5 shrink-0 text-status-warning"
            aria-hidden="true"
          />
          <span className="text-[12.5px] font-semibold text-text-primary">
            {labelOf(range, k)}
          </span>
          <span className="min-w-0 flex-1 text-[11.5px] text-text-muted">
            {plainMetaOf(range, days, k)}
          </span>
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="text-[12.5px] font-medium text-status-danger hover:underline"
          >
            {remove}
          </button>
        </div>
      ))}
    </Panel>
  );
}


/**
 * OV 04.2 — closing nights and opening them again, for many dates and
 * rooms, and optionally for every contract the hotel holds.
 */
export function StopSaleOverlay({ onClose }: { onClose: () => void }) {
  const { lang } = useLanguage();
  const k = lang === "ar" ? "ar" : "en";
  const c = stopSale;
  const s = rangeStates;
  const [already, setAlready] = useState(stopSaleRanges);
  const [removed, setRemoved] = useState<SetRange | null>(null);
  const [rooms, setRooms] = useState<number[]>([]);
  const [days, setDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [ranges, setRanges] = useState<DateRange[]>([]);
  const [state, setState] = useState("stop");
  const [everyContract, setEveryContract] = useState(false);
  const ready = ranges.length > 0 && rooms.length > 0;

  /** OV 04.2B — the flag says which rooms it will close, once they are picked. */
  const roomNames =
    rooms.length === 1
      ? bulkRateRows[rooms[0]!]?.room[k] ?? ""
      : fill(s.roomsPicked[k], {
          count: k === "ar" ? arNum(rooms.length) : rooms.length,
        });

  /** OV 04.2O — a stop sale laid over nights the hotel already holds. */
  const pending = parseRange(from, to);
  const held = already.find((range) => range.state === "request");
  const clash =
    state === "stop" && pending && held && rangeOf(held.dates.en)
      ? overlaps(pending, rangeOf(held.dates.en)!)
      : false;

  return (
    <IconModal
      width={WIDE}
      overline={c.overline[k]}
      title={c.title[k]}
      body={c.body[k]}
      onClose={onClose}
      footer={
        <Actions
          lead={
            <Button variant="outline" onClick={onClose}>
              {c.cancel[k]}
            </Button>
          }
        >
          <Button disabled={!ready} onClick={onClose}>
            {c.save[k]}
          </Button>
        </Actions>
      }
    >
      <Label>{c.alreadySet[k]}</Label>
      <Panel>
        {already.map((range, index) => (
          <div
            key={range.dates.en}
            className="flex flex-wrap items-center gap-3 px-3.5 py-2.5 [&:not(:first-child)]:border-t [&:not(:first-child)]:border-border-subtle"
          >
            <span className="w-[150px] shrink-0 text-[12.5px] font-semibold text-text-primary">
              {range.dates[k]}
            </span>
            <span className="min-w-0 flex-1 text-[12.5px] text-text-primary">
              {range.rooms[k]}
            </span>
            <span
              className={cn(
                "text-[12.5px] font-medium",
                range.state === "stop"
                  ? "text-status-danger"
                  : range.state === "request"
                    ? "text-status-warning"
                    : "text-status-success"
              )}
            >
              {range.state === "stop"
                ? c.stop[k]
                : range.state === "request"
                  ? c.requestShort[k]
                  : c.open[k]}
            </span>
            <button
              type="button"
              onClick={() => {
                setRemoved(range);
                setAlready((prev) => prev.filter((_, item) => item !== index));
              }}
              className="text-[12.5px] font-medium text-status-danger hover:underline"
            >
              {c.delete[k]}
            </button>
          </div>
        ))}
      </Panel>

      {/* OV 04.2D — what was taken off, and the way back to it. */}
      {removed && (
        <Notice
          action={
            <button
              type="button"
              onClick={() => {
                setAlready((prev) => [removed, ...prev]);
                setRemoved(null);
              }}
              className="shrink-0 text-[12px] font-semibold text-text-primary underline"
            >
              {s.undo[k]}
            </button>
          }
        >
          {fill(s.stopRemoved[k], {
            rooms: removed.rooms[k],
            range: removed.dates[k].replace(/\s*\d{4}$/, ""),
          })}
        </Notice>
      )}

      <Label>{c.addTitle[k]}</Label>
      <Label>{c.datesTitle[k]}</Label>
      <div className="space-y-2">
        <DateRow
          copy={{
            from: c.from[k],
            to: c.to[k],
            to2: bulkRates.to2[k],
            add: bulkRates.add[k],
          }}
          days={days}
          onToggleDay={(index) => setDays((prev) => flip(prev, index))}
          from={from}
          to={to}
          onFrom={setFrom}
          onTo={setTo}
          onAdd={() => {
            const range = parseRange(from, to);
            if (!range) return;
            setRanges((prev) => [...prev, range]);
            setFrom("");
            setTo("");
          }}
          k={k}
        />
        {clash && pending && held && (
          <Notice tone="warning">
            {fill(s.stopOverlap[k], {
              room: held.rooms[k],
              range: held.dates[k].replace(/\s*\d{4}$/, ""),
              span: labelOf(pending, k, true),
            })}
          </Notice>
        )}
        <LockedRanges
          ranges={ranges}
          days={days}
          onRemove={(index) =>
            setRanges((prev) => prev.filter((_, item) => item !== index))
          }
          empty={bulkRates.noDates[k]}
          remove={bulkRates.removeRange[k]}
          k={k}
        />
      </div>

      <Label>{c.roomsTitle[k]}</Label>
      <RoomGrid
        allLabel={c.allRooms[k]}
        rooms={rooms}
        onToggle={(index) => setRooms((prev) => flip(prev, index))}
        onToggleAll={() =>
          setRooms(
            rooms.length === bulkRateRows.length
              ? []
              : bulkRateRows.map((_, index) => index)
          )
        }
        k={k}
      />

      <Label>{c.setTo[k]}</Label>
      <div className="flex flex-wrap items-center gap-x-7 gap-y-2">
        {(
          [
            ["stop", c.stop[k]],
            ["open", c.open[k]],
            ["request", c.request[k]],
          ] as Array<[string, string]>
        ).map(([key, label]) => (
          <label key={key} className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="stop-sale-state"
              checked={state === key}
              onChange={() => setState(key)}
              className="h-4 w-4 accent-[var(--brand-deep)]"
            />
            <span className="text-[12.5px] text-text-primary">{label}</span>
          </label>
        ))}
      </div>

      <div className="rounded-[12px] bg-surface-subtle px-3.5 py-3">
        <Check
          checked={everyContract}
          onChange={() => setEveryContract(!everyContract)}
          label={c.everyContract[k]}
          note={
            everyContract && rooms.length
              ? fill(s.everyContractDone[k], { rooms: roomNames })
              : c.everyContractNote[k]
          }
        />
      </div>
    </IconModal>
  );
}

/**
 * OV 04.3 — when unsold rooms go back. The contract's own rule is read
 * here and edited over in the contract; anything else is a change.
 */
export function ReleaseRangeOverlay({
  onClose,
  onEditContract,
}: {
  onClose: () => void;
  onEditContract?: (() => void) | undefined;
}) {
  const { lang } = useLanguage();
  const k = lang === "ar" ? "ar" : "en";
  const c = releaseRange;
  const s = rangeStates;
  const [rules, setRules] = useState(releaseRules);
  const [removed, setRemoved] = useState<ReleaseRule | null>(null);
  const [editing, setEditing] = useState<ReleaseRule | null>(null);
  const [rooms, setRooms] = useState<number[]>([]);
  const [days, setDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [ranges, setRanges] = useState<DateRange[]>([]);
  const [mode, setMode] = useState("days");
  const [daysBefore, setDaysBefore] = useState("");
  const [at, setAt] = useState("18:00");

  const contractRule = rules.find((rule) => rule.fromContract);
  const typed = Number(daysBefore.replace(/[^0-9]/g, ""));
  /** OV 04.3K — rooms may not go back more than a month before arrival. */
  const tooMany = mode === "days" && typed > RELEASE_MAX;

  /** OV 04.3O — a change laid over a change; the newest one wins. */
  const pending = parseRange(from, to);
  const changed = rules.find((rule) => rule.changed);
  const clash =
    pending && changed && rangeOf(changed.dates.en)
      ? overlaps(pending, rangeOf(changed.dates.en)!)
      : false;

  const ready =
    (ranges.length > 0 || editing !== null) &&
    (rooms.length > 0 || editing !== null) &&
    !tooMany &&
    (mode === "same" || typed > 0);

  const body =
    mode === "same"
      ? `${fill(s.sameDayNote[k], { at })}\n${c.body[k]}`
      : c.body[k];

  return (
    <IconModal
      width={WIDE}
      overline={c.overline[k]}
      title={c.title[k]}
      body={tooMany ? undefined : body}
      onClose={onClose}
      footer={
        <Actions
          lead={
            <Button variant="outline" onClick={onClose}>
              {c.cancel[k]}
            </Button>
          }
        >
          <Button disabled={!ready} onClick={onClose}>
            {c.save[k]}
          </Button>
        </Actions>
      }
    >
      {/* OV 04.3K — the ceiling, and the number that clears it. */}
      {tooMany && (
        <div className="-mt-2">
          <p className="text-[12.5px] leading-5 text-status-danger">
            {fill(s.tooManyDays[k], {
              max: k === "ar" ? arNum(RELEASE_MAX) : RELEASE_MAX,
            })}
          </p>
          <button
            type="button"
            onClick={() => setDaysBefore(String(RELEASE_MAX))}
            className="text-[12.5px] font-medium text-text-primary underline"
          >
            {fill(s.useMax[k], {
              max: k === "ar" ? arNum(RELEASE_MAX) : RELEASE_MAX,
            })}
          </button>
          <p className="text-[13px] leading-5 text-text-secondary">{body}</p>
        </div>
      )}

      <Label>{c.inForce[k]}</Label>
      <Panel>
        {rules.map((rule, index) => (
          <div
            key={rule.dates.en}
            className="flex flex-wrap items-center gap-3 px-3.5 py-2.5 [&:not(:first-child)]:border-t [&:not(:first-child)]:border-border-subtle"
          >
            <span className="w-[150px] shrink-0 text-[12.5px] font-semibold text-text-primary">
              {rule.dates[k]}
            </span>
            <span className="min-w-0 flex-1 text-[12.5px] text-text-primary">
              {rule.rooms[k]}
            </span>
            <span
              className={cn(
                "text-[12.5px] font-semibold",
                rule.changed ? "text-status-warning" : "text-text-primary"
              )}
            >
              {rule.rule[k]}
            </span>
            <span className="text-[12px] text-text-muted">{rule.source[k]}</span>
            {rule.fromContract ? (
              <button
                type="button"
                onClick={onEditContract}
                className="text-[12.5px] font-medium text-text-primary hover:underline"
              >
                {c.editInContract[k]}
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    const span = rangeOf(rule.dates.en);
                    setEditing(rule);
                    setMode("days");
                    setDaysBefore(
                      String(Number(rule.rule.en.replace(/[^0-9].*$/, "")) || 1)
                    );
                    setRanges(span ? [span] : []);
                    setRooms(
                      bulkRateRows
                        .map((row, item) =>
                          row.room.en === rule.rooms.en ? item : -1
                        )
                        .filter((item) => item >= 0)
                    );
                  }}
                  className="text-[12.5px] font-medium text-text-primary hover:underline"
                >
                  {c.edit[k]}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRemoved(rule);
                    setRules((prev) => prev.filter((_, item) => item !== index));
                  }}
                  className="text-[12.5px] font-medium text-status-danger hover:underline"
                >
                  {c.delete[k]}
                </button>
              </>
            )}
          </div>
        ))}
      </Panel>

      {/* OV 04.3D — the change taken off, and what the nights fall back to. */}
      {removed && (
        <Notice
          action={
            <button
              type="button"
              onClick={() => {
                setRules((prev) => [...prev, removed]);
                setRemoved(null);
              }}
              className="shrink-0 text-[12px] font-semibold text-text-primary underline"
            >
              {s.undo[k]}
            </button>
          }
        >
          {fill(s.releaseRemoved[k], {
            rooms: removed.rooms[k],
            rule: contractRule?.rule[k] ?? "",
            range: removed.dates[k].replace(/\s*\d{4}$/, ""),
          })}
        </Notice>
      )}

      {/* OV 04.3E — the band becomes an edit of the change that was picked. */}
      <Label>
        {editing
          ? fill(s.editing[k], {
              range: editing.dates[k].replace(/\s*\d{4}$/, ""),
              rooms: editing.rooms[k],
            })
          : c.addTitle[k]}
      </Label>

      <>
          <Label>{c.datesTitle[k]}</Label>
          <div className="space-y-2">
            <DateRow
              copy={{
                from: c.from[k],
                to: c.to[k],
                to2: bulkRates.to2[k],
                add: bulkRates.add[k],
              }}
              days={days}
              onToggleDay={(index) => setDays((prev) => flip(prev, index))}
              from={from}
              to={to}
              onFrom={setFrom}
              onTo={setTo}
              onAdd={() => {
                const range = parseRange(from, to);
                if (!range) return;
                setRanges((prev) => [...prev, range]);
                setFrom("");
                setTo("");
              }}
              k={k}
            />
            {clash && pending && changed && (
              <Notice tone="warning">
                {fill(s.releaseOverlap[k], {
                  range: changed.dates[k].replace(/\s*\d{4}$/, ""),
                  rule: changed.rule[k].split(" · ")[0] ?? "",
                  span: labelOf(pending, k, true),
                  days: k === "ar" ? arNum(typed || 2) : typed || 2,
                })}
              </Notice>
            )}
            <LockedRanges
              ranges={ranges}
              days={days}
              onRemove={(index) =>
                setRanges((prev) => prev.filter((_, item) => item !== index))
              }
              empty={bulkRates.noDates[k]}
              remove={bulkRates.removeRange[k]}
              k={k}
            />
          </div>

          <Label>{c.roomsTitle[k]}</Label>
          <RoomGrid
            allLabel={c.allRooms[k]}
            rooms={rooms}
            onToggle={(index) => setRooms((prev) => flip(prev, index))}
            onToggleAll={() =>
              setRooms(
                rooms.length === bulkRateRows.length
                  ? []
                  : bulkRateRows.map((_, index) => index)
              )
            }
            k={k}
          />
      </>

      <Label>{c.releaseTitle[k]}</Label>
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex gap-1 rounded-[10px] bg-status-neutral-bg p-1">
          {(
            [
              ["same", c.sameDay[k]],
              ["days", c.numberOfDays[k]],
            ] as Array<[string, string]>
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setMode(key);
                if (key === "same") setAt("14:00");
              }}
              className={cn(
                "rounded-lg px-3 py-2 text-[12.5px] transition-colors",
                mode === key
                  ? "bg-surface-default font-semibold text-text-primary"
                  : "text-text-muted hover:bg-surface-default/60"
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <div>
          <FieldLabel>{c.daysBefore[k]}</FieldLabel>
          <Box
            value={mode === "same" ? (k === "ar" ? arNum(0) : "0") : daysBefore}
            onChange={setDaysBefore}
            placeholder={c.daysHint[k]}
            readOnly={mode === "same"}
            invalid={tooMany}
          />
        </div>
        <div>
          <FieldLabel>{c.at[k]}</FieldLabel>
          <Box value={at} onChange={setAt} className="w-[110px]" />
        </div>
      </div>
    </IconModal>
  );
}

/** OV 04.4 / 04.4F — one room, one night, and what new bookings do with it. */
export function NightStatusOverlay({
  room,
  date,
  fixed = false,
  onClose,
}: {
  room?: string | undefined;
  date?: string | undefined;
  /** A fixed-price contract sells priced lines, not rooms. */
  fixed?: boolean;
  onClose: () => void;
}) {
  const { lang } = useLanguage();
  const k = lang === "ar" ? "ar" : "en";
  const c = nightStatus;
  const f = oneNightStates;
  const [state, setState] = useState("request");
  const [hint, setHint] = useState(false);

  return (
    <IconModal
      width="660px"
      overline={room ?? (fixed ? f.fixedOverline[k] : c.room[k])}
      title={date ?? c.title[k]}
      body={fixed ? f.statusFixedBody[k] : c.body[k]}
      onClose={onClose}
      footer={
        <Actions
          lead={
            <Button variant="outline" onClick={onClose}>
              {c.cancel[k]}
            </Button>
          }
        >
          <Button onClick={onClose}>{c.apply[k]}</Button>
        </Actions>
      }
    >
      <div className="space-y-2">
        {c.options.map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => setState(option.key)}
            className={cn(
              "flex w-full items-start gap-2.5 rounded-[10px] border px-3.5 py-2.5 text-start transition-colors",
              state === option.key
                ? "border-brand-deep bg-primary-subtle"
                : "border-border-subtle hover:bg-surface-subtle"
            )}
          >
            <span
              className={cn(
                "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                state === option.key
                  ? "border-brand-deep"
                  : "border-border-strong"
              )}
            >
              {state === option.key && (
                <span
                  className="h-2 w-2 rounded-full bg-brand-deep"
                  aria-hidden="true"
                />
              )}
            </span>
            <span className="min-w-0">
              <span className="block text-[12.5px] font-semibold text-text-primary">
                {option.label[k]}
              </span>
              <span className="mt-0.5 block text-[11.5px] leading-4 text-text-muted">
                {option.note[k]}
              </span>
            </span>
          </button>
        ))}
      </div>
      <Check
        checked={hint}
        onChange={() => setHint(!hint)}
        label={fixed ? f.statusFixedFoot[k] : c.footNote[k]}
      />
    </IconModal>
  );
}

/** A label, its value and an optional way in — one line of a summary card. */
function SummaryRow({
  label,
  value,
  action,
  onAction,
  tone,
}: {
  label: string;
  value: string;
  action?: string;
  onAction?: (() => void) | undefined;
  tone?: "warning" | "danger";
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 px-3.5 py-2.5 [&:not(:first-child)]:border-t [&:not(:first-child)]:border-border-subtle">
      <span className="min-w-0 flex-1 text-[12.5px] text-text-primary">
        {label}
      </span>
      <span
        className={cn(
          "text-[12.5px] font-semibold",
          tone === "warning"
            ? "text-status-warning"
            : tone === "danger"
              ? "text-status-danger"
              : "text-text-primary"
        )}
      >
        {value}
      </span>
      {action && (
        <button
          type="button"
          onClick={onAction}
          className="text-[12.5px] font-medium text-text-primary hover:underline"
        >
          {action}
        </button>
      )}
    </div>
  );
}

/**
 * OV 04.5 and its family — the whole of one night, or of a run of them:
 * the price, the supplements it carries, and the rules that govern it.
 * A fixed-price contract prices the whole line instead.
 */
export function OneNightOverlay({
  room,
  date,
  base = false,
  weekend = false,
  nights = 1,
  fixed = false,
  current,
  season,
  seasonPrice,
  summary,
  spans,
  already,
  onClose,
  onSave,
  onBreakdown,
  onStatus,
  onNights,
}: {
  room?: string | undefined;
  date?: string | undefined;
  /** The base room says so on its overline. */
  base?: boolean;
  /** A Thursday or Friday says so beside its date. */
  weekend?: boolean;
  /** OV 04.5R — the same overlay over a run of nights. */
  nights?: number;
  /** OV 04.5F — a line that carries its own full price. */
  fixed?: boolean;
  /** What this night is priced at now, which is what the box opens on. */
  current?: number | undefined;
  /** OV 04.6N / 04.6G — the season these nights sit in, if any. */
  season?: { en: string; ar: string } | undefined;
  /** What the season charges, which replaces the contract in the hints. */
  seasonPrice?: number | undefined;
  /** The nights themselves: the range as written, and what it is made of. */
  summary?:
    | {
        range: string;
        weekdays: number;
        weekend: string[];
        /** OV 04.6L - the frame names the weekday too, not only its count. */
        weekdayList: string[];
      }
    | undefined;
  /** OV 04.6G / 04.6O — the seasons a run of nights crosses, if two. */
  spans?:
    | Array<{
        name: { en: string; ar: string };
        from: number;
        to: number;
        nights: number;
      }>
    | undefined;
  /** OV 04.6H — what the picked nights are already carrying. */
  already?:
    | {
        changed: Array<{ when: { en: string; ar: string }; price: number }>;
        closed: Array<{ en: string; ar: string }>;
        booked: number;
      }
    | undefined;
  onClose: () => void;
  /** UI 04.1W — a saved night leaves the page holding a draft. */
  onSave?: (() => void) | undefined;
  onBreakdown?: (() => void) | undefined;
  onStatus?: (() => void) | undefined;
  /**
   * OV 04.6B / 04.6C / 04.6D - the nights field is a field. What it picks
   * goes back to the page, because everything else on this overlay - the
   * split, the season, what the nights already carry - is read off the
   * month rather than kept here.
   */
  onNights?: ((range: DayRange) => void) | undefined;
}) {
  const { lang } = useLanguage();
  const k = lang === "ar" ? "ar" : "en";
  const c = oneNight;
  const f = oneNightStates;
  const many = nights > 1;
  const count = k === "ar" ? arNum(nights) : nights;
  /* The box opens on what the night actually costs today - the season's
     price inside a season, the contract's outside one - not on a constant. */
  const start = current ?? (fixed ? f.fixedValue : c.priceValue);
  const [price, setPrice] = useState(k === "ar" ? arNum(start) : String(start));
  const [weekdayPrice, setWeekdayPrice] = useState(k === "ar" ? arNum(400) : "400");
  const [view, setView] = useState<"night" | "supplements">("night");
  const [perNight, setPerNight] = useState<Record<string, string>>({});
  const [split, setSplit] = useState(false);
  const [perWeekend, setPerWeekend] = useState<Record<string, string>>({});
  /* How the picked nights divide, for the two labels and the two boxes. */
  const weekendNights = summary?.weekend.length ?? 0;
  const weekdayNights = summary?.weekdays ?? nights;
  /*
   * OV 04.6B / 04.6C - every night the same kind. There is one price to
   * type, so there is no choice to offer: the two cards go, and the one
   * field says which kind it is pricing.
   */
  /* Two boxes only when there are two kinds of night to price. */
  const uniform: "weekday" | "weekend" | null = !many
    ? null
    : weekendNights === 0
      ? "weekday"
      : weekdayNights === 0
        ? "weekend"
        : null;
  /* OV 04.6D / 04.6E - one price for every night, or two as in the
     contract. A single night has nothing to split, so it never asks. */
  const [apart, setApart] = useState(true);
  /* Two boxes only when there are two kinds of night to price. */
  const twoBoxes = many && !uniform && apart;
  /* OV 04.6F - the seven days, so "October, Fridays only" is one screen
     and not a different overlay. */
  const [days, setDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [picking, setPicking] = useState(false);
  /* OV 04.6N - a fixed-price group is the only one you can type into. */
  const [groupPrice, setGroupPrice] = useState<Record<string, string>>({});

  /**
   * OV 04.6J — a room cannot be given away.
   *
   * The box holds whatever digits the reader types, and in Arabic those
   * are ٠-٩. Stripping everything but 0-9 turned a perfectly good
   * ٧٤٠ into nothing, and the overlay then refused to save a price it
   * had filled in itself.
   */
  const priced = Number(
    price.replace(/[٠-٩]/g, (d) =>
      String(d.charCodeAt(0) - 0x0660)
    ).replace(/[^0-9]/g, "")
  );
  /*
   * OV 04.6J / 04.6M - a nought and a blank both stop the save, and they
   * are not the same thing. Typing 0 is someone saying the night is free,
   * which is worth an alarm and an offer to stop the sale instead. An
   * empty box is only an unfinished sentence, and shouting at it would be
   * shouting at someone mid-thought.
   */
  const zero = priced === 0 && price.trim() !== "";
  const blank = price.trim() === "";
  const missing = zero || blank;
  /* OV 04.6I — under your own floor is a warning, never a refusal: it is
     your room and your price, you only have to know what you just did. */
  const underFloor = priced > 0 && priced < sellingFloor;

  /** The overline names the room, and the base room says that it is one. */
  const overline = fixed
    ? f.fixedOverline[k]
    : room
      ? `${room}${base ? ` · ${c.baseTag[k]}` : ""}`
      : c.overline[k];

  /** OV 04.5E — this room's supplements, for these nights only. */
  if (view === "supplements") {
    const editable = c.supplements.slice(1);
    return (
      <IconModal
        width="660px"
        overline={overline}
        title={fill(f.supTitle[k], {
          when: many
            ? fill(f.dateMany[k], { range: "24 - 26 Sep", count })
            : ((date ?? c.dateValue[k]).split(" · ")[0] ?? "").replace(
                /\s+\d{4}$|\s+[٠-٩]{4}$/,
                ""
              ),
        })}
        body={many ? f.supBodyMany[k] : f.supBody[k]}
        onClose={onClose}
        footer={
          <Actions
            lead={
              <Button variant="outline" onClick={() => setView("night")}>
                {f.back[k]}
              </Button>
            }
          >
            <Button onClick={() => setView("night")}>
              {many ? f.useNights[k] : f.useNight[k]}
            </Button>
          </Actions>
        }
      >
        <Panel>
          <PanelRow head>
            <span className="min-w-0 flex-1 text-[12px] text-text-primary">
              {split
                ? f.supHeadPlain[k]
                : many
                  ? fill(f.supHeadMany[k], { count })
                  : f.supHead[k]}
            </span>
            {split && (
              <>
                <span className="w-[150px] shrink-0 text-[11px] text-text-muted">
                  {f.colWeekdays[k]}
                </span>
                <span className="w-[150px] shrink-0 text-[11px] text-text-muted">
                  {f.colWeekend[k]}
                </span>
              </>
            )}
          </PanelRow>

          {/* The base room adds nothing, so it is read, not typed. */}
          <SummaryRow
            label={c.supplements[0]!.label[k]}
            value={c.supplements[0]!.value[k]}
          />

          {editable.map((line) => {
            const unit = line.value.en.includes("per person");
            /** The box holds the number; the unit sits beside it. */
            const plain = bare(line.value[k]);
            return (
            <PanelRow key={line.label.en}>
              <span className="min-w-0 flex-1 text-[12.5px] text-text-primary">
                {line.label[k]}
              </span>
              <Box
                value={perNight[line.label.en] ?? plain}
                onChange={(next) =>
                  setPerNight((prev) => ({ ...prev, [line.label.en]: next }))
                }
                suffix={unit ? f.perPerson[k] : undefined}
                className="w-[150px]"
              />
              {split && (
                <Box
                  value={perWeekend[line.label.en] ?? ""}
                  onChange={(next) =>
                    setPerWeekend((prev) => ({ ...prev, [line.label.en]: next }))
                  }
                  suffix={unit ? f.perPerson[k] : undefined}
                  className="w-[150px]"
                />
              )}
              <span className="w-[110px] shrink-0 text-end text-[11.5px] text-text-muted">
                {fill(f.contractValue[k], { value: plain })}
              </span>
            </PanelRow>
            );
          })}
        </Panel>

        {/* OV 04.5ES / 04.5EW — one price for the run, or two. */}
        {many && (
          <button
            type="button"
            onClick={() => setSplit(!split)}
            className="self-start text-[12.5px] font-medium text-text-primary underline"
          >
            {split ? f.sameAllNights[k] : f.differentWeekend[k]}
          </button>
        )}
      </IconModal>
    );
  }

  return (
    <IconModal
      width="660px"
      overline={overline}
      title={many ? fill(f.titleMany[k], { count }) : c.title[k]}
      body={
        fixed
          ? many
            ? f.fixedBodyMany[k]
            : f.fixedBody[k]
          : many
            ? f.bodyMany[k]
            : c.body[k]
      }
      onClose={onClose}
      footer={
        <Actions
          lead={
            <>
              <button
                type="button"
                onClick={onClose}
                className="text-[12.5px] font-medium text-status-danger hover:underline"
              >
                {c.undo[k]}
              </button>
              <span className="text-[11.5px] text-text-muted">
                {c.draftNote[k]}
              </span>
            </>
          }
        >
          <Button variant="outline" onClick={onClose}>
            {c.cancel[k]}
          </Button>
          <Button disabled={missing} onClick={onSave ?? onClose}>
            {/* The button says how many nights it is about to write. */}
            {many ? fill(f.saveMany[k], { count }) : c.saveOne[k]}
          </Button>
        </Actions>
      }
    >
      {/*
        * OV 04.6A-F — the nights come first and full width, because every
        * other field on the screen is answering "for which nights".
        */}
      <div className="relative">
        <FieldLabel>{c.dateLabel[k]}</FieldLabel>
        <button
          type="button"
          onClick={() => setPicking(true)}
          className="flex h-11 w-full items-center justify-between gap-2 rounded-[10px] border border-border-strong bg-surface-default px-3.5 text-start text-[13px] text-text-primary"
        >
          {fill(f.dateMany[k], {
            range: many ? (summary?.range ?? "") : (date ?? c.dateValue[k]),
            nights: counted(nights, nightsWord, k),
          })}
          <CalendarDays
            className="h-4 w-4 shrink-0 text-text-muted"
            aria-hidden="true"
          />
        </button>
        <p className="mt-1.5 text-[11.5px] text-text-quiet">
          {many
            ? `${
                uniform
                  ? nights === 2
                    ? (uniform === "weekend" ? f.bothWeekend : f.bothWeekday)[k]
                    : fill(
                        (uniform === "weekend"
                          ? f.allWeekend
                          : f.allWeekday)[k],
                        { n: k === "ar" ? arNum(nights) : String(nights) }
                      )
                  : fill(f.nightsBreakdown[k], {
                      weekdays: counted(
                        summary?.weekdays ?? nights,
                        weekdaysWord,
                        k
                      ),
                      weekdayList: (summary?.weekdayList ?? []).join(
                        k === "ar" ? "، " : ", "
                      ),
                      weekend: counted(
                        summary?.weekend.length ?? 0,
                        weekendNightsWord,
                        k
                      ),
                      list: (summary?.weekend ?? []).join(
                        k === "ar" ? "، " : ", "
                      ),
                    })
              }${
                spans && spans.length > 1
                  ? ` · ${fill(c.seasonsCount[k], {
                      n: k === "ar" ? arNum(spans.length) : String(spans.length),
                    })}`
                  : ""
              }`
            : season
              ? fill(c.seasonNightHint[k], {
                  tag: weekend ? c.weekendTag[k] : c.weekdayNightHint[k],
                  season: season[k],
                })
              : weekend
                ? c.weekendNightHint[k]
                : c.weekdayNightHint[k]}
        </p>

        {picking && (
          <div className="absolute end-0 top-[72px] z-20">
            <DatePicker
              className="w-[300px]"
              onApply={(range) => {
                onNights?.(range);
                setPicking(false);
              }}
              onCancel={() => setPicking(false)}
            />
          </div>
        )}
      </div>

      {/* OV 04.6D / 04.6E — one price, or the contract's two. */}
      {many && !uniform && (
        <div className="mt-3.5 grid gap-3 sm:grid-cols-2">
          {(
            [
              [false, c.onePriceTitle[k], c.onePriceBody[k]],
              [true, c.apartTitle[k], c.apartBody[k]],
            ] as Array<[boolean, string, string]>
          ).map(([value, label, hint]) => (
            <button
              key={label}
              type="button"
              aria-pressed={apart === value}
              onClick={() => setApart(value)}
              className={cn(
                "rounded-xl border p-3.5 text-start transition-colors",
                apart === value
                  ? "border-primary bg-[#eef8f1]"
                  : "border-border-subtle hover:bg-surface-subtle"
              )}
            >
              <span className="block text-[12.5px] font-semibold text-text-primary">
                {label}
              </span>
              <span className="mt-0.5 block text-[11.5px] leading-4 text-text-muted">
                {hint}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* OV 04.6F — October, Fridays only, is this row and nothing else. */}
      {many && (
        <div className="mt-3.5">
          <FieldLabel>{c.applyDays[k]}</FieldLabel>
          <div className="flex flex-wrap gap-1.5">
            {datePickerCopy[k].weekdays.map((day: string, index: number) => (
              <button
                key={day}
                type="button"
                aria-pressed={days.includes(index)}
                onClick={() =>
                  setDays((current) =>
                    current.includes(index)
                      ? current.filter((d) => d !== index)
                      : [...current, index]
                  )
                }
                className={cn(
                  "h-9 w-9 rounded-[8px] text-[12px] font-medium transition-colors",
                  days.includes(index)
                    ? "bg-brand-deep text-text-inverse"
                    : "border border-border-default text-text-secondary hover:bg-surface-subtle"
                )}
              >
                {day}
              </button>
            ))}
          </div>
          <p className="mt-1.5 text-[11.5px] text-text-quiet">
            {days.length === 7
              ? fill(c.allDaysTicked[k], { n: k === "ar" ? arNum(7) : "7" })
              : fill(c.someDaysTicked[k], {
                  n: k === "ar" ? arNum(days.length) : String(days.length),
                })}
          </p>
        </div>
      )}

      {/* The prices themselves: one column, or the contract's two. */}
      <div
        className={cn(
          "mt-3.5 grid gap-3",
          twoBoxes ? "sm:grid-cols-2" : "sm:grid-cols-1"
        )}
      >
        {twoBoxes && (
          <div>
            <FieldLabel>
              {fill(fixed ? f.fixedWeekday[k] : c.weekdaysPrice[k], {
                nights: counted(weekdayNights, nightsWord, k),
              })}
            </FieldLabel>
            <Box value={weekdayPrice} onChange={setWeekdayPrice} />
            <p className="mt-1.5 text-[11.5px] text-text-quiet">
              {fill(c.contractIs[k], {
                price: k === "ar" ? arNum(fixed ? 490 : 400) : fixed ? "490" : "400",
              })}
            </p>
          </div>
        )}
        <div>
          <FieldLabel>
            {!many
              ? fixed
                ? f.fixedLabel[k]
                : c.priceLabel[k]
              : twoBoxes
                ? fill(fixed ? f.fixedWeekend[k] : c.weekendPriceLabel[k], {
                    nights: counted(weekendNights, nightsWord, k),
                  })
                : uniform
                  ? (uniform === "weekend"
                      ? f.perNightWeekend
                      : f.perNightWeekday)[k]
                  : fill(c.pricePerNight[k], {
                      nights: counted(nights, nightsWord, k),
                    })}
          </FieldLabel>
          <Box
            value={price}
            onChange={setPrice}
            className={cn(!missing && "border-brand-deep")}
            invalid={missing}
          />
          {/* One line under the field, and it is whichever matters most:
              the refusal, then the warning, then what it is being
              compared with. */}
          {missing ? (
            <p className="mt-1.5 text-[11.5px] font-medium text-status-danger">
              {c.enterPrice[k]}
            </p>
          ) : underFloor ? (
            <p className="mt-1.5 text-[11.5px] leading-4 text-status-warning">
              {fill(c.belowFloor[k], {
                floor: k === "ar" ? arNum(sellingFloor) : String(sellingFloor),
                price: k === "ar" ? arNum(priced) : String(priced),
              })}
            </p>
          ) : (
            <p className="mt-1.5 text-[11.5px] text-text-quiet">
              {fixed
                ? f.fixedContract[k]
                : season
                  ? fill(c.seasonContract[k], {
                      season: season[k],
                      price:
                        k === "ar"
                          ? arNum(seasonPrice ?? 740)
                          : String(seasonPrice ?? 740),
                    })
                  : many
                    ? apart
                      ? fill(c.contractIs[k], {
                          price: k === "ar" ? arNum(500) : "500",
                        })
                      : fill(c.contractBoth[k], {
                          weekday: k === "ar" ? arNum(400) : "400",
                          weekend: k === "ar" ? arNum(500) : "500",
                        })
                    : /* A weekday night is compared with the weekday
                         contract price, not with the weekend's. */
                      fill(c.contractIs[k], {
                        price:
                          k === "ar"
                            ? arNum(weekend ? 500 : 400)
                            : String(weekend ? 500 : 400),
                      })}
            </p>
          )}
        </div>
      </div>

      {/*
        * OV 04.6H — what the picked nights already carry, before this
        * price lands on them. Each band only appears when it is true, so
        * an ordinary run of nights shows none of them.
        */}
      {already && already.changed.length > 0 && (
        <Band tone="warning">
          <b>
            {fill(
              already.changed.length === 1
                ? c.alreadyPricedOne[k]
                : c.alreadyPriced[k],
              { n: counted(already.changed.length, nightsWord, k) }
            )}
          </b>
          {fill(
            already.changed.length === 1
              ? c.alreadyPricedBodyOne[k]
              : c.alreadyPricedBody[k],
            {
            list: already.changed
              .map(
                (item) =>
                  `${item.when[k]} (${k === "ar" ? arNum(item.price) : item.price})`
              )
              .join(k === "ar" ? "، " : ", "),
            }
          )}
        </Band>
      )}
      {already && already.closed.length > 0 && (
        <Band>
          <b>
            {fill(
              already.closed.length === 1
                ? c.nightsClosedOne[k]
                : c.nightsClosed[k],
              { n: counted(already.closed.length, nightsWord, k) }
            )}
          </b>
          {fill(
            already.closed.length === 1
              ? c.nightsClosedBodyOne[k]
              : c.nightsClosedBody[k],
            {
            list: already.closed
              .map((item) => item[k])
              .join(k === "ar" ? "، " : ", "),
            }
          )}
        </Band>
      )}
      {already && already.booked > 0 && (
        <Band>
          <b>{c.bookingsKeep[k]}</b>
          {fill(
            already.booked === 1 ? c.bookedOne[k] : c.bookingsKeepBody[k],
            { n: counted(already.booked, roomsWord, k) }
          )}
        </Band>
      )}

      {/* OV 04.6G — the run crosses a boundary, so name both sides of it
          before the one price below replaces them both. */}
      {spans && spans.length > 1 && (
        <div className="mt-3.5 rounded-xl bg-[#e8f1f8] p-3.5">
          <p className="text-[12.5px] font-semibold text-[#2f5673]">
            {fill(c.twoSeasons[k], {
              n: countedOf(spans.length, seasonsWord, k),
            })}
          </p>
          <p className="mt-0.5 text-[12px] leading-5 text-[#2f5673]">
            {fill(c.twoSeasonsBody[k], {
              list: spans
                .map((span) =>
                  fill(c.seasonSpan[k], {
                    season: span.name[k],
                    from: k === "ar" ? arNum(span.from) : String(span.from),
                    to: k === "ar" ? arNum(span.to) : String(span.to),
                    nights: counted(span.nights, nightsWord, k),
                  })
                )
                .join(k === "ar" ? " و" : " and "),
            })}
          </p>
        </div>
      )}

      {/* BR-03-91 — nationality prices live inside a season only. Outside
          one, say so; inside one, show what each group will pay. */}
      {season ? (
        <Panel className="mt-3.5">
          <PanelRow head>
            <span className="min-w-0 flex-1">
              <span className="block text-[12px] text-text-primary">
                {c.nationalityHead[k]}
              </span>
              <span className="mt-0.5 block text-[11px] text-text-muted">
                {spans && spans.length > 1
                  ? fill(c.seasonsHave[k], {
                      list: spans
                        .map((span) => span.name[k])
                        .join(k === "ar" ? " و" : " and "),
                    })
                  : fill(c.nationalitySub[k], { season: season[k] })}
              </span>
            </span>
            <button
              type="button"
              className="text-[12.5px] font-medium text-text-primary hover:underline"
            >
              {c.openSeason[k]}
            </button>
          </PanelRow>
          {nationalityGroups.map((group) => {
            const adjust = group.adjust ?? 0;
            return (
              <PanelRow key={group.id}>
                <span className="min-w-0 flex-1">
                  <span className="block text-[12.5px] font-medium text-text-primary">
                    {group.name[k]}
                  </span>
                  <span className="mt-0.5 block text-[11px] text-text-muted">
                    {group.mode === "fixed"
                      ? spans && spans.length > 1
                        ? c.fixedInEach[k]
                        : c.fixedInSeason[k]
                      : fill(c.adjustOnYourPrice[k], {
                          sign: adjust < 0 ? "−" : "+",
                          amount:
                            k === "ar"
                              ? arNum(Math.abs(adjust))
                              : String(Math.abs(adjust)),
                        })}
                  </span>
                </span>
                {/* A group that follows your price reads off it; a group
                    with its own price is a box, because it is yours to
                    type. */}
                {group.mode === "fixed" ? (
                  <span className="shrink-0">
                    <Box
                      value={
                        groupPrice[group.id] ??
                        (k === "ar" ? arNum(790) : "790")
                      }
                      onChange={(next) =>
                        setGroupPrice((prev) => ({ ...prev, [group.id]: next }))
                      }
                      className="w-[150px]"
                    />
                    <span className="mt-1 block text-[11px] text-text-muted">
                      {fill(c.seasonIs[k], {
                        price: k === "ar" ? arNum(790) : "790",
                      })}
                    </span>
                  </span>
                ) : (
                  <span className="shrink-0 text-[13px] font-semibold text-text-primary">
                    {k === "ar"
                      ? arNum(Math.max(priced + adjust, 0))
                      : Math.max(priced + adjust, 0)}
                  </span>
                )}
              </PanelRow>
            );
          })}
        </Panel>
      ) : (
        <div className="mt-3.5 rounded-xl bg-surface-subtle p-3.5">
          <p className="text-[12px] leading-5 text-text-body">
            {c.noSeason[k]}
          </p>
        </div>
      )}

      {/* OV 04.5K / 04.5KF — nothing may be sold for nothing. */}
      {zero && (
        <Alarm
          action={
            <button
              type="button"
              onClick={onStatus}
              className="shrink-0 text-[12px] font-semibold text-status-danger underline"
            >
              {f.stopInstead[k]}
            </button>
          }
        >
          {f.zero[k]}
        </Alarm>
      )}

      {/* A fixed-price line has no supplements to carry. */}
      {!fixed && (
        <Panel>
          <PanelRow head>
            <span className="min-w-0 flex-1 text-[12px] text-text-primary">
              {c.supplementsLabel[k]}
            </span>
            <button
              type="button"
              onClick={() => setView("supplements")}
              className="text-[12.5px] font-medium text-text-primary hover:underline"
            >
              {many ? f.editMany[k] : c.editSupplements[k]}
            </button>
          </PanelRow>
          {c.supplements.map((line) => {
            const changed = perNight[line.label.en];
            const weekendOnly = perWeekend[line.label.en];
            return (
              <SummaryRow
                key={line.label.en}
                label={line.label[k]}
                value={
                  changed
                    ? weekendOnly
                      ? fill(f.mealChangedWeekend[k], {
                          now: changed.replace(/^\+\s*/, ""),
                          weekend: weekendOnly.replace(/^\+\s*/, ""),
                          was: line.value[k].replace(/[^0-9٠-٩]/g, ""),
                        })
                      : fill(f.mealChanged[k], {
                          now: changed.replace(/^\+\s*/, ""),
                          was: line.value[k].replace(/[^0-9٠-٩]/g, ""),
                        })
                    : line.value[k]
                }
                {...(changed ? { tone: "warning" as const } : {})}
              />
            );
          })}
        </Panel>
      )}

      <Panel>
        <SummaryRow
          label={c.poolLabel[k]}
          value={many ? f.poolMany[k] : c.poolValue[k]}
          action={c.breakdown[k]}
          onAction={onBreakdown}
        />
        <SummaryRow
          label={c.statusLabel[k]}
          value={c.statusValue[k]}
          action={c.change[k]}
          onAction={onStatus}
        />
        <SummaryRow
          label={c.minNightsLabel[k]}
          value={many ? fill(f.minMany[k], { count }) : c.minNightsValue[k]}
          action={c.openRule[k]}
        />
        <SummaryRow
          label={c.releaseLabel[k]}
          value={many ? fill(f.releaseMany[k], { count }) : c.releaseValue[k]}
          action={c.change[k]}
          tone="warning"
        />
      </Panel>
    </IconModal>
  );
}

/** OV 04.6 / 04.6F — where the fifty rooms of one night went. */
export function PoolBreakdownOverlay({
  date,
  fixed = false,
  onClose,
}: {
  date?: string | undefined;
  /** A fixed-price contract caps priced lines, not room types. */
  fixed?: boolean;
  onClose: () => void;
}) {
  const { lang } = useLanguage();
  const k = lang === "ar" ? "ar" : "en";
  const c = poolBreakdown;
  const f = oneNightStates;

  return (
    <IconModal
      width="660px"
      overline={c.overline[k]}
      title={date ?? c.title[k]}
      body={fixed ? f.poolFixedBody[k] : c.body[k]}
      onClose={onClose}
      footer={
        <Button variant="outline" onClick={onClose}>
          {c.close[k]}
        </Button>
      }
    >
      <Panel>
        {c.rows.map((row, index) => (
          <SummaryRow
            key={row.label.en}
            label={row.label[k]}
            value={
              fixed && index === c.rows.length - 1
                ? f.poolFixedCapped[k]
                : row.value[k]
            }
            {...("danger" in row && row.danger
              ? { tone: "danger" as const }
              : {})}
          />
        ))}
      </Panel>
      <p className="rounded-[10px] border border-notice-border bg-notice px-3.5 py-3 text-[12px] leading-5 text-status-warning">
        {c.note[k]}
      </p>
    </IconModal>
  );
}

/** OV 04.8 — the months the grid is drawn across. */
export function MonthPickerOverlay({
  value,
  onPick,
  onClose,
}: {
  value?: number | undefined;
  onPick?: ((index: number) => void) | undefined;
  onClose: () => void;
}) {
  const { lang } = useLanguage();
  const k = lang === "ar" ? "ar" : "en";
  const c = monthPicker;
  const [picked, setPicked] = useState(value ?? 0);

  return (
    <IconModal
      width="660px"
      overline={c.overline[k]}
      title={c.title[k]}
      body={c.body[k]}
      onClose={onClose}
      footer={
        <Button
          onClick={() => {
            onPick?.(picked);
            onClose();
          }}
        >
          {c.done[k]}
        </Button>
      }
    >
      <div className="flex flex-wrap gap-2">
        {c.months.map((month, index) => (
          <button
            key={month.en}
            type="button"
            onClick={() => setPicked(index)}
            className={cn(
              "h-[34px] min-w-[95px] rounded-lg border px-3 text-[12.5px] font-medium transition-colors",
              index === picked
                ? "border-brand-deep bg-brand-deep text-white"
                : "border-border-default bg-surface-default text-text-primary hover:bg-surface-subtle"
            )}
          >
            {month[k]}
          </button>
        ))}
      </div>
      <p className="text-[11.5px] leading-4 text-text-muted">{c.tip[k]}</p>
    </IconModal>
  );
}

/** A card in a picker list — a name, a line under it, the chosen one tinted. */
function PickerCard({
  title,
  meta,
  picked,
  onClick,
}: {
  title: string;
  meta: string;
  picked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-[10px] border px-3.5 py-2.5 text-start transition-colors",
        picked
          ? "border-brand-deep bg-primary-subtle"
          : "border-border-subtle hover:bg-surface-subtle"
      )}
    >
      <span className="block text-[12.5px] font-semibold text-text-primary">
        {title}
      </span>
      <span className="mt-0.5 block text-[11.5px] leading-4 text-text-muted">
        {meta}
      </span>
    </button>
  );
}

/** OV 04.9 / 04.9B — the contracts this hotel holds. */
/**
 * OV 04.1PN / 04.1PN0 - Prices for.
 *
 * Four lines, and the last line of the panel is the one that matters: a
 * night outside a season shows the same price for everyone, so the picker
 * says so rather than letting the grid imply otherwise. When no night on
 * screen sits in a season that priced by nationality, each group says where
 * its prices do live instead of offering a view that would change nothing.
 */
export function PricesForOverlay({
  value,
  seasoned,
  onPick,
  onClose,
}: {
  value: CalendarGroupId;
  /** Whether any night in the window is priced by nationality. */
  seasoned: boolean;
  onPick: (id: CalendarGroupId) => void;
  onClose: () => void;
}) {
  const { lang } = useLanguage();
  const k = lang === "ar" ? "ar" : "en";
  const c = pricesForCopy;

  return (
    <IconModal
      width="420px"
      overline={c.overline[k]}
      title={c.title[k]}
      onClose={onClose}
    >
      <div className="space-y-2">
        {calendarGroups.map((group) => (
          <PickerCard
            key={group.id}
            title={group.option[k]}
            meta={(seasoned ? group.meta : group.metaNone)[k]}
            picked={group.id === value}
            onClick={() => {
              onPick(group.id);
              onClose();
            }}
          />
        ))}
      </div>
      <p className="mt-3 text-[11.5px] leading-5 text-text-muted">
        {(seasoned ? c.footer : c.footerNone)[k]}
      </p>
    </IconModal>
  );
}

export function ContractPickerOverlay({
  value = 0,
  onPick,
  onClose,
}: {
  value?: number;
  onPick?: ((index: number) => void) | undefined;
  onClose: () => void;
}) {
  const { lang } = useLanguage();
  const k = lang === "ar" ? "ar" : "en";
  const c = contractPicker;
  const [picked, setPicked] = useState(value);
  const [ended, setEnded] = useState(false);
  const rows = c.rows.filter((row) => ended || !row.ended);

  return (
    <IconModal
      width="660px"
      overline={c.overline[k]}
      title={c.title[k]}
      onClose={onClose}
    >
      <div className="space-y-2">
        {rows.map((row, index) => (
          <PickerCard
            key={row.title.en}
            title={row.title[k]}
            meta={row.meta[k]}
            picked={index === picked}
            onClick={() => {
              setPicked(index);
              onPick?.(index);
              onClose();
            }}
          />
        ))}
      </div>
      <Check
        checked={ended}
        onChange={() => setEnded(!ended)}
        label={c.includeEnded[k]}
      />
    </IconModal>
  );
}

/** OV 04.10 — the hotels this account is linked to. */
export function HotelPickerOverlay({
  value = 0,
  onPick,
  onClose,
}: {
  value?: number;
  onPick?: ((index: number) => void) | undefined;
  onClose: () => void;
}) {
  const { lang } = useLanguage();
  const k = lang === "ar" ? "ar" : "en";
  const c = hotelPicker;

  return (
    <IconModal
      width="660px"
      overline={c.overline[k]}
      title={c.title[k]}
      onClose={onClose}
    >
      <div className="space-y-2">
        {c.rows.map((row, index) => (
          <PickerCard
            key={row.title.en}
            title={row.title[k]}
            meta={row.meta[k]}
            picked={index === value}
            onClick={() => {
              onPick?.(index);
              onClose();
            }}
          />
        ))}
      </div>
    </IconModal>
  );
}

/** OV 04.11 — the grid as a file, in the three shapes it can take. */
export function ExportOverlay({ onClose }: { onClose: () => void }) {
  const { lang } = useLanguage();
  const k = lang === "ar" ? "ar" : "en";
  const c = exportView;
  const [format, setFormat] = useState("xlsx");

  return (
    <IconModal
      width="660px"
      icon={<FileText className="h-5 w-5" aria-hidden="true" />}
      overline={c.overline[k]}
      title={c.title[k]}
      body={c.body[k]}
      onClose={onClose}
      footer={
        <Actions
          lead={
            <Button variant="outline" onClick={onClose}>
              {c.cancel[k]}
            </Button>
          }
        >
          <Button onClick={onClose}>{c.download[k]}</Button>
        </Actions>
      }
    >
      <div className="space-y-2">
        {c.formats.map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => setFormat(option.key)}
            className={cn(
              "flex w-full items-start gap-2.5 rounded-[10px] border px-3.5 py-2.5 text-start transition-colors",
              format === option.key
                ? "border-brand-deep bg-primary-subtle"
                : "border-border-subtle hover:bg-surface-subtle"
            )}
          >
            <span
              className={cn(
                "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                format === option.key
                  ? "border-brand-deep"
                  : "border-border-strong"
              )}
            >
              {format === option.key && (
                <span
                  className="h-2 w-2 rounded-full bg-brand-deep"
                  aria-hidden="true"
                />
              )}
            </span>
            <span className="min-w-0">
              <span className="block text-[12.5px] font-semibold text-text-primary">
                {option.label[k]}
              </span>
              <span className="mt-0.5 block text-[11.5px] leading-4 text-text-muted">
                {option.note[k]}
              </span>
            </span>
          </button>
        ))}
      </div>
      <div className="flex items-start gap-2 rounded-[10px] bg-surface-subtle px-3.5 py-3">
        <Info
          className="mt-px h-3.5 w-3.5 shrink-0 text-text-muted"
          aria-hidden="true"
        />
        <p className="text-[11.5px] leading-4 text-text-muted">{c.note[k]}</p>
      </div>
    </IconModal>
  );
}

/**
 * OV 04.7 / 04.7L — everything changed on the grid and not yet live,
 * each line undoable on its own, and the publish that sends the lot.
 */
export function ReviewPublishDrawer({ onClose }: { onClose: () => void }) {
  const { lang } = useLanguage();
  const k = lang === "ar" ? "ar" : "en";
  const c = reviewPublish;
  const [changes, setChanges] = useState(c.changes);
  const [publishing, setPublishing] = useState(false);

  return (
    <Drawer
      width="552px"
      divider={false}
      overline={c.overline[k]}
      title={c.title[k]}
      meta={c.body[k]}
      onClose={onClose}
      footer={
        <Actions
          lead={
            <button
              type="button"
              onClick={() => setChanges([])}
              className="text-[12.5px] font-medium text-status-danger hover:underline"
            >
              {c.discardAll[k]}
            </button>
          }
        >
          <Button variant="outline" onClick={onClose}>
            {c.keepEditing[k]}
          </Button>
          <Button
            disabled={publishing || changes.length === 0}
            onClick={() => setPublishing(true)}
          >
            {fill(publishing ? c.publishing[k] : c.publish[k], {
              count: k === "ar" ? arNum(changes.length) : changes.length,
            })}
          </Button>
        </Actions>
      }
    >
      {/*
        * Row C / BR-04W-12 - a season price moving is not the whole story
        * when the season has nationality groups. The adjusted ones follow
        * it; a fixed one does not, and publishing without saying so hides a
        * price that did not move.
        */}
      {nationalityGroups.length > 0 && changes.length > 0 && (
        <p className="mb-3 rounded-[10px] bg-surface-subtle px-3.5 py-3 text-[11.5px] leading-4 text-text-secondary">
          {fill(nationalityCopy.reviewLine[k], {
            follow: nationalityGroups.filter((g) => g.mode === "adjust").length,
            fixed: nationalityGroups.filter((g) => g.mode === "fixed").length,
            names: nationalityGroups
              .filter((g) => g.mode === "fixed")
              .map((g) => g.name[k])
              .join(k === "ar" ? "، " : ", "),
          })}
        </p>
      )}
      <Panel>
        {changes.map((change, index) => (
          <div
            key={change.what.en}
            className="flex flex-wrap items-center gap-3 px-3.5 py-2.5 [&:not(:first-child)]:border-t [&:not(:first-child)]:border-border-subtle"
          >
            <span
              className={cn(
                "shrink-0 rounded-md px-2 py-0.5 text-[11px] font-medium",
                change.tone === "warning"
                  ? "bg-status-warning-bg text-status-warning"
                  : "bg-status-neutral-bg text-text-body"
              )}
            >
              {change.tag[k]}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[12.5px] font-semibold text-text-primary">
                {change.what[k]}
              </span>
              <span className="mt-px block text-[11.5px] leading-4 text-text-muted">
                {change.from[k]}
              </span>
            </span>
            <button
              type="button"
              onClick={() =>
                setChanges((prev) => prev.filter((_, item) => item !== index))
              }
              className="text-[12.5px] font-medium text-status-danger hover:underline"
            >
              {c.undo[k]}
            </button>
          </div>
        ))}
      </Panel>
    </Drawer>
  );
}
