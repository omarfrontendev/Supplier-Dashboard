import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";
import { panelMotion, scrimMotion, useDismiss } from "@/components/layout/overlay";

/**
 * Restriction day and weekday actions — Figma OV 03.RSP1 … OV 03.RSP6.
 * A single day, or every matching weekday in the range, with check-in and
 * check-out opened or closed. Drawn as a 340-wide popover, not a modal.
 */
export type RestrictionScope =
  | { kind: "day"; label: string; meta: string; weekday: string; closedBy?: string }
  | { kind: "weekday"; label: string; meta: string };

export function RestrictionDayDialog({
  scope,
  checkIn = true,
  checkOut = true,
  onClose,
  onApply,
}: {
  scope: RestrictionScope;
  checkIn?: boolean;
  checkOut?: boolean;
  onClose: () => void;
  onApply?: (next: {
    checkIn: boolean;
    checkOut: boolean;
    everyWeekday: boolean;
  }) => void;
}) {
  const { lang, dir } = useLanguage();
  const dismiss = useDismiss({ onClose });
  const ar = lang === "ar";
  const [arrivals, setArrivals] = useState(checkIn);
  const [departures, setDepartures] = useState(checkOut);
  const [everyWeekday, setEveryWeekday] = useState(false);

  const t = ar
    ? {
        checkIn: "الوصول",
        checkOut: "المغادرة",
        openIn: "يمكن للنزلاء الوصول في هذا اليوم",
        closedIn: "مغلق - لا وصول",
        openOut: "يمكن للنزلاء المغادرة في هذا اليوم",
        closedOut: "مغلق - لا مغادرة",
        every: "طبّق الشيء نفسه على كل {weekday} في هذا النطاق",
        everyOn: "طبّق الشيء نفسه على كل {weekday} في هذا النطاق · ينطبق على كل {weekday}",
        weekdayNote:
          "ينطبق على كل {weekday} في النطاق. والتاريخ الذي تضبطه بمفرده يحتفظ بإعداده.",
        cancel: "إلغاء",
        apply: "تطبيق",
      }
    : {
        checkIn: "Check-in",
        checkOut: "Check-out",
        openIn: "Guests can arrive on this day",
        closedIn: "Closed - no arrivals",
        openOut: "Guests can leave on this day",
        closedOut: "Closed - no departures",
        every: "Do the same on every {weekday} in this range",
        everyOn:
          "Do the same on every {weekday} in this range · applies to every {weekday}",
        weekdayNote:
          "Applies to every {weekday} in the range. A date you set on its own keeps its own setting.",
        cancel: "Cancel",
        apply: "Apply",
      };

  const weekday = scope.kind === "day" ? scope.weekday : "";

  return (
    <div
      dir={dir}
      {...dismiss.scrim}
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-brand-deep/40 p-4",
        scrimMotion
      )}
    >
      <div
        {...dismiss.panel}
        className={cn(
          "w-full max-w-[340px] space-y-3 rounded-[14px] border border-border-default bg-surface-default p-2 shadow-overlay",
          panelMotion
        )}
      >
        <div className="px-1 pt-1">
          <p className="text-sm font-semibold text-text-primary">
            {scope.label}
          </p>
          <p className="mt-0.5 text-[11px] text-text-muted">{scope.meta}</p>
        </div>

        <Toggle
          label={t.checkIn}
          value={arrivals}
          onChange={setArrivals}
          openText={t.openIn}
          closedText={t.closedIn}
        />
        <Toggle
          label={t.checkOut}
          value={departures}
          onChange={setDepartures}
          openText={t.openOut}
          closedText={t.closedOut}
        />

        {/* OV 03.RSP3 — a day the weekday rule already shut. */}
        {scope.kind === "day" && scope.closedBy ? (
          <p className="rounded-[10px] border border-notice-border bg-notice px-3 py-2.5 text-[11.5px] leading-4 text-text-body">
            {scope.closedBy}
          </p>
        ) : scope.kind === "day" ? (
          <label className="flex cursor-pointer items-start gap-2 px-1">
            <input
              type="checkbox"
              checked={everyWeekday}
              onChange={(event) => setEveryWeekday(event.target.checked)}
              className="mt-0.5 h-[18px] w-[18px] rounded-[5px] accent-[var(--brand-deep)]"
            />
            <span className="text-[12px] leading-4 text-text-primary">
              {(everyWeekday ? t.everyOn : t.every).replaceAll(
                "{weekday}",
                weekday
              )}
            </span>
          </label>
        ) : (
          <p className="px-1 text-[12px] leading-4 text-text-muted">
            {t.weekdayNote.replaceAll(
              "{weekday}",
              scope.label.split("·")[0]?.replace(/every/i, "").trim() ?? ""
            )}
          </p>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="outline" onClick={onClose}>
            {t.cancel}
          </Button>
          <Button
            onClick={() => {
              onApply?.({
                checkIn: arrivals,
                checkOut: departures,
                everyWeekday,
              });
              onClose();
            }}
          >
            {t.apply}
          </Button>
        </div>
      </div>
    </div>
  );
}

/** A row on a tinted card: what the day allows, and the switch for it. */
function Toggle({
  label,
  value,
  onChange,
  openText,
  closedText,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  openText: string;
  closedText: string;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-[10px] bg-surface-subtle px-3 py-2.5">
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-medium text-text-primary">{label}</p>
        <p
          className={cn(
            "mt-px text-[11px]",
            value ? "text-text-body" : "text-status-danger"
          )}
        >
          {value ? openText : closedText}
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        aria-label={label}
        onClick={() => onChange(!value)}
        className={cn(
          "relative h-5 w-9 shrink-0 rounded-full transition-colors",
          value ? "bg-brand-deep" : "bg-border-strong"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all",
            value ? "start-[18px]" : "start-0.5"
          )}
        />
      </button>
    </div>
  );
}
