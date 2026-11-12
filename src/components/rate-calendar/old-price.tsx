import { fill, useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { bulkSupplements as bs } from "@/lib/rate-overlay-data";

/**
 * Change prices (single and bulk) - the price a field held before this
 * unsaved edit. It is always read from the original value, never from the
 * box, so it stays put while the supplier types.
 */
export function OldPrice({
  value,
  currency,
  note,
  className,
}: {
  /** Extra words after the price, e.g. a meal's per person / per room basis. */
  note?: string | undefined;
  /** One amount, or several (e.g. weekday / weekend); null reads as "-". */
  value: number | null | undefined | Array<number | null | undefined>;
  currency?: string | undefined;
  className?: string;
}) {
  const { lang } = useLanguage();
  const k = lang === "ar" ? "ar" : "en";
  const format = (amount: number | null | undefined) =>
    amount === null || amount === undefined || !Number.isFinite(amount)
      ? "-"
      : amount.toLocaleString(k === "ar" ? "ar-EG" : "en-US", { maximumFractionDigits: 2 });
  const list = Array.isArray(value) ? value : [value];
  const known = list.some((amount) => amount !== null && amount !== undefined);
  const price = [...new Set(list.map(format))].join(" / ");
  return (
    <span className={cn("mt-1 block text-[11px] text-text-muted", className)}>
      {fill(bs.oldPrice[k], {
        price: known && currency ? `${price} ${currency}` : price,
      })}
      {note ? ` · ${note}` : ""}
    </span>
  );
}
