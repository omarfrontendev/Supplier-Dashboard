import { useState } from "react";
import { AlertTriangle, CalendarDays, Trash2 } from "lucide-react";
import { Drawer, IconModal } from "@/components/layout/overlay";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { DatePicker } from "@/components/ui/date-picker";
import { readableDay } from "@/components/ui/date-field";
import {
  conflictingRestriction,
  restrictionConflict,
  restrictionIssues,
} from "@/components/contracts/contract-form/schema";
import { fill, useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { deleteRestrictionDialog, restrictionDrawer } from "@/lib/restriction-overlay-data";
import {
  WEEKDAY_NUMBER,
  WEEKDAYS,
  RESTRICTION_MAX_NIGHTS,
  type RestrictionRule,
  type Weekday,
} from "@/store/features/contracts/types";

const DRAWER_WIDTH = "760px";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-medium uppercase tracking-[0.04em] text-text-muted">
      {children}
    </p>
  );
}

function DayChips({
  label,
  closed,
  onToggle,
}: {
  label: string;
  closed: Weekday[];
  onToggle: (day: Weekday) => void;
}) {
  const { c } = useLanguage();
  const days = c.builder.form.days;
  return (
    <div className="mt-3">
      <p className="text-[12.5px] font-medium text-text-primary">{label}</p>
      <div className="mt-1.5 flex flex-wrap gap-1.5" role="group" aria-label={label}>
        {WEEKDAYS.map((day) => {
          const on = closed.includes(day);
          return (
            <button
              key={day}
              type="button"
              aria-pressed={on}
              onClick={() => onToggle(day)}
              className={cn(
                "min-w-[52px] rounded-lg border px-3 py-1.5 text-[12.5px] transition-colors",
                on
                  ? "border-status-danger/40 bg-status-danger-bg font-medium text-status-danger"
                  : "border-border-default text-text-body hover:bg-surface-subtle",
              )}
            >
              {days[day]}
            </button>
          );
        })}
      </div>
    </div>
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
  others = [],
  describe = (rule) => `${rule.startDate} - ${rule.endDate}`,
  onConflict,
  onSave,
  onClose,
  onDelete,
}: {
  mode?: "add" | "edit";
  initial?: RestrictionRule | null;
  rooms?: RestrictionRoomOption[];
  term?: { startDate: string; endDate: string };
  weekendDays?: Weekday[];
  others?: RestrictionRule[];
  describe?: (rule: RestrictionRule) => string;
  onConflict?: (id: string) => void;
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
  const [closedIn, setClosedIn] = useState<Weekday[]>(initial?.closedCheckIn ?? []);
  const [closedOut, setClosedOut] = useState<Weekday[]>(initial?.closedCheckOut ?? []);
  const [picking, setPicking] = useState(false);
  const [issues, setIssues] = useState<string[]>([]);
  const [confirmClose, setConfirmClose] = useState(false);
  const [closing, setClosing] = useState(false);
  const closeSmoothly = () => {
    setConfirmClose(false);
    setClosing(true);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(onClose, reduced ? 0 : 200);
  };

  const hasRange = Boolean(startDate && endDate);
  const hasTerm = Boolean(term?.startDate && term.endDate);
  const weekendSet = new Set(weekendDays);
  const toggle = (list: Weekday[], day: Weekday) =>
    list.includes(day) ? list.filter((item) => item !== day) : [...list, day];
  const ordered = (list: Weekday[]) => WEEKDAYS.filter((day) => list.includes(day));

  const draftRule = (): RestrictionRule => ({
    id: initial?.id ?? "",
    roomId: roomId === "all" ? null : Number(roomId),
    startDate,
    endDate,
    minNights,
    appliesOn: weekendOnly ? "weekend_only" : "every_day",
    closedCheckIn: ordered(closedIn),
    closedCheckOut: ordered(closedOut),
    active,
  });
  const snapshot = (rule: RestrictionRule) =>
    JSON.stringify({ ...rule, id: "" });
  const [startSnapshot] = useState(() =>
    snapshot(
      initial ?? {
        id: "",
        roomId: null,
        startDate: "",
        endDate: "",
        minNights: "",
        appliesOn: "every_day",
        closedCheckIn: [],
        closedCheckOut: [],
        active: true,
      },
    ),
  );
  const dirty = snapshot(draftRule()) !== startSnapshot;
  const requestClose = () => (dirty ? setConfirmClose(true) : closeSmoothly());

  const save = () => {
    const rule: RestrictionRule = {
      id: initial?.id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      roomId: roomId === "all" ? null : Number(roomId),
      startDate,
      endDate,
      minNights,
      appliesOn: weekendOnly ? "weekend_only" : "every_day",
      closedCheckIn: ordered(closedIn),
      closedCheckOut: ordered(closedOut),
      active,
    };
    const found = restrictionIssues(
      rule,
      term ?? { startDate: "", endDate: "" },
      f.v,
      (day) => readableDay(day, lang),
    );
    const conflict = restrictionConflict(rule, others, f.v, describe);
    if (conflict) {
      found.push(conflict);
      const other = conflictingRestriction(rule, others);
      if (other) onConflict?.(other.rule.id);
    }
    setIssues(found);
    if (found.length > 0) return;
    onSave?.(rule);
    closeSmoothly();
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
      overline={t.overline}
      title={editing ? r.editTitle[k] : r.addTitle[k]}
      meta={t.body}
      onClose={closeSmoothly}
      closing={closing}
      dirty={dirty}
      onGuard={() => setConfirmClose(true)}
      footer={
        <>
          {editing && onDelete && (
            <Button variant="ghost" onClick={onDelete}>
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              {r.deleteRule[k]}
            </Button>
          )}
          <Button variant="outline" onClick={requestClose}>
            {r.cancel[k]}
          </Button>
          <Button onClick={save}>{editing ? r.saveChanges[k] : r.save[k]}</Button>
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
          {hasTerm && (
            <button
              type="button"
              onClick={() => {
                setStartDate(term!.startDate);
                setEndDate(term!.endDate);
                setPicking(false);
              }}
              className="mt-1.5 text-xs font-medium text-text-link hover:underline"
            >
              {t.wholeContract}
            </button>
          )}
          {picking && (
            <div className="absolute start-0 z-50 mt-2 w-[393px] max-w-[calc(100vw-4rem)]">
              <DatePicker
                className="w-full"
                {...(hasRange ? { value: { start: startDate, end: endDate } } : {})}
                weekend={weekendDays.map((day) => WEEKDAY_NUMBER[day])}
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
              if (/^\d{0,3}$/.test(next) && Number(next || 0) <= RESTRICTION_MAX_NIGHTS) {
                setMinNights(next);
              }
            }}
            className="mt-1.5 h-[42px] w-full rounded-[10px] border border-border-strong bg-surface-default px-3 text-[13px] font-medium text-text-primary placeholder:font-normal placeholder:text-text-muted focus-visible:outline-none"
          />
        </div>
      </div>

      <p className="mt-2 text-[11px] leading-4 text-text-muted">
        {hasTerm
          ? fill(t.termNote, {
              start: readableDay(term!.startDate, lang),
              end: readableDay(term!.endDate, lang),
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
        <p className="mt-1.5 text-[11px] leading-4 text-text-muted">{t.closedHint}</p>
        <DayChips
          label={t.closedInLabel}
          closed={closedIn}
          onToggle={(day) => setClosedIn((prev) => toggle(prev, day))}
        />
        <DayChips
          label={t.closedOutLabel}
          closed={closedOut}
          onToggle={(day) => setClosedOut((prev) => toggle(prev, day))}
        />
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

      {confirmClose && (
        <IconModal
          tone="danger"
          icon={<AlertTriangle className="h-5 w-5" aria-hidden="true" />}
          overline={t.overline}
          title={t.discardTitle}
          body={t.discardBody}
          onClose={() => setConfirmClose(false)}
          footer={
            <>
              <Button variant="outline" onClick={() => setConfirmClose(false)}>
                {t.keepEditing}
              </Button>
              <Button variant="destructive" onClick={closeSmoothly}>
                {t.discard}
              </Button>
            </>
          }
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
