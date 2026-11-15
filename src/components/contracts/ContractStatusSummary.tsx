import {
  CONTRACT_STATUSES,
  CONTRACT_STATUS_CONFIG,
  type ContractCountsByStatus,
} from "@/api/modules/hotel-contract/types";
import { StatusPill } from "@/components/layout/page-shell";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** Compact count of contracts per status; only statuses with a count above 0 are shown. */
export function ContractStatusSummary({
  counts,
  className,
}: {
  counts: Partial<ContractCountsByStatus> | null | undefined;
  className?: string;
}) {
  const { lang } = useLanguage();

  const visible = CONTRACT_STATUSES.map((status) => ({
    status,
    count: Number(counts?.[status]) || 0,
  })).filter(({ count }) => count > 0);

  if (visible.length === 0) return null;

  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)}>
      {visible.map(({ status, count }) => {
        const { labelEn, labelAr, tone } = CONTRACT_STATUS_CONFIG[status];

        return (
          <li key={status}>
            <StatusPill tone={tone} className="gap-1.5">
              {lang === "ar" ? labelAr : labelEn}
              <span className="font-data">{count}</span>
            </StatusPill>
          </li>
        );
      })}
    </ul>
  );
}
