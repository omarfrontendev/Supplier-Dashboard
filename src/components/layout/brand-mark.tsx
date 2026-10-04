import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";
import { HotelianaWordmark } from "@/components/brand/hoteliana-logo";

/**
 * Logo lockup from the design system: Hoteliana wordmark with the
 * SUPPLIER PORTAL overline centred beneath it.
 */
export function BrandMark({
  tone = "dark",
  className,
}: {
  tone?: "dark" | "light";
  className?: string;
}) {
  const { c } = useLanguage();

  return (
    <div className={cn("inline-flex flex-col items-center", className)}>
      <HotelianaWordmark
        height={30}
        className={tone === "light" ? "text-text-inverse" : "text-brand-deep"}
      />
      <span
        className={cn(
          "mt-2.5 text-overline tracking-[0.18em]",
          tone === "light" ? "text-primary" : "text-text-muted"
        )}
      >
        {c.common.supplierPortal}
      </span>
      <span className="sr-only">{c.common.brand}</span>
    </div>
  );
}
