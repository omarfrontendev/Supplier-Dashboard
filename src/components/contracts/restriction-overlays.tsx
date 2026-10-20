import { useMemo, useState } from "react";
import { CalendarDays, Trash2 } from "lucide-react";
import { Drawer, IconModal } from "@/components/layout/overlay";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { DatePicker, dateOf, keyOf } from "@/components/ui/date-picker";
import { readableDay } from "@/components/ui/date-field";
import {
  RestrictionDayDialog,
  type RestrictionScope,
} from "@/components/contracts/restriction-day-dialog";
import { restrictionIssues } from "@/components/contracts/contract-form/schema";
import { fill, useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  deleteRestrictionDialog,
  restrictionDrawer,
  type DayState,
} from "@/lib/restriction-overlay-data";
import {
  WEEKDAYS,
  type RestrictionRule,
  type Weekday,
} from "@/store/features/contracts/types";

const DRAWER_WIDTH = "760px";

/** Whether a day takes check-ins and check-outs, drawn as two chips. */
const CHIP_OPEN = "bg-chip-open text-chip-open-fg";
const CHIP_CLOSED = "bg-chip-closed text-chip-closed-fg";

const JS_DAY: Weekday[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const MAX_MONTHS = 3;

const columnOf = (key: string) => (dateOf(key).getDay() + 1) % 7;
const weekdayOf = (key: string) => JS_DAY[dateOf(key).getDay()]!;

function daysBetween(start: string, end: string) {
  const days: string[] = [];
  for (let date = dateOf(start); keyOf(date) <= end; date.setDate(date.getDate() + 1)) {
    days.push(keyOf(date));
  }
  return days;
}

function DayCell({
  day,
  state,
  label,
  outside,
  onClick,
}: {
  day: number;
  state: DayState;
  label: { in: string; out: string };
  outside: boolean;
  onClick: () => void;
}) {
  const inOpen = state === "open" || state === "noOut";
  const outOpen = state === "open" || state === "noIn";

  if (outside) {
    return (
      <span className="flex h-[52px] flex-col rounded-lg bg-surface-subtle px-2 py-1.5">
        <span className="text-[11.5px] text-border-strong">{day}</span>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[52px] flex-col gap-1 rounded-lg border border-border-default bg-surface-default px-2 py-1.5 text-start"
    >
      <span className="text-[11.5px] font-medium text-text-primary">{day}</span>
      <span className="flex gap-1">
        <span
          className={cn(
            "rounded-md px-1.5 text-[10px] leading-[17px]",
            inOpen ? CHIP_OPEN : CHIP_CLOSED,
          )}
        >
          {label.in}
        </span>
        <span
          className={cn(
            "rounded-md px-1.5 text-[10px] leading-[17px]",
            outOpen ? CHIP_OPEN : CHIP_CLOSED,
          )}
        >
          {label.out}
        </span>
      </span>
    </button>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-medium uppercase tracking-[0.04em] text-text-muted">
      {children}
    </p>
  );
}

export interface RestrictionRoomOption {
  value: string;
  label: string;
}

export function RestrictionDrawer({
  mode = "add",
  initial,
  rooms = [],
  term,
  weekendDays = [],
  onSave,
  onClose,
  onDelete,
}: {
  mode?: "add" | "edit";
  initial?: RestrictionRule | null;
  rooms?: RestrictionRoomOption[];
  term?: { startDate: string; endDate: string };
  weekendDays?: Weekday[];
  onSave?: (rule: RestrictionRule) => void;
  onClose: () => void;
  onDelete?: () => void;
}) {
  const { c, lang } = useLanguage();
  const k = lang === "ar" ? "ar" : "en";
  const r = restrictionDrawer;
  const f = c.builder.form;
  const t = f.restrictions;
  const editing = mode === "edit";

  const [roomId, setRoomId] = useState(initial?.roomId ? String(initial.roomId) : "all");
  const [startDate, setStartDate] = useState(initial?.startDate ?? "");
  const [endDate, setEndDate] = useState(initial?.endDate ?? "");
  const [minNights, setMinNights] = useState(initial?.minNights ?? "");
  const [weekendOnly, setWeekendOnly] = useState(initial?.appliesOn === "weekend_only");
  const [active, setActive] = useState(initial?.active ?? true);
  const [closedIn, setClosedIn] = useState<string[]>(initial?.closedCheckIn ?? []);
  const [closedOut, setClosedOut] = useState<string[]>(initial?.closedCheckOut ?? []);
  const [picking, setPicking] = useState(false);
  const [scope, setScope] = useState<(RestrictionScope & { keys: string[] }) | null>(null);
  const [issues, setIssues] = useState<string[]>([]);

  const hasRange = Boolean(startDate && endDate);
  const minIsZero = minNights === "0";
  const weekendSet = new Set(weekendDays);
  const WEEKDAY_SHORT = k === "ar" ? r.weekdaysAr : r.weekdays;
  const WEEKDAY_LONG = k === "ar" ? r.weekdaysAr : r.weekdaysLong;

  const inRule = (key: string) => !weekendOnly || weekendSet.has(weekdayOf(key));
  const rangeDays = useMemo(
    () => (hasRange ? daysBetween(startDate, endDate) : []),
    [hasRange, startDate, endDate],
  );
  const months = useMemo(() => {
    const list: Array<{ year: number; month: number }> = [];
    rangeDays.forEach((key) => {
      const date = dateOf(key);
      const last = list[list.length - 1];
      if (!last || last.year !== date.getFullYear() || last.month !== date.getMonth()) {
        list.push({ year: date.getFullYear(), month: date.getMonth() });
      }
    });
    return list;
  }, [rangeDays]);

  const stateOf = (key: string): DayState => {
    const noIn = closedIn.includes(key);
    const noOut = closedOut.includes(key);
    return noIn && noOut ? "closed" : noIn ? "noIn" : noOut ? "noOut" : "open";
  };

  const applyTo = (keys: string[], next: { checkIn: boolean; checkOut: boolean }) => {
    setClosedIn((prev) => {
      const rest = prev.filter((key) => !keys.includes(key));
      return next.checkIn ? rest : [...rest, ...keys].sort();
    });
    setClosedOut((prev) => {
      const rest = prev.filter((key) => !keys.includes(key));
      return next.checkOut ? rest : [...rest, ...keys].sort();
    });
  };

  const dayKeysFor = (column: number) =>
    rangeDays.filter((key) => columnOf(key) === column && inRule(key));

  const openDay = (key: string) => {
    const column = columnOf(key);
    setScope({
      kind: "day",
      label: `${WEEKDAY_LONG[column]} ${readableDay(key, lang)}`,
      meta: minNights ? fill(t.minNights, { count: minNights }) : "",
      weekday: WEEKDAY_LONG[column] ?? "",
      keys: [key],
    });
  };

  const openWeekday = (column: number) => {
    const keys = dayKeysFor(column);
    if (keys.length === 0) return;
    setScope({
      kind: "weekday",
      label: `${WEEKDAY_LONG[column]} · ${readableDay(startDate, lang)} – ${readableDay(endDate, lang)}`,
      meta: `${keys.length} × ${WEEKDAY_LONG[column]}`,
      keys,
    });
  };

  const save = () => {
    const keep = (keys: string[]) =>
      keys.filter((key) => key >= startDate && key <= endDate && inRule(key));
    const rule: RestrictionRule = {
      id: initial?.id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      roomId: roomId === "all" ? null : Number(roomId),
      startDate,
      endDate,
      minNights,
      appliesOn: weekendOnly ? "weekend_only" : "every_day",
      closedCheckIn: keep(closedIn),
      closedCheckOut: keep(closedOut),
      active,
    };
    const found = restrictionIssues(rule, term ?? { startDate: "", endDate: "" }, f.v);
    setIssues(found);
    if (found.length > 0) return;
    onSave?.(rule);
    onClose();
  };

  const weekendLabel =
    weekendDays.length > 0
      ? fill(t.weekendOnly, {
          days: WEEKDAYS.filter((day) => weekendSet.has(day))
            .map((day) => f.days[day])
            .join(lang === "ar" ? "، " : ", "),
        })
      : t.weekendNotSet;

  return (
    <Drawer
      width={DRAWER_WIDTH}
      overline={r.addTitle[k]}
      title={editing ? r.editTitle[k] : r.addTitle[k]}
      meta={r.addBody[k]}
      onClose={onClose}
      footer={
        <>
          {editing && onDelete && (
            <Button variant="ghost" onClick={onDelete}>
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              {r.deleteRule[k]}
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            {r.cancel[k]}
          </Button>
          <Button disabled={minIsZero} onClick={save}>
            {editing ? r.saveChanges[k] : r.save[k]}
          </Button>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <FieldLabel>{r.roomLabel[k]}</FieldLabel>
          <Select
            className="mt-1.5"
            value={roomId}
            onChange={(value) => setRoomId(value || "all")}
            options={[{ value: "all", label: t.roomPh }, ...rooms]}
          />
        </div>
        <div className="relative">
          <FieldLabel>{r.datesLabel[k]}</FieldLabel>
          <button
            type="button"
            onClick={() => setPicking((prev) => !prev)}
            className="mt-1.5 flex h-[42px] w-full items-center justify-between gap-2 rounded-[10px] border border-border-strong bg-surface-default px-3 text-start text-[13px] font-medium"
          >
            <span className={cn("truncate", hasRange ? "text-text-primary" : "text-text-muted")}>
              {hasRange
                ? `${readableDay(startDate, lang)} – ${readableDay(endDate, lang)}`
                : t.datesPh}
            </span>
            <CalendarDays className="h-3.5 w-3.5 shrink-0 text-text-muted" aria-hidden="true" />
          </button>
          {picking && (
            <div className="absolute start-0 z-50 mt-2 w-[393px] max-w-[calc(100vw-4rem)]">
              <DatePicker
                className="w-full"
                {...(hasRange ? { value: { start: startDate, end: endDate } } : {})}
                weekend={weekendDays.map((day) => JS_DAY.indexOf(day))}
                {...(term?.startDate ? { min: term.startDate } : {})}
                {...(term?.endDate ? { max: term.endDate } : {})}
                onCancel={() => setPicking(false)}
                onApply={(range) => {
                  setStartDate(range.start);
                  setEndDate(range.end ?? range.start);
                  setPicking(false);
                }}
              />
            </div>
          )}
        </div>
        <div>
          <FieldLabel>{r.minLabel[k]}</FieldLabel>
          <input
            value={minNights}
            inputMode="numeric"
            aria-label={r.minLabel[k]}
            placeholder={r.minPlaceholder[k]}
            onChange={(event) => {
              const next = event.target.value;
              if (/^\d{0,2}$/.test(next)) setMinNights(next);
            }}
            className={cn(
              "mt-1.5 h-[42px] w-full rounded-[10px] border bg-surface-default px-3 text-[13px] font-medium text-text-primary placeholder:font-normal placeholder:text-text-muted focus-visible:outline-none",
              minIsZero ? "border-status-danger" : "border-border-strong",
            )}
          />
        </div>
      </div>

      {minIsZero && (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <p className="text-[11.5px] leading-4 text-status-danger">{r.minError[k]}</p>
          <button
            type="button"
            onClick={() => setMinNights("2")}
            className="text-xs font-medium text-text-link hover:underline"
          >
            {r.minFix[k]}
          </button>
        </div>
      )}
      <p className="mt-2 text-[11px] leading-4 text-text-muted">
        {term?.startDate && term.endDate
          ? fill(t.termNote, {
              start: readableDay(term.startDate, lang),
              end: readableDay(term.endDate, lang),
            })
          : t.termMissing}
      </p>

      <div className="mt-5">
        <FieldLabel>{r.appliesLabel[k]}</FieldLabel>
        <div className="mt-1.5 flex gap-1 rounded-[10px] bg-status-neutral-bg p-1">
          {(
            [
              [false, r.everyDay[k]],
              [true, weekendLabel],
            ] as Array<[boolean, string]>
          ).map(([value, label]) => (
            <button
              key={String(value)}
              type="button"
              onClick={() => setWeekendOnly(value)}
              className={cn(
                "flex-1 rounded-lg py-2 text-center text-[12.5px] transition-colors",
                weekendOnly === value
                  ? "bg-surface-default font-medium text-brand-deep"
                  : "text-text-body hover:bg-surface-default/60",
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="mt-1.5 text-[11px] leading-4 text-text-muted">
          {weekendOnly ? r.weekendHint[k] : r.everyDayHint[k]}
        </p>
      </div>

      <div className="mt-5">
        <FieldLabel>{r.daysLabel[k]}</FieldLabel>
        <p className="mt-1.5 text-[11px] leading-4 text-text-muted">{r.daysHint[k]}</p>

        {!hasRange ? (
          <p className="mt-3 rounded-[12px] bg-surface-subtle px-3.5 py-6 text-center text-[12px] text-text-muted">
            {r.emptyCalendar[k]}
          </p>
        ) : (
          <>
            {months.length > MAX_MONTHS && (
              <p className="mt-3 text-[11.5px] text-text-muted">{t.tooLong}</p>
            )}
            {months.slice(0, MAX_MONTHS).map(({ year, month }) => {
              const first = new Date(year, month, 1);
              const total = new Date(year, month + 1, 0).getDate();
              const lead = (first.getDay() + 1) % 7;
              return (
                <div key={`${year}-${month}`} className="mt-3">
                  <p className="text-[12.5px] font-semibold text-text-primary">
                    {first.toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <div className="mt-2 grid grid-cols-7 gap-1.5">
                    {WEEKDAY_SHORT.map((day, column) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => openWeekday(column)}
                        className="pb-1 text-center text-[10px] font-medium text-text-muted hover:text-text-primary"
                      >
                        {day}
                        {weekendOnly && weekendSet.has(JS_DAY[(column + 6) % 7]!) && (
                          <span className="mt-0.5 block text-[8px] font-normal text-brand-deep">
                            {r.legendWeekend[k]}
                          </span>
                        )}
                      </button>
                    ))}
                    {Array.from({ length: lead }, (_, index) => (
                      <span key={`lead-${index}`} aria-hidden="true" />
                    ))}
                    {Array.from({ length: total }, (_, index) => index + 1).map((day) => {
                      const key = keyOf(new Date(year, month, day));
                      return (
                        <DayCell
                          key={key}
                          day={day}
                          state={stateOf(key)}
                          label={{ in: r.legendIn[k], out: r.legendOut[k] }}
                          outside={key < startDate || key > endDate || !inRule(key)}
                          onClick={() => openDay(key)}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
            <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[10px] text-text-muted">
              <span className="flex items-center gap-1.5">
                <span className={cn("rounded-md px-1.5 leading-[17px]", CHIP_OPEN)}>
                  {r.legendIn[k]}
                </span>
                {r.legendOpen[k]}
              </span>
              <span className="flex items-center gap-1.5">
                <span className={cn("rounded-md px-1.5 leading-[17px]", CHIP_CLOSED)}>
                  {r.legendIn[k]}
                </span>
                {r.legendClosed[k]}
              </span>
              <span>{r.legendTap[k]}</span>
            </div>
          </>
        )}
      </div>

      <div className="mt-5 border-t border-border-subtle pt-4">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[13px] font-medium text-text-primary">
              {active ? r.active[k] : r.inactive[k]}
            </p>
            <p className="mt-0.5 text-[11px] leading-4 text-text-muted">{r.activeHint[k]}</p>
          </div>
          <Switch checked={active} onCheckedChange={setActive} />
        </div>
      </div>

      {issues.length > 0 && (
        <ul className="mt-3 space-y-1">
          {issues.map((message) => (
            <li key={message} className="text-[12.5px] text-status-danger">
              {message}
            </li>
          ))}
        </ul>
      )}

      {scope && (
        <RestrictionDayDialog
          scope={scope}
          checkIn={!scope.keys.every((key) => closedIn.includes(key))}
          checkOut={!scope.keys.every((key) => closedOut.includes(key))}
          onClose={() => setScope(null)}
          onApply={(next) => {
            const keys =
              scope.kind === "day" && next.everyWeekday
                ? dayKeysFor(columnOf(scope.keys[0]!))
                : scope.keys;
            applyTo(keys, next);
          }}
        />
      )}
    </Drawer>
  );
}

/** OV 03.RSD — deleting a rule cannot be undone. */
export function DeleteRestrictionOverlay({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: () => void;
}) {
  const { lang } = useLanguage();
  const k = lang === "ar" ? "ar" : "en";
  const d = deleteRestrictionDialog;

  return (
    <IconModal
      tone="danger"
      icon={<Trash2 className="h-5 w-5" aria-hidden="true" />}
      overline=""
      title={d.title[k]}
      body={d.body[k]}
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            {d.cancel[k]}
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            {d.confirm[k]}
          </Button>
        </>
      }
    >
      <p className="text-[12.5px] leading-5 text-text-body">{d.note[k]}</p>
    </IconModal>
  );
}
