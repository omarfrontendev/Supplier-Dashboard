import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { fill, useLanguage } from "@/lib/i18n";
import { cancellationDrawer, chargeKinds } from "@/lib/policy-overlay-data";
import { toAmount } from "@/store/features/contracts/contract-payload";
import { MAX_CANCELLATION_TIERS, type CancellationTier } from "@/store/features/contracts/types";
import { contractIssuesFor } from "./schema";
import { formatAmount, useContractDraft } from "./shared";

export function PoliciesSummary({
  onCancellation,
  onRelease,
}: {
  onCancellation: () => void;
  onRelease: () => void;
}) {
  const { c, lang } = useLanguage();
  const t = c.builder;
  const p = t.form.policies;
  const k = lang === "ar" ? "ar" : "en";
  const draft = useContractDraft();
  const { cancellation, release } = draft.policies;
  const issues = contractIssuesFor(draft, t.form.v, "policies");

  const chargeText = (tier: CancellationTier) => {
    if (tier.charge === "free") return p.chargeFree;
    if (tier.charge === "nights") return fill(p.chargeNights, { value: tier.value });
    if (tier.charge === "percent") return fill(p.chargePercent, { value: tier.value });
    if (tier.charge === "fixed") {
      return fill(p.chargeFixed, {
        value: formatAmount(toAmount(tier.value) ?? 0, lang, draft.basics.currency),
      });
    }
    return chargeKinds[0]!.label[k];
  };

  const releaseText = release
    ? `${
        release.period === "same_day"
          ? fill(p.releaseSameDay, { time: release.time })
          : fill(p.releaseDays, { days: release.days, time: release.time })
      } · ${release.afterRelease === "stop_sale" ? p.afterStop : p.afterRequest}`
    : "";

  return (
    <>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col rounded-xl border border-border-subtle p-4">
          <p className="text-overline text-text-muted">{t.cancellation}</p>
          {cancellation ? (
            <>
              <ul className="mt-1.5 space-y-1">
                {cancellation.map((tier, index) => (
                  <li key={index} className="text-sm font-medium text-text-primary">
                    {fill(cancellationDrawer.tierName[k], { n: index + 1 })} ·{" "}
                    {fill(p.tierLine, { days: tier.days, charge: chargeText(tier) })}
                  </li>
                ))}
              </ul>
              <p className="mt-1 text-xs text-text-muted">
                {fill(p.tiersCount, {
                  count: cancellation.length,
                  max: MAX_CANCELLATION_TIERS,
                })}
              </p>
            </>
          ) : (
            <p className="mt-1.5 text-sm text-text-muted">{p.notSet}</p>
          )}
          <div className="mt-3">
            <Button variant="outline" size="sm" onClick={onCancellation}>
              {!cancellation && <Plus className="h-4 w-4" aria-hidden="true" />}
              {cancellation ? t.editCancellation : p.addCancellation}
            </Button>
          </div>
        </div>

        <div className="flex flex-col rounded-xl border border-border-subtle p-4">
          <p className="text-overline text-text-muted">{t.release}</p>
          <p
            className={
              release
                ? "mt-1.5 text-sm font-medium text-text-primary"
                : "mt-1.5 text-sm text-text-muted"
            }
          >
            {release ? releaseText : p.notSet}
          </p>
          <div className="mt-3">
            <Button variant="outline" size="sm" onClick={onRelease}>
              {!release && <Plus className="h-4 w-4" aria-hidden="true" />}
              {release ? t.editRelease : p.addRelease}
            </Button>
          </div>
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
    </>
  );
}
