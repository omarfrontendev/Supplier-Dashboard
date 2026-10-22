import { useState } from "react";
import { Check, ChevronRight } from "lucide-react";
import { IconModal } from "@/components/layout/overlay";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { ConfirmPanel, ListPanel } from "@/lib/contract-overlay-data";
import { ContractPeriod } from "@/api/modules/hotel-contract/types";
import { DayField } from "@/routes/rate-calendar";

/**
 * OV 03.0G / 03.0L / 03.23B — a filter panel: grouped options, each with
 * what it would show, a note explaining the default, and Clear / Apply.
 */

export interface ContractListFilterValues {
  periods: ContractPeriod[];
  dateFrom: string;
  dateTo: string;
  sortBy: string | undefined;
}

export interface ContractSortOption {
  value: string;
  label: string;
  labelAr: string;
  hint?: string;
  hintAr?: string;
}

const DEFAULT_SORT_OPTIONS: ContractSortOption[] = [
  {
    value: "ending_soonest",
    label: "Ending soonest",
    labelAr: "الأقرب انتهاءً",
    hint: "The one that needs you first",
    hintAr: "العقد الذي يحتاج إلى اهتمامك أولًا",
  },
  {
    value: "newest_first",
    label: "Newest first",
    labelAr: "الأحدث أولًا",
  },
  {
    value: "hotel_name",
    label: "Hotel name",
    labelAr: "اسم الفندق",
  },
];

export function FilterPanel({
  panel,
  onClose,
  initialFilters,
  onApplyFilters,
  sortOptions = DEFAULT_SORT_OPTIONS,
}: {
  panel: ListPanel;
  onClose: () => void;
  initialFilters?: ContractListFilterValues;
  onApplyFilters?: (filters: ContractListFilterValues) => void;
  sortOptions?: ContractSortOption[];
}) {
  const { lang } = useLanguage();
  const ar = lang === "ar";

  const [periods, setPeriods] = useState<ContractPeriod[]>(
    initialFilters?.periods ?? ["everything"],
  );

  const [sortBy, setSortBy] = useState("newest_first");

  const [span, setSpan] = useState({
    start: initialFilters?.dateFrom ?? "",
    end: initialFilters?.dateTo ?? "",
  });

  const periodOptions: {
    value: ContractPeriod;
    label: string;
    labelAr: string;
  }[] = [
    {
      value: "everything",
      label: "Everything",
      labelAr: "كل الفترات",
    },
    {
      value: "covering_today",
      label: "Covering today",
      labelAr: "تشمل اليوم",
    },
    {
      value: "starting_next_90_days",
      label: "Starting in the next 90 days",
      labelAr: "تبدأ خلال الـ 90 يومًا القادمة",
    },
    {
      value: "ending_next_90_days",
      label: "Ending in the next 90 days",
      labelAr: "تنتهي خلال الـ 90 يومًا القادمة",
    },
    {
      value: "already_over",
      label: "Already over",
      labelAr: "انتهت بالفعل",
    },
    {
      value: "custom",
      label: "Custom date range",
      labelAr: "فترة زمنية مخصصة",
    },
  ];

  const togglePeriod = (period: ContractPeriod) => {
    setPeriods((current) => {
      if (period === "everything") {
        return ["everything"];
      }

      const withoutEverything = current.filter((item) => item !== "everything");

      const next = withoutEverything.includes(period)
        ? withoutEverything.filter((item) => item !== period)
        : [...withoutEverything, period];

      return next;
    });
  };

  const clearFilters = () => {
    const clearedFilters: ContractListFilterValues = {
      periods: ["everything"],
      dateFrom: "",
      dateTo: "",
      sortBy: "newest_first",
    };

    setPeriods(["everything"]);
    setSortBy("newest_first");
    setSpan({ start: "", end: "" });

    onApplyFilters?.(clearedFilters);
  };

  const handleApply = () => {
    if (periods.includes("custom")) {
      if (!span.start || !span.end || span.start > span.end) {
        return;
      }
    }

    onApplyFilters?.({
      periods,
      dateFrom: periods.includes("custom") ? span.start : "",
      dateTo: periods.includes("custom") ? span.end : "",
      sortBy,
    });

    onClose();
  };

  return (
    <IconModal
      overline={ar ? panel.overlineAr : panel.overline}
      title={ar ? panel.titleAr : panel.title}
      {...(panel.body ? { body: ar ? panel.bodyAr! : panel.body } : {})}
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" onClick={clearFilters}>
            {ar ? panel.cancelAr : panel.cancel}
          </Button>

          <Button
            onClick={handleApply}
            disabled={
              periods.includes("custom") && (!span.start || !span.end || span.start > span.end)
            }
          >
            {ar ? panel.confirmAr : panel.confirm}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Coverage period */}
        <section>
          <p className="text-overline mb-2 text-text-muted">
            {ar ? "فترة التغطية" : "Coverage period"}
          </p>

          <div className="space-y-1">
            {periodOptions.map((option) => {
              const selected = periods.includes(option.value);

              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => togglePeriod(option.value)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-[16px] border px-3.5 py-3 text-start transition-colors",
                    selected
                      ? "border-[#164d3b] bg-[#edffd8]"
                      : "border-border-subtle bg-surface-default hover:bg-surface-subtle",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px] border",
                      selected
                        ? "border-[#164d3b] bg-[#164d3b] text-white"
                        : "border-[#cbd5d0] bg-white",
                    )}
                  >
                    {selected && (
                      <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
                    )}
                  </span>

                  <span className="text-[13px] font-semibold text-text-primary">
                    {ar ? option.labelAr : option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Custom inclusive date range */}
        {periods.includes("custom") && (
          <section>
            <p className="text-overline mb-2 text-text-muted">
              {ar ? "نطاق التاريخ" : "Date range"}
            </p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <DayField
                label={ar ? "من تاريخ" : "From"}
                value={span.start}
                span={span}
                onPick={setSpan}
              />

              <DayField
                label={ar ? "إلى تاريخ" : "To"}
                value={span.end}
                span={span}
                onPick={setSpan}
              />
            </div>

            {span.start && span.end && span.start > span.end && (
              <p className="mt-2 text-xs text-text-danger" role="alert">
                {ar
                  ? "تاريخ البداية يجب أن يكون قبل تاريخ النهاية أو مساويًا له."
                  : "The start date must be on or before the end date."}
              </p>
            )}
          </section>
        )}

        <section>
          <p className="text-overline mb-2 text-text-muted">{ar ? "ترتيب النتائج" : "Order"}</p>

          <div className="space-y-1">
            {sortOptions.map((option) => {
              const selected = sortBy === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => {
                    setSortBy((current) => (current === option.value ? undefined : option.value));
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-[16px] border px-3.5 py-3 text-start transition-colors",
                    selected
                      ? "border-[#164d3b] bg-[#edffd8]"
                      : "border-border-subtle bg-surface-default hover:bg-surface-subtle",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                      selected ? "border-[#164d3b]" : "border-[#cbd5d0] bg-white",
                    )}
                  >
                    {selected && <span className="h-2.5 w-2.5 rounded-full bg-[#164d3b]" />}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-semibold text-text-primary">
                      {ar ? option.labelAr : option.label}
                    </span>

                    {(option.hint || option.hintAr) && (
                      <span className="mt-1 block text-[11px] leading-4 text-text-muted">
                        {ar ? (option.hintAr ?? option.hint) : option.hint}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {/* {sortBy && (
              <button
                type="button"
                onClick={() => setSortBy(undefined)}
                className="mt-2 text-xs font-medium text-text-muted underline underline-offset-4 hover:text-text-primary"
              >
                {ar ? "إلغاء الترتيب" : "Clear order"}
              </button>
            )} */}
        </section>

        {panel.note && (
          <p className="text-xs leading-5 text-text-muted">{ar ? panel.noteAr : panel.note}</p>
        )}
      </div>
    </IconModal>
  );
}

/**
 * OV 03.0D / 03.0I / 03.0J — the panel that asks before an action that
 * changes what agents can see.
 */
export function ConfirmOverlay({
  panel,
  onClose,
  onConfirm,
  reasonPlaceholder,
  reasonLabel,
  requireTyped,
}: {
  panel: ConfirmPanel;
  onClose: () => void;
  onConfirm: () => void;
  reasonLabel?: string;
  reasonPlaceholder?: string;
  /** OV 03.21 — terminate asks the word to be typed out. */
  requireTyped?: string;
}) {
  const { lang } = useLanguage();
  const ar = lang === "ar";
  const [reason, setReason] = useState("");
  const [typed, setTyped] = useState("");

  return (
    <IconModal
      tone={panel.tone}
      icon={<Check className="h-5 w-5" aria-hidden="true" />}
      overline={ar ? panel.overlineAr : panel.overline}
      title={ar ? panel.titleAr : panel.title}
      body={ar ? panel.bodyAr : panel.body}
      onClose={onClose}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            {ar ? panel.cancelAr : panel.cancel}
          </Button>
          <Button
            variant={panel.confirmTone ?? "default"}
            disabled={Boolean(requireTyped) && typed !== requireTyped}
            onClick={onConfirm}
          >
            {ar ? panel.confirmAr : panel.confirm}
          </Button>
        </>
      }
    >
      {panel.fields && (
        <div className="grid gap-3 sm:grid-cols-2">
          {panel.fields.map((field) => (
            <div
              key={field.label}
              className="rounded-[10px] border border-border-subtle bg-surface-subtle px-3.5 py-3"
            >
              <p className="text-overline text-text-muted">{ar ? field.labelAr : field.label}</p>
              <p className="mt-1 text-[12.5px] font-medium text-text-primary">
                {ar ? field.valueAr : field.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {panel.points && (
        <div className="space-y-1.5 rounded-[12px] bg-surface-subtle px-3.5 py-3">
          {panel.listLabel && (
            <p className="text-[10px] font-medium uppercase tracking-[0.04em] text-text-muted">
              {ar ? panel.listLabelAr : panel.listLabel}
            </p>
          )}
          {panel.points.map((point) => (
            <p
              key={point.text}
              className="flex items-start gap-2 text-[12.5px] leading-5 text-text-body"
            >
              <ChevronRight
                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-text-muted rtl:rotate-180"
                aria-hidden="true"
              />
              {ar ? point.textAr : point.text}
            </p>
          ))}
        </div>
      )}

      {reasonLabel && (
        <Input
          label={reasonLabel}
          placeholder={reasonPlaceholder ?? ""}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
        />
      )}

      {requireTyped && (
        <Input
          label={ar ? `اكتب ${requireTyped} للتأكيد` : `Type ${requireTyped} to confirm`}
          placeholder={requireTyped}
          value={typed}
          onChange={(event) => setTyped(event.target.value)}
        />
      )}
    </IconModal>
  );
}

/**
 * OV 03.0G — the Need attention filter is drawn as a menu under its
 * field, not as a modal: the same rows, 380 wide, with its own footer.
 */
export function FilterMenu({
  panel,
  trigger,
  onApply,
}: {
  panel: ListPanel;
  trigger: React.ReactNode;
  onApply: () => void;
}) {
  const { lang } = useLanguage();
  const ar = lang === "ar";
  const [picked, setPicked] = useState<string[]>(
    panel.groups.flatMap((group) => group.options.map((o) => o.label)),
  );

  const toggle = (label: string) =>
    setPicked((prev) =>
      prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label],
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[380px] p-0">
        <div className="border-b border-border-subtle px-3.5 py-3">
          {panel.overline && (
            <p className="text-overline text-text-muted">
              {ar ? panel.overlineAr : panel.overline}
            </p>
          )}
          <p className="mt-0.5 text-sm font-semibold text-text-primary">
            {ar ? panel.titleAr : panel.title}
          </p>
        </div>
        <div className="space-y-1 p-2">
          {panel.groups
            .flatMap((group) => group.options)
            .map((option) => {
              const on = picked.includes(option.label);
              return (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => toggle(option.label)}
                  className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-start hover:bg-surface-subtle"
                >
                  <span
                    className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                      on
                        ? "border-brand-deep bg-brand-deep text-text-inverse"
                        : "border-border-strong",
                    )}
                  >
                    {on && <Check className="h-3 w-3" aria-hidden="true" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-medium text-text-primary">
                      {ar ? option.labelAr : option.label}
                    </span>
                    {option.hint && (
                      <span className="mt-0.5 block text-[11px] text-text-muted">
                        {ar ? option.hintAr : option.hint}
                      </span>
                    )}
                  </span>
                  {option.count && (
                    <span className="font-data shrink-0 text-xs font-semibold text-text-secondary">
                      {ar ? option.countAr : option.count}
                    </span>
                  )}
                </button>
              );
            })}
        </div>
        <div className="flex justify-end gap-2 border-t border-border-subtle px-3.5 py-3">
          <Button variant="outline" size="sm" onClick={() => setPicked([])}>
            {ar ? panel.cancelAr : panel.cancel}
          </Button>
          <Button size="sm" onClick={onApply}>
            {ar ? panel.confirmAr : panel.confirm}
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
