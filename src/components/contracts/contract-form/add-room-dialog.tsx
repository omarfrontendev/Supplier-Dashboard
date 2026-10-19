import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { BedDouble } from "lucide-react";

import type { LinkedHotelRoom } from "@/api/modules/hotels/useLinkedHotelRooms";
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
import { roomLabel, useAppDispatch, useContractDraft } from "./shared";

export function AddRoomDialog({
  hotelId,
  rooms,
  onClose,
}: {
  hotelId: number;
  rooms: LinkedHotelRoom[];
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
        <Select
          label={f.room}
          placeholder={f.roomPh}
          value={roomId}
          onChange={(value) => {
            setRoomId(value);
            const room = rooms.find((item) => String(item.id) === value);
            if (room?.view && view === "") setView(room.view);
          }}
          options={rooms.map((room) => ({
            value: String(room.id),
            label: roomLabel(room, lang, f),
          }))}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label={f.mealPlan}
            placeholder={f.mealPlanPh}
            searchable={false}
            value={mealPlan}
            onChange={(value) => setMealPlan(value as MealPlan)}
            options={MEAL_PLANS.map((meal) => ({ value: meal, label: f.meals[meal] }))}
          />
          <Select
            label={f.view}
            placeholder={f.viewPh}
            searchable={false}
            value={view}
            onChange={(value) => setView(value as RoomView)}
            options={ROOM_VIEWS.map((item) => ({ value: item, label: f.views[item] }))}
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
