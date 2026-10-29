import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { BedDouble } from "lucide-react";

import type { HotelContractsMetadataData } from "@/api/modules/hotel-contract/types";
import { IconModal } from "@/components/layout/overlay";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { ChoiceRow, Table } from "@/components/contracts/contract-parts";
import { useLanguage } from "@/lib/i18n";
import {
  addFixedRoom,
  addSupplementRoom,
  sameFixedOffer,
} from "@/store/features/contracts/contract-draft.slice";
import {
  ROOM_VIEWS,
  type FixedRoomMeal,
  type MealBasis,
  type MealPlan,
  type PricingModel,
  type RoomView,
} from "@/store/features/contracts/types";
import { ContractRoomSelect } from "./room-select";
import { AmountInput, RoomTick, useAppDispatch, useContractDraft } from "./shared";

export function mealOptionsFrom(
  metadata: HotelContractsMetadataData | undefined,
  lang: string,
): Array<{ value: MealPlan; label: string }> {
  return (metadata?.mealPlans ?? []).map((option) => ({
    value: option.value,
    label: lang === "ar" ? option.labelAr : option.labelEn,
  }));
}

export function AddRoomDialog({
  hotelId,
  metadata,
  metadataLoading,
  metadataError,
  onRetryMetadata,
  pricingModel,
  onClose,
}: {
  hotelId: number;
  metadata: HotelContractsMetadataData | undefined;
  metadataLoading: boolean;
  metadataError: boolean;
  onRetryMetadata: () => void;
  pricingModel: PricingModel;
  onClose: () => void;
}) {
  const { c, lang } = useLanguage();
  const f = c.builder.form;
  const dispatch = useAppDispatch();
  const { basics, fixedRooms, baseSupplements } = useContractDraft();
  const currencySuffix = basics.currency ? { suffix: basics.currency } : {};
  const [roomId, setRoomId] = useState("");
  const [view, setView] = useState<RoomView | "">("");
  const [meals, setMeals] = useState<Partial<Record<MealPlan, FixedRoomMeal>>>({
    room_only: { plan: "room_only", basis: "per_room", price: "" },
  });

  const hasMealPlan = pricingModel === "fixed_price";
  const mealOptions = mealOptionsFrom(metadata, lang);
  const pickedMeals = mealOptions.flatMap((option) => {
    const meal = meals[option.value];
    return meal ? [meal] : [];
  });
  const mealPriceMissing = pickedMeals.some(
    (meal) => meal.plan !== "room_only" && meal.price.trim() === "",
  );
  const fixedSelection =
    hasMealPlan && roomId !== "" && view !== "" && pickedMeals.length > 0 && !mealPriceMissing
      ? { roomId: Number(roomId), view, meals: pickedMeals }
      : null;
  const supplementSelection =
    !hasMealPlan && roomId !== "" && view !== "" ? { roomId: Number(roomId), view } : null;
  const selection = fixedSelection ?? supplementSelection;
  const duplicate = fixedSelection
    ? fixedRooms.some((room) => sameFixedOffer(room, fixedSelection))
    : supplementSelection
      ? baseSupplements.rooms.some(
          (room) =>
            room.roomId === supplementSelection.roomId && room.view === supplementSelection.view,
        )
      : false;

  const t = f.mealsTable;
  const toggleMeal = (plan: MealPlan) =>
    setMeals((current) => {
      const next = { ...current };
      if (next[plan]) delete next[plan];
      else next[plan] = { plan, basis: "per_person", price: "" };
      return next;
    });
  const editMeal = (plan: MealPlan, change: Partial<FixedRoomMeal>) =>
    setMeals((current) => {
      const meal = current[plan];
      return meal ? { ...current, [plan]: { ...meal, ...change } } : current;
    });
  const viewOptions = (metadata?.roomViews ?? [])
    .filter((option) => ROOM_VIEWS.some((item) => item === option.value))
    .map((option) => ({
      value: option.value,
      label: lang === "ar" ? option.labelAr : option.labelEn,
    }));

  return (
    <IconModal
      {...(hasMealPlan ? { width: "860px" } : {})}
      icon={<BedDouble className="h-5 w-5" aria-hidden="true" />}
      overline={hasMealPlan ? c.builder.modelFixed : c.builder.modelSupplements}
      title={f.addRoomTitle}
      body={f.addRoomBody}
      onClose={onClose}
      dirty={roomId !== "" || view !== "" || Object.keys(meals).length > 1}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            {f.cancel}
          </Button>
          <Button
            disabled={!selection || duplicate}
            onClick={() => {
              if (!selection || duplicate) return;
              if (fixedSelection) dispatch(addFixedRoom(fixedSelection));
              else if (supplementSelection) dispatch(addSupplementRoom(supplementSelection));
              onClose();
            }}
          >
            {f.addRoomConfirm}
          </Button>
        </>
      }
    >
      <div className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <ContractRoomSelect
            key={hotelId}
            hotelId={hotelId}
            label={f.room}
            placeholder={f.roomPh}
            value={roomId}
            onChange={(value, room) => {
              setRoomId(value);
              if (room?.view && ROOM_VIEWS.some((item) => item === room.view) && view === "") {
                setView(room.view as RoomView);
              }
            }}
          />
          <Select
            label={f.view}
            placeholder={f.viewPh}
            loading={metadataLoading}
            {...(metadataError ? { loadError: f.roomsError } : {})}
            onRetry={onRetryMetadata}
            value={view}
            onChange={(value) => setView(value as RoomView)}
            options={viewOptions}
          />
        </div>
        {hasMealPlan && (
          <div>
            <p className="text-sm font-semibold text-text-primary">{f.mealPlan}</p>
            {metadataLoading ? (
              <p className="mt-2 text-sm text-text-muted">{f.roomsLoading}</p>
            ) : metadataError ? (
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <p className="text-sm text-status-danger">{f.roomsError}</p>
                <Button variant="outline" size="sm" onClick={onRetryMetadata}>
                  {f.retry}
                </Button>
              </div>
            ) : (
              <Table
                head={["", t.colMeal, t.colBasis, t.colPrice]}
                rows={mealOptions.map((option) => {
                  const meal = meals[option.value];
                  const included = option.value === "room_only";
                  return [
                    <RoomTick
                      key="tick"
                      on={Boolean(meal)}
                      locked={included}
                      label={option.label}
                      onToggle={() => toggleMeal(option.value)}
                    />,
                    option.label,
                    included ? (
                      "-"
                    ) : (
                      <ChoiceRow
                        key="basis"
                        value={meal?.basis ?? "per_person"}
                        disabled={!meal}
                        onChange={(basis) =>
                          editMeal(option.value, { basis: basis as MealBasis })
                        }
                        options={[
                          { value: "per_room", label: t.perRoom },
                          { value: "per_person", label: t.perPerson },
                        ]}
                      />
                    ),
                    included ? (
                      <span key="included" className="text-sm font-medium text-brand-deep">
                        {t.included}
                      </span>
                    ) : (
                      <AmountInput
                        key="price"
                        aria-label={`${option.label} · ${t.colPrice}`}
                        {...currencySuffix}
                        className="max-w-[160px]"
                        disabled={!meal}
                        value={meal?.price ?? ""}
                        onValue={(value) => editMeal(option.value, { price: value })}
                      />
                    ),
                  ];
                })}
              />
            )}
            {mealPriceMissing && (
              <p className="mt-2 text-[12.5px] text-status-danger">{f.v.mealPrice}</p>
            )}
          </div>
        )}
        {duplicate && <p className="text-[12.5px] text-status-danger">{f.duplicate}</p>}
        <Link
          to="/hotel/$hotelId"
          params={{ hotelId: String(hotelId) }}
          target="_blank"
          className="text-xs font-medium text-text-link hover:underline"
        >
          {f.missingRoom}
        </Link>
      </div>
    </IconModal>
  );
}
