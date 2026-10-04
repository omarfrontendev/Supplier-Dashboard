import { useState } from "react";
import { CalendarDays, Trash2 } from "lucide-react";
import { Drawer, IconModal } from "@/components/layout/overlay";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  RestrictionDayDialog,
  type RestrictionScope,
} from "@/components/contracts/restriction-day-dialog";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  datePickerPanel,
  deleteRestrictionDialog,
  restrictionDrawer,
  type DayState,
} from "@/lib/restriction-overlay-data";

const DRAWER_WIDTH = "760px";

/** Whether a day takes check-ins and check-outs, drawn as two chips. */
const CHIP_OPEN = "bg-chip-open text-chip-open-fg";
const CHIP_CLOSED = "bg-chip-closed text-chip-closed-fg";

/** OV 03.RSB — a day in the range, with the two chips it carries. */
function DayCell({
  night,
  state,
  label,
  outside,
  onClick,
}: {
  night: number;
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
        <span className="text-[11.5px] text-border-strong">{night}</span>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[52px] flex-col gap-1 rounded-lg border border-border-default bg-surface-default px-2 py-1.5 text-start"
    >
      <span className="text-[11.5px] font-medium text-text-primary">
        {night}
      </span>
      <span className="flex gap-1">
        <span
          className={cn(
            "rounded-md px-1.5 text-[10px] leading-[17px]",
            inOpen ? CHIP_OPEN : CHIP_CLOSED
          )}
        >
          {label.in}
        </span>
        <span
          className={cn(
            "rounded-md px-1.5 text-[10px] leading-[17px]",
            outOpen ? CHIP_OPEN : CHIP_CLOSED
          )}
        >
          {label.out}
        </span>
      </span>
    </button>
  );
}

/** A small label above a field, the way the drawer draws every one. */
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-medium uppercase tracking-[0.04em] text-text-muted">
      {children}
    </p>
  );
}

function Box({
  value,
  muted = false,
  trailing,
}: {
  value: string;
  muted?: boolean;
  trailing?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "mt-1.5 flex items-center justify-between gap-2 rounded-[10px] border border-border-strong px-3 py-2.5 text-[13px] font-medium",
        muted ? "text-text-muted" : "text-text-primary",
        "bg-surface-default"
      )}
    >
      <span className="truncate">{value}</span>
      {trailing}
    </div>
  );
}

/** OV 03.RS / RSB / RSS / RSE / RSW / RSK — one rule, in every state. */
export function RestrictionDrawer({
  mode = "add",
  fromSeason = false,
  onClose,
  onDelete,
}: {
  mode?: "add" | "edit";
  /** OV 03.RSS — opened from a season, so the dates arrive filled. */
  fromSeason?: boolean;
  onClose: () => void;
  onDelete?: () => void;
}) {
  const { lang } = useLanguage();
  const k = lang === "ar" ? "ar" : "en";
  const r = restrictionDrawer;
  const editing = mode === "edit";

  const [dates, setDates] = useState(
    fromSeason ? "18 Feb - 09 Mar 2027" : editing ? "20 - 25 Sep 2026" : ""
  );
  const [minNights, setMinNights] = useState(editing ? "4" : "");
  const [weekendOnly, setWeekendOnly] = useState(false);
  const [active, setActive] = useState(!editing);
  const [picking, setPicking] = useState(false);
  const [days, setDays] = useState<Record<number, DayState>>({});
  /* OV 03.RSP1 - RSP6 — tapping a day, or a weekday name. */
  const [scope, setScope] = useState<RestrictionScope | null>(null);

  const hasRange = Boolean(dates);
  const minIsZero = minNights === "0";
  /* The drawn range runs 20 - 25 Sep; everything else is outside it. */
  const inRange = (night: number) => night >= 20 && night <= 25;
  const isWeekendDay = (index: number) => index === 5 || index === 6;
  /* 1 Sep 2026 is a Tuesday — the fourth column of a Saturday-first week. */
  const FIRST_COLUMN = 3;
  const columnOf = (night: number) => (FIRST_COLUMN + night - 1) % 7;

  const WEEKDAYS = k === "ar" ? r.weekdaysAr : r.weekdays;
  const LONG = k === "ar" ? r.weekdaysAr : r.weekdaysLong;
  const openDay = (night: number) =>
    setScope({
      kind: "day",
      label:
        k === "ar"
          ? `${WEEKDAYS[columnOf(night)]} ${night} سبتمبر ٢٠٢٦`
          : `${WEEKDAYS[columnOf(night)]} ${night} Sep 2026`,
      meta:
        k === "ar"
          ? `كل الغرف · ${minNights || "4"} ليالٍ كحد أدنى على هذه القاعدة`
          : `All rooms · min ${minNights || "4"} nights on this rule`,
      weekday: LONG[columnOf(night)] ?? "",
    });

  const openWeekday = (index: number) =>
    setScope({
      kind: "weekday",
      label:
        k === "ar"
          ? `كل ${LONG[index]} · ${dates}`
          : `Every ${LONG[index]} · ${dates}`,
      meta:
        k === "ar"
          ? `${LONG[index]} واحد في هذا النطاق`
          : `1 ${LONG[index]} in this range`,
    });

  /** What the popover's two switches leave the day in. */
  const applyDay = (
    night: number,
    next: { checkIn: boolean; checkOut: boolean }
  ) =>
    setDays((prev) => ({
      ...prev,
      [night]: next.checkIn
        ? next.checkOut
          ? "open"
          : "noOut"
        : next.checkOut
          ? "noIn"
          : "closed",
    }));

  return (
    <Drawer
      width={DRAWER_WIDTH}
      overline={r.overline[k]}
      title={editing ? r.editTitle[k] : r.addTitle[k]}
      meta={editing ? r.editBody[k] : r.addBody[k]}
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
          <Button disabled={minIsZero} onClick={onClose}>
            {editing ? r.saveChanges[k] : r.save[k]}
          </Button>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <FieldLabel>{r.roomLabel[k]}</FieldLabel>
          <Box value={editing ? "Deluxe Room City View" : r.allRooms[k]} />
        </div>
        <div>
          <FieldLabel>{r.datesLabel[k]}</FieldLabel>
          <button
            type="button"
            onClick={() => setPicking(true)}
            className="w-full text-start"
          >
            <Box
              value={dates || r.datesPlaceholder[k]}
              muted={!dates}
              trailing={
                <CalendarDays
                  className="h-3.5 w-3.5 shrink-0 text-text-muted"
                  aria-hidden="true"
                />
              }
            />
          </button>
        </div>
        <div>
          <FieldLabel>{r.minLabel[k]}</FieldLabel>
          <input
            value={minNights}
            placeholder={r.minPlaceholder[k]}
            onChange={(event) => setMinNights(event.target.value)}
            className={cn(
              "mt-1.5 h-[42px] w-full rounded-[10px] border bg-surface-default px-3 text-[13px] font-medium text-text-primary placeholder:font-normal placeholder:text-text-muted focus-visible:outline-none",
              minIsZero ? "border-status-danger" : "border-border-strong"
            )}
          />
        </div>
      </div>

      {/* OV 03.RSK — a one-night minimum is no rule at all. */}
      {minIsZero && (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <p className="text-[11.5px] leading-4 text-status-danger">
            {r.minError[k]}
          </p>
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
        {fromSeason ? r.seasonNote[k] : r.termNote[k]}
      </p>

      <div className="mt-5">
        <FieldLabel>{r.appliesLabel[k]}</FieldLabel>
        <div className="mt-1.5 flex gap-1 rounded-[10px] bg-status-neutral-bg p-1">
          {(
            [
              [false, r.everyDay[k]],
              [true, r.weekendOnly[k]],
            ] as Array<[boolean, string]>
          ).map(([value, label]) => (
            <button
              key={label}
              type="button"
              onClick={() => setWeekendOnly(value)}
              className={cn(
                "flex-1 rounded-lg py-2 text-center text-[12.5px] transition-colors",
                weekendOnly === value
                  ? "bg-surface-default font-medium text-brand-deep"
                  : "text-text-body hover:bg-surface-default/60"
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
        <p className="mt-1.5 text-[11px] leading-4 text-text-muted">
          {r.daysHint[k]}
        </p>

        {!hasRange ? (
          <p className="mt-3 rounded-[12px] bg-surface-subtle px-3.5 py-6 text-center text-[12px] text-text-muted">
            {r.emptyCalendar[k]}
          </p>
        ) : (
          <div className="mt-3">
            <p className="text-[12.5px] font-semibold text-text-primary">
              {r.month[k]}
            </p>
            <div className="mt-2 grid grid-cols-7 gap-1.5">
              {(k === "ar" ? r.weekdaysAr : r.weekdays).map((day, index) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => openWeekday(index)}
                  className="pb-1 text-center text-[10px] font-medium text-text-muted hover:text-text-primary"
                >
                  {day}
                  {weekendOnly && isWeekendDay(index) && (
                    <span className="mt-0.5 block text-[8px] font-normal text-brand-deep">
                      {r.legendWeekend[k]}
                    </span>
                  )}
                </button>
              ))}
              {Array.from({ length: FIRST_COLUMN }, (_, index) => (
                <span key={`lead-${index}`} aria-hidden="true" />
              ))}
              {Array.from({ length: 30 }, (_, index) => index + 1).map(
                (night) => (
                  <DayCell
                    key={night}
                    night={night}
                    state={days[night] ?? "open"}
                    label={{ in: r.legendIn[k], out: r.legendOut[k] }}
                    outside={
                      !inRange(night) ||
                      (weekendOnly && !isWeekendDay(columnOf(night)))
                    }
                    onClick={() => openDay(night)}
                  />
                )
              )}
            </div>
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
          </div>
        )}
      </div>

      {/* OV 03.RSB / RSW — what this rule takes over from an older one. */}
      {hasRange && (
        <p className="mt-3 rounded-[10px] border border-notice-border bg-notice px-3.5 py-3 text-[11.5px] leading-5 text-text-body">
          {weekendOnly ? r.replacesWeekend[k] : r.replaces[k]}
        </p>
      )}

      <div className="mt-5 border-t border-border-subtle pt-4">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[13px] font-medium text-text-primary">
              {active ? r.active[k] : r.inactive[k]}
            </p>
            <p className="mt-0.5 text-[11px] leading-4 text-text-muted">
              {r.activeHint[k]}
            </p>
          </div>
          <Switch checked={active} onCheckedChange={setActive} />
        </div>
      </div>

      {scope && (
        <RestrictionDayDialog
          scope={scope}
          onClose={() => setScope(null)}
          onApply={(next) => {
            if (scope.kind === "day") {
              const night = Number(scope.label.match(/\d+/)?.[0] ?? 0);
              if (night) applyDay(night, next);
            }
          }}
        />
      )}

      {picking && (
        <DatePickerOverlay
          onClose={() => setPicking(false)}
          onApply={() => {
            setDates("20 - 25 Sep 2026");
            setPicking(false);
          }}
        />
      )}
    </Drawer>
  );
}

/** OV 03.RSDP — the range picker that fills the Dates field. */
export function DatePickerOverlay({
  onClose,
  onApply,
}: {
  onClose: () => void;
  onApply: () => void;
}) {
  const { lang } = useLanguage();
  const k = lang === "ar" ? "ar" : "en";
  const p = datePickerPanel;

  return (
    <IconModal
      width="520px"
      icon={<CalendarDays className="h-5 w-5" aria-hidden="true" />}
      overline=""
      title={p.title[k]}
      body={p.picked[k]}
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            {restrictionDrawer.cancel[k]}
          </Button>
          <Button onClick={onApply}>{p.apply[k]}</Button>
        </>
      }
    >
      <div className="rounded-[12px] bg-surface-subtle p-3.5">
        <p className="text-[12.5px] font-semibold text-text-primary">
          {p.month[k]}
        </p>
        <div className="mt-2 grid grid-cols-7 gap-1">
          {(k === "ar" ? p.weekdaysAr : p.weekdays).map((day) => (
            <span
              key={day}
              className="text-center text-[10px] font-semibold text-text-muted"
            >
              {day}
            </span>
          ))}
          {Array.from({ length: 30 }, (_, index) => index + 1).map((night) => {
            const picked = night >= 20 && night <= 25;
            return (
              <span
                key={night}
                className={cn(
                  "rounded py-1 text-center text-[10px] font-semibold",
                  picked
                    ? "bg-brand-deep text-primary"
                    : "bg-surface-default text-text-secondary"
                )}
              >
                {night}
              </span>
            );
          })}
        </div>
      </div>
      <p className="text-[11px] leading-4 text-text-muted">{p.note[k]}</p>
    </IconModal>
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
