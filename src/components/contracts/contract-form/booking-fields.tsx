import { ChoiceRow } from "@/components/contracts/contract-parts";
import { Input } from "@/components/ui/input";
import { fill, useLanguage } from "@/lib/i18n";
import { toAmount } from "@/store/features/contracts/contract-payload";
import { updateBasics } from "@/store/features/contracts/contract-draft.slice";
import {
  SLA_MAX_MINUTES,
  SLA_MIN_MINUTES,
  type BookingType,
  type SlaExpiryAction,
} from "@/store/features/contracts/types";
import { useAppDispatch, useContractDraft } from "./shared";

export function BookingFields() {
  const { c } = useLanguage();
  const t = c.builder;
  const f = t.form;
  const dispatch = useAppDispatch();
  const { basics } = useContractDraft();
  const onRequest = basics.bookingType === "on_request";

  const minutes = toAmount(basics.slaMinutes);
  const slaBad =
    basics.slaMinutes !== "" &&
    (minutes === null ||
      !Number.isInteger(minutes) ||
      minutes < SLA_MIN_MINUTES ||
      minutes > SLA_MAX_MINUTES);
  const bounds = { min: SLA_MIN_MINUTES, max: SLA_MAX_MINUTES };

  return (
    <>
      <ChoiceRow
        value={basics.bookingType}
        onChange={(next) => dispatch(updateBasics({ bookingType: next as BookingType }))}
        options={[
          { value: "allotment", label: f.bookingAllotment },
          { value: "on_request", label: f.bookingRequest },
        ]}
      />
      <p className="mt-2 text-xs leading-relaxed text-text-muted">
        {onRequest ? t.requestTypeHint : t.typeHint}
      </p>

      {onRequest && (
        <div className="mt-4 rounded-xl border border-border-subtle bg-surface-subtle p-4">
          <p className="text-sm font-medium text-text-primary">{t.slaBlockTitle}</p>
          <div className="mt-3 max-w-xs">
            <Input
              label={f.slaMinutes}
              inputMode="numeric"
              value={basics.slaMinutes}
              onChange={(e) => {
                const next = e.target.value;
                if (/^\d{0,3}$/.test(next)) {
                  dispatch(updateBasics({ slaMinutes: next }));
                }
              }}
              {...(slaBad ? { error: fill(f.v.sla, bounds) } : { hint: fill(f.slaHint, bounds) })}
            />
          </div>
          <p className="mt-1.5 text-xs text-text-muted">{t.slaCountdown}</p>
          <p className="mt-4 text-sm font-medium text-text-primary">{t.slaExpires}</p>
          <ChoiceRow
            value={basics.slaExpiryAction}
            onChange={(next) =>
              dispatch(updateBasics({ slaExpiryAction: next as SlaExpiryAction }))
            }
            options={[
              { value: "auto_reject", label: t.slaReject },
              { value: "escalate", label: t.slaEscalate },
            ]}
          />
          <p className="mt-2 text-xs leading-relaxed text-text-muted">
            {basics.slaExpiryAction === "escalate" ? t.slaEscalateNote : t.slaRejectNote}
          </p>
        </div>
      )}
    </>
  );
}
