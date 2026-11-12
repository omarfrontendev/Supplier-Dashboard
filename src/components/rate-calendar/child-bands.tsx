import type { ChildCategory } from "@/api/modules/rates-availability/types";
import { Input } from "@/components/ui/input";
import { OldPrice } from "@/components/rate-calendar/old-price";
import { useLanguage } from "@/lib/i18n";
import { bulkSupplements as bs } from "@/lib/rate-overlay-data";
import {
  agesBad,
  priceBad,
  type ChildBandsState,
} from "@/components/rate-calendar/use-child-bands";

export function ChildBandsFields({
  state,
  currency,
  idPrefix,
  contractPrices,
}: {
  state: ChildBandsState;
  currency: string;
  idPrefix: string;
  /** Old price: the contract's own child prices (contract childPricing), by band. */
  contractPrices?: Partial<Record<ChildCategory, number | null>> | undefined;
}) {
  const { lang } = useLanguage();
  const k = lang === "ar" ? "ar" : "en";
  return (
    <>
      <div className="grid gap-4">
        {state.bands.map((band) => {
          const shown = state.shownOf(band);
          const entry = state.entries.find((item) => item.category === band.category);
          const free = band.category === "sharing_parents";
          return (
            <div key={band.category}>
              <p className="mb-2 text-[12.5px] font-semibold text-text-primary">
                {bs.childLabels[band.category][k]}
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                <Input
                  id={`${idPrefix}-${band.category}-from`}
                  label={bs.fromAge[k]}
                  inputMode="numeric"
                  value={shown.from}
                  onChange={(e) => state.edit(band, "from", e.target.value)}
                  {...(entry && agesBad(entry.from, entry.to) ? { error: bs.badAges[k] } : {})}
                />
                <Input
                  id={`${idPrefix}-${band.category}-to`}
                  label={bs.toAge[k]}
                  inputMode="numeric"
                  value={shown.to}
                  onChange={(e) => state.edit(band, "to", e.target.value)}
                />
                <div>
                  <Input
                    id={`${idPrefix}-${band.category}-price`}
                    label={bs.childPrice[k]}
                    inputMode="decimal"
                    value={free ? "0" : shown.price}
                    disabled={free}
                    onChange={(e) => state.edit(band, "price", e.target.value)}
                    suffix={currency}
                    {...(free
                      ? { hint: bs.alwaysFree[k] }
                      : entry && priceBad(entry.price)
                        ? { error: bs.badPrice[k] }
                        : {})}
                  />
                  {/* The contract's own child price, never the box or a daily override. */}
                  {!free && contractPrices && (
                    <OldPrice value={contractPrices[band.category] ?? null} currency={currency} />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-2 max-w-[560px] text-[11.5px] leading-4 text-text-quiet">
        {bs.childrenHint[k]}
      </p>
    </>
  );
}
