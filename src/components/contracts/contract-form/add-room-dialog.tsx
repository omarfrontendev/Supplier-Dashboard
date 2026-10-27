import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { BedDouble } from "lucide-react";

import type { HotelContractsMetadataData } from "@/api/modules/hotel-contract/types";
import { IconModal } from "@/components/layout/overlay";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useLanguage } from "@/lib/i18n";
import { addFixedRoom, sameFixedOffer } from "@/store/features/contracts/contract-draft.slice";
import {
  MEAL_PLANS,
  ROOM_VIEWS,
  type MealPlan,
  type RoomView,
} from "@/store/features/contracts/types";
import { ContractRoomSelect } from "./room-select";
import { useAppDispatch, useContractDraft } from "./shared";

export function AddRoomDialog({
  hotelId,
  metadata,
  metadataLoading,
  metadataError,
  onRetryMetadata,
  onClose,
}: {
  hotelId: number;
  metadata: HotelContractsMetadataData | undefined;
  metadataLoading: boolean;
  metadataError: boolean;
  onRetryMetadata: () => void;
  onClose: () => void;
}) {
  const { c, lang } = useLanguage();
  const f = c.builder.form;
  const dispatch = useAppDispatch();
  const { fixedRooms } = useContractDraft();
  const [roomId, setRoomId] = useState("");
  const [mealPlan, setMealPlan] = useState<MealPlan | "">("");
  const [view, setView] = useState<RoomView | "">("");

  const complete = roomId !== "" && mealPlan !== "" && view !== "";
  const duplicate =
    complete &&
    fixedRooms.some((room) => sameFixedOffer(room, { roomId: Number(roomId), mealPlan, view }));

  const mealOptions = (metadata?.mealPlans ?? []).flatMap((option) => {
    const value =
      option.value === "bed_and_breakfast"
        ? "bed_breakfast"
        : option.value === "iftar_sohour"
          ? "iftar_and_suhoor"
          : MEAL_PLANS.find((meal) => meal === option.value);
    return value ? [{ value, label: lang === "ar" ? option.labelAr : option.labelEn }] : [];
  });
  const viewOptions = (metadata?.roomViews ?? [])
    .filter((option) => ROOM_VIEWS.some((item) => item === option.value))
    .map((option) => ({
      value: option.value,
      label: lang === "ar" ? option.labelAr : option.labelEn,
    }));

  return (
    <IconModal
      icon={<BedDouble className="h-5 w-5" aria-hidden="true" />}
      overline={c.builder.modelFixed}
      title={f.addRoomTitle}
      body={f.addRoomBody}
      onClose={onClose}
      dirty={roomId !== "" || mealPlan !== "" || view !== ""}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            {f.cancel}
          </Button>
          <Button
            disabled={!complete || duplicate}
            onClick={() => {
              if (!complete) return;
              dispatch(addFixedRoom({ roomId: Number(roomId), mealPlan, view }));
              onClose();
            }}
          >
            {f.addRoomConfirm}
          </Button>
        </>
      }
    >
      <div className="grid gap-4">
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
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label={f.mealPlan}
            placeholder={f.mealPlanPh}
            loading={metadataLoading}
            {...(metadataError ? { loadError: f.roomsError } : {})}
            onRetry={onRetryMetadata}
            value={mealPlan}
            onChange={(value) => setMealPlan(MEAL_PLANS.find((meal) => meal === value) ?? "")}
            options={mealOptions}
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
