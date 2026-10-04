/**
 * OV 07.38 — paying Hoteliana back, before the next statement takes it.
 *
 * BR-07-60 already settles the money: anything owed comes off the next
 * payment on its own, and only if it is still open after sixty days does
 * anyone ask for a transfer. So this screen is not a demand, and the band
 * under the details is the most important line on it — a page that hands
 * you an IBAN reads like a bill unless it says plainly that doing nothing
 * is a complete answer.
 *
 * The reference is the point of the rest: a transfer that arrives without
 * JEWAR-NEG-2026-09 on it cannot be matched to the debt, and an unmatched
 * transfer is worse for the supplier than no transfer at all.
 */

import { Landmark } from "lucide-react";
import { IconModal } from "@/components/layout/overlay";
import { Button } from "@/components/ui/button";
import { fill, useLanguage } from "@/lib/i18n";
import { money } from "@/lib/money";
import { overviewCopy, owedAmount } from "@/lib/finance-overview-data";

export function PayWhatYouOwe({ onClose }: { onClose: () => void }) {
  const { lang } = useLanguage();
  const k = lang === "ar" ? ("ar" as const) : ("en" as const);
  const c = overviewCopy;
  const amount = money(owedAmount, lang);

  return (
    <IconModal
      width="620px"
      icon={<Landmark className="h-5 w-5" aria-hidden="true" />}
      overline={fill(c.payOverline[k], { amount })}
      title={c.payTitle[k]}
      body={c.payBody[k]}
      onClose={onClose}
      footer={<Button onClick={onClose}>{c.payDone[k]}</Button>}
    >
      <div className="overflow-hidden rounded-xl border border-border-subtle">
        {(
          [
            [c.payBank[k], c.payBankValue[k]],
            [c.payIban[k], c.payIbanValue[k]],
            [c.payAmount[k], amount],
            [c.payReference[k], c.payReferenceValue[k]],
          ] as Array<[string, string]>
        ).map(([label, value]) => (
          <div
            key={label}
            className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-border-subtle px-4 py-3 last:border-b-0"
          >
            <span className="w-[120px] shrink-0 text-[12.5px] text-text-muted">
              {label}
            </span>
            <span className="min-w-0 flex-1 text-[13px] font-medium text-text-primary">
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Doing nothing is a complete answer, and it is the usual one. */}
      <div className="mt-3.5 rounded-xl bg-[#e8f1f8] p-3.5">
        <p className="text-[12px] leading-5 text-[#2f5673]">
          {c.payOrNothing[k]}
        </p>
      </div>
    </IconModal>
  );
}
