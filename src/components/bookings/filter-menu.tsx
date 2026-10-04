import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { DatePicker, dateOf, type DayRange } from "@/components/ui/date-picker";
import { useLanguage } from "@/lib/i18n";
import { bookingCopy } from "@/lib/booking-copy";
import { datePickerCopy } from "@/lib/date-picker-copy";
import { cn } from "@/lib/utils";

export type FilterChoice = {
  value: string;
  label: string;
  /** The second line Figma prints under a choice, such as "48 bookings". */
  note?: string | undefined;
  /** UI 05.0 — some fields read shorter than the choice in the menu. */
  short?: string | undefined;
};

/**
 * OV 05.15 / 05.16 / 05.17 / 05.18 — one filter on the bookings list: a
 * labelled field that opens a 284px menu of radio choices, with a title,
 * a line saying what the filter does, and Clear / All filters under it.
 */
export function FilterMenu({
  label,
  title,
  hint,
  value,
  options,
  onChange,
  onAllFilters,
  rangeValue,
  rangeHint,
  rangeCountsNights = true,
  className,
}: {
  label: string;
  title: string;
  hint: string;
  value: string;
  options: FilterChoice[];
  onChange: (value: string) => void;
  onAllFilters: () => void;
  /** Flow 12 · Row J — this choice opens the date picker instead of closing. */
  rangeValue?: string | undefined;
  /** OV 05.16D / 05.17D - what the picked range means, in one line. */
  rangeHint?: string | undefined;
  /** A range of days rather than a run of nights, as "booked on" is. */
  rangeCountsNights?: boolean | undefined;
  className?: string | undefined;
}) {
  const { lang } = useLanguage();
  const t = bookingCopy[lang].detail;
  /* The two range filters' words live with the list, not the detail. */
  const list = bookingCopy[lang];
  const [open, setOpen] = useState(false);
  const [picking, setPicking] = useState(false);
  const [picked, setPicked] = useState<DayRange | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const current = options.find((option) => option.value === value);
  const span = (range: DayRange) => {
    const months = datePickerCopy[lang === "ar" ? "ar" : "en"].monthsShort;
    const fmt = (key: string) => {
      const date = dateOf(key);
      return `${date.getDate()} ${months[date.getMonth()]}`;
    };
    return range.end
      ? `${fmt(range.start)} - ${fmt(range.end)}`
      : fmt(range.start);
  };

  useEffect(() => {
    if (!open) return;
    const onDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  return (
    <div className={cn("w-full", className)} ref={rootRef}>
      <span className="mb-[7px] block text-xs font-medium leading-4 text-text-primary">
        {label}
      </span>

      <div className="relative">
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
          className={cn(
            "flex h-11 w-full items-center gap-2 rounded-[10px] border bg-surface-default px-4 text-start transition-colors",
            open
              ? "border-border-focus ring-4 ring-ring/20"
              : "border-border-default hover:border-border-strong"
          )}
        >
          <span className="min-w-0 flex-1 truncate text-sm text-text-primary">
            {value === rangeValue && picked ? span(picked) : (current?.short ?? current?.label ?? "")}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-text-muted transition-transform",
              open && "rotate-180"
            )}
            aria-hidden="true"
          />
        </button>

        {open && (
          <div className="absolute z-50 mt-2 w-[300px] rounded-xl border border-border-default bg-surface-default p-2 shadow-overlay end-0">
            <p className="text-[13px] font-semibold leading-4 text-text-primary">
              {title}
            </p>
            <p className="text-[11px] leading-[14px] text-text-body">{hint}</p>

            <div className="mt-1.5" role="listbox">
              {options.map((option) => {
                const active = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => {
                      onChange(option.value);
                      if (option.value === rangeValue) setPicking(true);
                      else setOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-lg p-2 text-start transition-colors",
                      active ? "bg-[#eef5ee]" : "hover:bg-surface-subtle"
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full border bg-surface-default",
                        active ? "border-brand-deep" : "border-border-strong"
                      )}
                    >
                      {active && (
                        <span
                          className="h-1.5 w-1.5 rounded-full bg-brand-deep"
                          aria-hidden="true"
                        />
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[12.5px] font-medium leading-4 text-text-primary">
                        {option.label}
                      </span>
                      {option.note && (
                        <span className="mt-px block truncate text-[11px] leading-[14px] text-text-body">
                          {option.note}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            {picking && value === rangeValue && (
              <div className="mt-2">
                <DatePicker
                  className="w-full"
                  {...(rangeHint ? { hint: rangeHint } : {})}
                  countNights={rangeCountsNights}
                  actionLabel={list.showRange}
                  onCancel={() => setPicking(false)}
                  onApply={(range) => {
                    setPicked(range);
                    setPicking(false);
                    setOpen(false);
                  }}
                />
              </div>
            )}

            <div className="mt-2.5 flex items-center justify-between px-2">
              <button
                type="button"
                onClick={() => {
                  onChange(options[0]?.value ?? "");
                  setOpen(false);
                }}
                className="text-xs font-medium leading-4 text-text-body hover:underline"
              >
                {t.clear}
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onAllFilters();
                }}
                className="text-xs font-medium leading-4 text-brand-deep hover:underline"
              >
                {t.allFilters}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
