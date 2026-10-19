import { useState } from "react";
import { AlertTriangle } from "lucide-react";

import { useLinkedHotelRooms } from "@/api/modules/hotels/useLinkedHotelRooms";
import { ChoiceRow } from "@/components/contracts/contract-parts";
import { IconModal } from "@/components/layout/overlay";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { fill, useLanguage } from "@/lib/i18n";
import {
  setBaseCost,
  setBaseRoom,
  setPricingModel,
  setWeekPricing,
} from "@/store/features/contracts/contract-draft.slice";
import type { PricingModel, WeekPricing } from "@/store/features/contracts/types";
import { AmountInput, roomLabel, useAppDispatch, useContractDraft } from "./shared";

export function PricingFields() {
  const { c, lang } = useLanguage();
  const t = c.builder;
  const f = t.form;
  const dispatch = useAppDispatch();
  const draft = useContractDraft();
  const { basics, pricingModel, weekPricing, baseSupplements, fixedRooms } = draft;
  const { rooms } = useLinkedHotelRooms(basics.hotelId);
  const [pendingModel, setPendingModel] = useState<PricingModel | null>(null);

  const split = weekPricing === "weekday_weekend";
  const currencySuffix = basics.currency ? { suffix: basics.currency } : {};
  const modelName = (model: PricingModel) =>
    model === "base_supplements" ? t.modelSupplements : t.modelFixed;
  const hasModelData =
    pricingModel === "base_supplements"
      ? baseSupplements.baseRoomId !== null ||
        baseSupplements.rooms.length > 0 ||
        baseSupplements.weekdayBaseCost !== "" ||
        baseSupplements.weekendBaseCost !== ""
      : fixedRooms.length > 0;

  const chooseModel = (next: PricingModel) => {
    if (next === pricingModel) return;
    if (hasModelData) {
      setPendingModel(next);
    } else {
      dispatch(setPricingModel(next));
    }
  };

  return (
    <>
      <p className="text-sm font-medium text-text-primary">{t.pricingModel}</p>
      <ChoiceRow
        value={pricingModel}
        onChange={(next) => chooseModel(next as PricingModel)}
        options={[
          { value: "base_supplements", label: t.modelSupplements },
          { value: "fixed_price", label: t.modelFixed },
        ]}
      />
      <p className="mt-2 text-xs leading-relaxed text-text-muted">{t.modelHint}</p>
      <p className="mt-3 text-[13px] font-medium text-brand-deep">{t.vatIncluded}</p>

      <p className="mt-5 text-sm font-medium text-text-primary">{f.weekTitle}</p>
      <ChoiceRow
        value={weekPricing}
        onChange={(next) => dispatch(setWeekPricing(next as WeekPricing))}
        options={[
          { value: "one_price", label: t.weekOne },
          { value: "weekday_weekend", label: t.weekSplit },
        ]}
      />
      <p className="mt-2 text-xs leading-relaxed text-text-muted">
        {split ? t.weekHint : t.weekOneHint}
      </p>

      {pricingModel === "base_supplements" && (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <Select
              label={f.baseRoom}
              placeholder={basics.hotelId ? f.baseRoomPh : f.pickHotelFirst}
              disabled={!basics.hotelId}
              value={baseSupplements.baseRoomId ? String(baseSupplements.baseRoomId) : ""}
              onChange={(value) => value && dispatch(setBaseRoom(Number(value)))}
              options={rooms.map((room) => ({
                value: String(room.id),
                label: roomLabel(room, lang, f),
              }))}
            />
            <p className="mt-1.5 text-xs leading-relaxed text-text-muted">{f.baseRoomHint}</p>
          </div>
          <AmountInput
            label={split ? f.weekdayBaseCost : f.baseCost}
            {...currencySuffix}
            value={baseSupplements.weekdayBaseCost}
            onValue={(value) => dispatch(setBaseCost({ day: "weekday", value }))}
          />
          {split && (
            <AmountInput
              label={f.weekendBaseCost}
              {...currencySuffix}
              value={baseSupplements.weekendBaseCost}
              onValue={(value) => dispatch(setBaseCost({ day: "weekend", value }))}
            />
          )}
        </div>
      )}

      {pendingModel && (
        <IconModal
          tone="danger"
          icon={<AlertTriangle className="h-5 w-5" aria-hidden="true" />}
          overline={t.pricingModel}
          title={f.switchTitle}
          body={fill(f.switchBody, { model: modelName(pricingModel) })}
          onClose={() => setPendingModel(null)}
          footer={
            <>
              <Button variant="outline" onClick={() => setPendingModel(null)}>
                {f.cancel}
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  dispatch(setPricingModel(pendingModel));
                  setPendingModel(null);
                }}
              >
                {f.switchConfirm}
              </Button>
            </>
          }
        />
      )}
    </>
  );
}
