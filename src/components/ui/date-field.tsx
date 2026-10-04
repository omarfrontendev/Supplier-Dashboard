import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  DatePicker,
  dateOf,
  type DayKey,
  type DayRange,
} from "@/components/ui/date-picker";
import { datePickerCopy } from "@/lib/date-picker-copy";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** Arabic reads its own digits, the way every other number in the portal does. */
function digits(value: string | number, ar: boolean) {
  return ar
    ? String(value).replace(
        /[0-9]/g,
        (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]!
      )
    : String(value);
}

export function readableDay(key: DayKey, lang: string) {
  const ar = lang === "ar";
  const t = datePickerCopy[ar ? "ar" : "en"];
  const date = dateOf(key);
  return `${digits(date.getDate(), ar)} ${t.monthsShort[date.getMonth()]} ${digits(date.getFullYear(), ar)}`;
}

type Common = {
  label?: string | undefined;
  min?: DayKey | undefined;
  max?: DayKey | undefined;
  invalid?: boolean | undefined;
  className?: string | undefined;
  /** Keeps the panel inside the viewport on a phone. */
  panelClassName?: string | undefined;
};

type DayProps = Common & {
  mode?: "day";
  value: DayKey;
  onChange: (value: DayKey) => void;
};

type RangeProps = Common & {
  mode: "range";
  value: DayRange;
  onChange: (value: { start: DayKey; end: DayKey }) => void;
};

/**
 * A field that opens Supplier / Date picker. "day" picks one night and
 * shows it; "range" picks both ends and shows the span.
 */
export function DateField(props: DayProps | RangeProps) {
  const { lang } = useLanguage();
  const ar = lang === "ar";
  const mode = props.mode ?? "day";
  const [open, setOpen] = useState(false);
  const holder = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const away = (event: MouseEvent) => {
      if (!holder.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", away);
    return () => document.removeEventListener("mousedown", away);
  }, [open]);

  const shown =
    mode === "range"
      ? `${readableDay((props.value as DayRange).start, lang)} – ${readableDay(
          (props.value as DayRange).end ?? (props.value as DayRange).start,
          lang
        )}`
      : readableDay(props.value as DayKey, lang);

  const seed: DayRange =
    mode === "range"
      ? (props.value as DayRange)
      : { start: props.value as DayKey, end: null };

  return (
    <div className={cn("w-full", props.className)} ref={holder}>
      {props.label && (
        <span className="mb-2 block text-[13px] font-medium leading-[15px] text-text-primary">
          {props.label}
        </span>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className={cn(
            "flex min-h-11 w-full items-center gap-2 rounded-[10px] border bg-surface-default px-4 py-2 text-start transition-colors",
            props.invalid
              ? "border-status-danger"
              : "border-border-default hover:border-border-strong"
          )}
        >
          <span className="min-w-0 flex-1 truncate text-sm text-text-primary">
            {shown}
          </span>
          <ChevronDown
            className="h-4 w-4 shrink-0 text-text-muted"
            aria-hidden="true"
          />
        </button>

        {open && (
          <div
            className={cn(
              "absolute z-50 mt-2 w-[393px] max-w-[calc(100vw-4rem)] start-0",
              props.panelClassName
            )}
          >
            <DatePicker
              className="w-full"
              value={seed}
              single={mode === "day"}
              {...(props.min ? { min: props.min } : {})}
              {...(props.max ? { max: props.max } : {})}
              onCancel={() => setOpen(false)}
              onApply={(range) => {
                if (mode === "range") {
                  (props as RangeProps).onChange({
                    start: range.start,
                    end: range.end ?? range.start,
                  });
                } else {
                  (props as DayProps).onChange(range.start);
                }
                setOpen(false);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export { digits as arabicDigits };
