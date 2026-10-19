import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";

import { useLinkedHotelRooms } from "@/api/modules/hotels/useLinkedHotelRooms";
import { Table } from "@/components/contracts/contract-parts";
import { Button } from "@/components/ui/button";
import { fill, useLanguage } from "@/lib/i18n";
import { effectivePrice } from "@/store/features/contracts/contract-payload";
import {
  removeFixedRoom,
  setFixedPrice,
  setRoomSupplement,
  toggleSupplementRoom,
} from "@/store/features/contracts/contract-draft.slice";
import { AddRoomDialog } from "./add-room-dialog";
import {
  AmountInput,
  formatAmount,
  RoomTick,
  roomLabel,
  useAppDispatch,
  useContractDraft,
} from "./shared";

export function RoomsFields() {
  const { c, lang } = useLanguage();
  const f = c.builder.form;
  const dispatch = useAppDispatch();
  const { basics, pricingModel, weekPricing, baseSupplements, fixedRooms } = useContractDraft();
  const { rooms, isLoading, isError, refetch } = useLinkedHotelRooms(basics.hotelId);
  const [adding, setAdding] = useState(false);

  const split = weekPricing === "weekday_weekend";
  const currencySuffix = basics.currency ? { suffix: basics.currency } : {};
  const money = (amount: number | null) =>
    amount === null ? "-" : formatAmount(amount, lang, basics.currency);

  if (!basics.hotelId) {
    return <p className="text-sm text-text-muted">{f.pickHotelFirst}</p>;
  }
  if (isLoading) {
    return <p className="text-sm text-text-muted">{f.roomsLoading}</p>;
  }
  if (isError) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-sm text-status-danger">{f.roomsError}</p>
        <Button variant="outline" size="sm" onClick={() => void refetch()}>
          {f.retry}
        </Button>
      </div>
    );
  }

  if (pricingModel === "fixed_price") {
    const roomById = new Map(rooms.map((room) => [room.id, room]));
    return (
      <>
        <Button variant="outline" size="sm" onClick={() => setAdding(true)}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          {c.builder.addRoom}
        </Button>

        {fixedRooms.length === 0 ? (
          <p className="mt-4 text-sm text-text-muted">{f.fixedEmpty}</p>
        ) : (
          <Table
            head={[
              c.builder.colRoom,
              f.colMealPlan,
              f.colView,
              ...(split ? [f.colWeekdayPrice, f.colWeekendPrice] : [f.colPrice]),
              "",
            ]}
            rows={fixedRooms.map((row, index) => {
              const room = roomById.get(row.roomId);
              const name = room
                ? (lang === "ar" ? room.nameAr : room.nameEn) || room.nameEn
                : `#${row.roomId}`;
              return [
                name,
                f.meals[row.mealPlan],
                f.views[row.view],
                <AmountInput
                  key="weekday"
                  aria-label={split ? f.colWeekdayPrice : f.colPrice}
                  {...currencySuffix}
                  className="max-w-[160px]"
                  value={row.weekdayPrice}
                  onValue={(value) => dispatch(setFixedPrice({ index, day: "weekday", value }))}
                />,
                ...(split
                  ? [
                      <AmountInput
                        key="weekend"
                        aria-label={f.colWeekendPrice}
                        {...currencySuffix}
                        className="max-w-[160px]"
                        value={row.weekendPrice}
                        onValue={(value) =>
                          dispatch(setFixedPrice({ index, day: "weekend", value }))
                        }
                      />,
                    ]
                  : []),
                <Button
                  key="remove"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={fill(f.remove, { room: name })}
                  onClick={() => dispatch(removeFixedRoom(index))}
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </Button>,
              ];
            })}
          />
        )}

        {adding && (
          <AddRoomDialog hotelId={basics.hotelId} rooms={rooms} onClose={() => setAdding(false)} />
        )}
      </>
    );
  }

  if (rooms.length === 0) {
    return <p className="text-sm text-text-muted">{f.roomsEmpty}</p>;
  }
  const picked = new Map(baseSupplements.rooms.map((room) => [room.roomId, room]));

  return (
    <>
      <Link
        to="/hotel/$hotelId"
        params={{ hotelId: String(basics.hotelId) }}
        target="_blank"
        className="text-xs font-medium text-text-link hover:underline"
      >
        {f.missingRoom}
      </Link>
      <Table
        head={[
          "",
          f.colRoom,
          f.colSupplement,
          ...(split ? [f.colWeekdayPrice, f.colWeekendPrice] : [f.colPrice]),
        ]}
        muted={rooms
          .map((room, index) => (room.id === baseSupplements.baseRoomId ? index : -1))
          .filter((index) => index >= 0)}
        rows={rooms.map((room) => {
          const label = roomLabel(room, lang, f);
          const row = picked.get(room.id);
          const isBase = room.id === baseSupplements.baseRoomId;
          const weekday = row
            ? effectivePrice(baseSupplements.weekdayBaseCost, row.supplement)
            : null;
          const weekend = row
            ? effectivePrice(baseSupplements.weekendBaseCost, row.supplement)
            : null;
          return [
            <RoomTick
              key="tick"
              on={Boolean(row)}
              locked={isBase}
              label={label}
              onToggle={() => dispatch(toggleSupplementRoom(room.id))}
            />,
            isBase ? `${label} · ${f.baseTag}` : label,
            isBase ? (
              f.baseTag
            ) : row ? (
              <AmountInput
                key="supplement"
                aria-label={f.colSupplement}
                {...currencySuffix}
                className="max-w-[160px]"
                value={row.supplement}
                onValue={(value) => dispatch(setRoomSupplement({ roomId: room.id, value }))}
              />
            ) : (
              "-"
            ),
            money(weekday),
            ...(split ? [money(weekend)] : []),
          ];
        })}
      />
    </>
  );
}
