import { useState } from "react";
import { AlertTriangle, Building2, CalendarDays, Coins, Info, Save } from "lucide-react";
import { IconModal } from "@/components/layout/overlay";
import { Button } from "@/components/ui/button";
import { DateField, arabicDigits } from "@/components/ui/date-field";
import { dateOf } from "@/components/ui/date-picker";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  currencyPanel,
  hotelPickerPanel,
  overlapPanel,
  termPanel,
  unsavedPanel,
  weekendPanel,
  type OverlapDay,
  type PickerPanel,
} from "@/lib/contract-overlay-data";

/** The radio row OV 03.1P and OV 03.1R both use. */
function OptionRow({
  label,
  hint,
  on,
  onSelect,
}: {
  label: string;
  hint: string;
  on: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-start gap-3 rounded-xl border px-3.5 py-3 text-start transition-colors",
        on
          ? "border-primary-subtle-border bg-primary-subtle"
          : "border-border-subtle hover:bg-surface-subtle"
      )}
    >
      <span
        className={cn(
          "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border bg-surface-default",
          on ? "border-brand-deep" : "border-border-strong"
        )}
      >
        {on && (
          <span className="h-2 w-2 rounded-full bg-brand-deep" aria-hidden="true" />
        )}
      </span>
      <span className="min-w-0">
        <span className="block text-[13px] font-medium text-text-primary">
          {label}
        </span>
        <span className="mt-0.5 block text-[11.5px] leading-4 text-text-muted">
          {hint}
        </span>
      </span>
    </button>
  );
}

/** OV 03.1P / OV 03.1R — pick one of a short, explained list. */
export function PickerOverlay({
  panel,
  icon,
  onClose,
  onConfirm,
}: {
  panel: PickerPanel;
  icon: "hotel" | "currency";
  onClose: () => void;
  /** The row the supplier actually picked, not always the first one. */
  onConfirm: (index: number) => void;
}) {
  const { lang } = useLanguage();
  const ar = lang === "ar";
  const [picked, setPicked] = useState(0);

  return (
    <IconModal
      icon={
        icon === "hotel" ? (
          <Building2 className="h-5 w-5" aria-hidden="true" />
        ) : (
          <Coins className="h-5 w-5" aria-hidden="true" />
        )
      }
      overline={ar ? panel.overlineAr : panel.overline}
      title={ar ? panel.titleAr : panel.title}
      body={ar ? panel.bodyAr : panel.body}
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            {ar ? panel.cancelAr : panel.cancel}
          </Button>
          <Button onClick={() => onConfirm(picked)}>
            {ar ? panel.confirmAr : panel.confirm}
          </Button>
        </>
      }
    >
      <div className="space-y-2">
        {panel.options.map((option, index) => (
          <OptionRow
            key={option.label}
            label={ar ? option.labelAr : option.label}
            hint={ar ? option.hintAr : option.hint}
            on={index === picked}
            onSelect={() => setPicked(index)}
          />
        ))}
      </div>
      {panel.note && (
        <p className="flex items-start gap-2 text-[11.5px] leading-4 text-text-muted">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {ar ? panel.noteAr : panel.note}
        </p>
      )}
    </IconModal>
  );
}

/** OV 03.1Q / Q2 / Q3 — the term, the bad end date, and the overlap. */
export function TermOverlay({
  state = "ok",
  onClose,
  onConfirm,
}: {
  state?: "ok" | "error" | "overlap";
  onClose: () => void;
  onConfirm: () => void;
}) {
  const { lang } = useLanguage();
  const ar = lang === "ar";
  const p = termPanel;
  /* The dates are the supplier's to set, so they are held, not printed. */
  const [start, setStart] = useState("2026-09-01");
  const [end, setEnd] = useState(state === "error" ? "2026-08-15" : "2027-08-31");
  const bad = state === "error" || end < start;
  const nights =
    Math.round(
      (dateOf(end).getTime() - dateOf(start).getTime()) / 86_400_000
    ) + 1;

  const usePreset = (preset: (typeof p.presets)[number]) => {
    if (preset.months) {
      const from = dateOf(start);
      const to = new Date(
        from.getFullYear(),
        from.getMonth() + preset.months,
        from.getDate() - 1
      );
      setEnd(
        `${to.getFullYear()}-${String(to.getMonth() + 1).padStart(2, "0")}-${String(to.getDate()).padStart(2, "0")}`
      );
      return;
    }
    if (preset.start && preset.end) {
      setStart(preset.start);
      setEnd(preset.end);
    }
  };

  return (
    <IconModal
      icon={<CalendarDays className="h-5 w-5" aria-hidden="true" />}
      overline={ar ? p.overlineAr : p.overline}
      title={ar ? p.titleAr : p.title}
      body={ar ? p.bodyAr : p.body}
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            {ar ? p.cancelAr : p.cancel}
          </Button>
          <Button disabled={bad} onClick={onConfirm}>
            {state === "overlap"
              ? ar
                ? p.confirmOverlapAr
                : p.confirmOverlap
              : ar
                ? p.confirmAr
                : p.confirm}
          </Button>
        </>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <DateField
          label={ar ? p.startLabelAr : p.startLabel}
          value={start}
          onChange={setStart}
        />
        <div>
          <DateField
            label={ar ? p.endLabelAr : p.endLabel}
            value={end}
            onChange={setEnd}
            invalid={bad}
          />
          {bad && (
            <p className="mt-1 text-[11.5px] text-status-danger">
              {ar ? p.errorAr : p.error}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {p.presets.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => usePreset(preset)}
            className="rounded-lg bg-status-neutral-bg px-3 py-1.5 text-xs font-medium text-brand-deep transition-colors hover:bg-border-default"
          >
            {ar ? preset.labelAr : preset.label}
          </button>
        ))}
      </div>

      {state === "overlap" && (
        <div className="rounded-xl border border-status-warning/25 bg-status-warning-bg p-3.5">
          <p className="text-sm font-semibold text-status-warning">
            {ar ? p.overlapTitleAr : p.overlapTitle}
          </p>
          <p className="mt-1 text-[12.5px] leading-5 text-text-secondary">
            {ar ? p.overlapBodyAr : p.overlapBody}
          </p>
        </div>
      )}

      <p className="text-[11.5px] leading-4 text-text-muted">
        {bad
          ? ar
            ? p.errorNoteAr
            : p.errorNote
          : (ar ? p.noteAr : p.note).replace(
              "{nights}",
              ar ? arabicDigits(nights, true) : String(nights)
            )}
      </p>
    </IconModal>
  );
}

/** OV 03.1S — the two nights that carry the weekend price. */
export function WeekendOverlay({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: () => void;
}) {
  const { lang } = useLanguage();
  const ar = lang === "ar";
  const p = weekendPanel;
  const [picked, setPicked] = useState<string[]>([...p.selected]);

  return (
    <IconModal
      icon={<CalendarDays className="h-5 w-5" aria-hidden="true" />}
      overline={ar ? p.overlineAr : p.overline}
      title={ar ? p.titleAr : p.title}
      body={ar ? p.bodyAr : p.body}
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            {ar ? p.cancelAr : p.cancel}
          </Button>
          <Button onClick={onConfirm}>{ar ? p.confirmAr : p.confirm}</Button>
        </>
      }
    >
      <div className="flex flex-wrap gap-2">
        {p.days.map((day) => {
          const on = picked.includes(day.label);
          return (
            <button
              key={day.label}
              type="button"
              onClick={() =>
                setPicked((prev) =>
                  prev.includes(day.label)
                    ? prev.filter((x) => x !== day.label)
                    : [...prev, day.label]
                )
              }
              className={cn(
                "min-w-[62px] rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                on
                  ? "border-brand-deep bg-brand-deep text-primary"
                  : "border-border-strong bg-surface-default text-text-primary hover:bg-surface-subtle"
              )}
            >
              {ar ? day.labelAr : day.label}
            </button>
          );
        })}
      </div>
      <p className="text-[11.5px] leading-4 text-text-muted">
        {ar ? p.noteAr : p.note}
      </p>
    </IconModal>
  );
}

/** OV 03.11 — leaving a contract that was never live. */
export function UnsavedOverlay({
  onClose,
  onDiscard,
  onSave,
}: {
  onClose: () => void;
  onDiscard: () => void;
  onSave: () => void;
}) {
  const { lang } = useLanguage();
  const ar = lang === "ar";
  const p = unsavedPanel;

  return (
    <IconModal
      icon={<Save className="h-5 w-5" aria-hidden="true" />}
      overline={ar ? p.overlineAr : p.overline}
      title={ar ? p.titleAr : p.title}
      body={ar ? p.bodyAr : p.body}
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onDiscard}>
            {ar ? p.discardAr : p.discard}
          </Button>
          <Button variant="outline" onClick={onClose}>
            {ar ? p.keepAr : p.keep}
          </Button>
          <Button onClick={onSave}>{ar ? p.saveAr : p.save}</Button>
        </>
      }
    >
      <></>
    </IconModal>
  );
}

const DAY_TONE: Record<OverlapDay, string> = {
  ramadan: "bg-cell-draft-bg text-cell-draft",
  overlap: "bg-cell-conflict-bg text-status-danger",
  locked: "bg-cell-locked-bg text-text-muted",
  free: "bg-surface-default text-text-secondary",
};

/** OV 03.13 — the nights that already belong to another season. */
export function SeasonOverlapOverlay({
  onClose,
  onUseDates,
}: {
  onClose: () => void;
  onUseDates: () => void;
}) {
  const { lang } = useLanguage();
  const ar = lang === "ar";
  const p = overlapPanel;
  const nights = Array.from({ length: 31 }, (_, index) => index + 1);

  return (
    <IconModal
      icon={<AlertTriangle className="h-5 w-5" aria-hidden="true" />}
      tone="danger"
      overline={ar ? p.overlineAr : p.overline}
      title={ar ? p.titleAr : p.title}
      body={ar ? p.bodyAr : p.body}
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            {ar ? p.cancelAr : p.cancel}
          </Button>
          {/* BR-00-22 - off because the dates overlap; the panel says so. */}
          <Button
            disabled
            reason={ar ? p.bodyAr : p.body}
          >
            {ar ? p.confirmAr : p.confirm}
          </Button>
        </>
      }
    >
      <div className="rounded-xl bg-surface-subtle p-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold text-text-primary">
            {ar ? p.monthAr : p.month}
          </p>
          <p className="text-[11.5px] text-text-muted">
            {ar ? p.pickedAr : p.picked}
          </p>
        </div>
        <div className="mt-2 grid grid-cols-7 gap-1">
          {(ar ? p.weekdaysAr : p.weekdays).map((day) => (
            <span
              key={day}
              className="text-center text-[10px] font-semibold text-text-muted"
            >
              {day}
            </span>
          ))}
          {nights.map((night) => {
            const kind = p.dayKind(night);
            return (
              <span
                key={night}
                className={cn(
                  "rounded px-1 py-1 text-center",
                  DAY_TONE[kind]
                )}
              >
                <span className="block text-[10px] font-semibold">
                  {String(night).padStart(2, "0")}
                </span>
                {kind !== "free" && (
                  <span className="mt-0.5 block truncate text-[8px] leading-3">
                    {ar ? p.dayLabelAr[kind] : p.dayLabel[kind]}
                  </span>
                )}
              </span>
            );
          })}
        </div>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
          {p.legend.map((item) => (
            <span
              key={item.label}
              className="flex items-center gap-1.5 text-[10px] text-text-muted"
            >
              <span
                className={cn("h-2.5 w-2.5 rounded", DAY_TONE[item.kind])}
                aria-hidden="true"
              />
              {ar ? item.labelAr : item.label}
            </span>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[10px] font-medium uppercase tracking-[0.04em] text-text-muted">
          {ar ? p.fixLabelAr : p.fixLabel}
        </p>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          {p.fixes.map((fix, index) => (
            <div
              key={fix.title}
              className="rounded-xl border border-border-subtle p-3.5"
            >
              <p className="text-[13px] font-semibold text-text-primary">
                {ar ? fix.titleAr : fix.title}
              </p>
              <p className="mt-1 text-[11.5px] leading-4 text-text-muted">
                {ar ? fix.bodyAr : fix.body}
              </p>
              <button
                type="button"
                onClick={index === 0 ? onUseDates : onClose}
                className="mt-2 text-xs font-medium text-text-link hover:underline"
              >
                {ar ? fix.actionAr : fix.action}
              </button>
            </div>
          ))}
        </div>
      </div>

      <p className="text-[11.5px] text-text-muted">{ar ? p.noteAr : p.note}</p>
    </IconModal>
  );
}

export { hotelPickerPanel, currencyPanel };
