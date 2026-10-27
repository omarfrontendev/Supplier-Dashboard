import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";

import type {
  HotelContractsMetadataData,
  SupplierHotelContractRoom,
} from "@/api/modules/hotel-contract/types";
import { useContractHotelRooms } from "@/api/modules/hotel-contract/useContractHotelRooms";
import { Table } from "@/components/contracts/contract-parts";
import { Button } from "@/components/ui/button";
import { fill, useLanguage } from "@/lib/i18n";
import { effectivePrice, toAmount } from "@/store/features/contracts/contract-payload";
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
  useAppDispatch,
  useContractDraft,
} from "./shared";

export function RoomsFields({
  metadata,
  metadataLoading,
  metadataError,
  onRetryMetadata,
}: {
  metadata: HotelContractsMetadataData | undefined;
  metadataLoading: boolean;
  metadataError: boolean;
  onRetryMetadata: () => void;
}) {
  const { c, lang } = useLanguage();
  const f = c.builder.form;
  const dispatch = useAppDispatch();
  const { basics, pricingModel, weekPricing, baseSupplements, fixedRooms } = useContractDraft();
  const roomsQuery = useContractHotelRooms(basics.hotelId, { page: 1, limit: 100 });
  const rooms = (roomsQuery.data?.rooms ?? []).filter((room) => room.status === "active");
  const [adding, setAdding] = useState(false);

  const split = weekPricing === "weekday_weekend";
  const currencySuffix = basics.currency ? { suffix: basics.currency } : {};
  const money = (amount: number | null) =>
    amount === null ? "-" : formatAmount(amount, lang, basics.currency);

  if (!basics.hotelId) {
    return <p className="text-sm text-text-muted">{f.pickHotelFirst}</p>;
  }
  if (
    roomsQuery.isLoading &&
    (pricingModel === "fixed_price" || baseSupplements.baseRoomId === null)
  ) {
    return <p className="text-sm text-text-muted">{f.roomsLoading}</p>;
  }
  if (
    roomsQuery.isError &&
    (pricingModel === "fixed_price" || baseSupplements.baseRoomId === null)
  ) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-sm text-status-danger">{f.roomsError}</p>
        <Button variant="outline" size="sm" onClick={() => void roomsQuery.refetch()}>
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
                f.meals[
                  row.mealPlan === "bed_and_breakfast" ? "bed_breakfast" : row.mealPlan
                ],
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
          <AddRoomDialog
            hotelId={basics.hotelId}
            metadata={metadata}
            metadataLoading={metadataLoading}
            metadataError={metadataError}
            onRetryMetadata={onRetryMetadata}
            onClose={() => setAdding(false)}
          />
        )}
      </>
    );
  }

  if (rooms.length === 0 && baseSupplements.baseRoomId === null) {
    return <p className="text-sm text-text-muted">{f.roomsEmpty}</p>;
  }
  const picked = new Map(baseSupplements.rooms.map((room) => [room.roomId, room]));
  const baseRoom =
    rooms.find((room) => room.id === baseSupplements.baseRoomId) ??
    (baseSupplements.baseRoomId === null
      ? undefined
      : ({
          id: baseSupplements.baseRoomId,
          hotelId: basics.hotelId,
          nameEn: `#${baseSupplements.baseRoomId}`,
          nameAr: `#${baseSupplements.baseRoomId}`,
          view: null,
          maxOccupancy: null,
          adults: null,
          bedTypeId: null,
          roomSizeId: null,
          areaSqm: null,
          status: "active",
        } satisfies SupplierHotelContractRoom));
  const displayRooms = baseRoom
    ? [baseRoom, ...rooms.filter((room) => room.id !== baseRoom.id)]
    : rooms;
  const labelForRoom = (room: SupplierHotelContractRoom) =>
    (lang === "ar" ? room.nameAr || room.nameEn : room.nameEn || room.nameAr) || `#${room.id}`;

  return (
    <>
      {roomsQuery.isLoading && (
        <p className="text-sm text-text-muted">{f.roomsLoading}</p>
      )}
      {roomsQuery.isError && (
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm text-status-danger">{f.roomsError}</p>
          <Button variant="outline" size="sm" onClick={() => void roomsQuery.refetch()}>
            {f.retry}
          </Button>
        </div>
      )}
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
        muted={baseRoom ? [0] : []}
        rows={displayRooms.map((room) => {
          const label = labelForRoom(room);
          const row = picked.get(room.id);
          const isBase = room.id === baseSupplements.baseRoomId;
          const weekday = isBase
            ? toAmount(baseSupplements.weekdayBaseCost)
            : row
              ? effectivePrice(baseSupplements.weekdayBaseCost, row.supplement)
              : null;
          const weekend = isBase
            ? toAmount(baseSupplements.weekendBaseCost)
            : row
              ? effectivePrice(baseSupplements.weekendBaseCost, row.supplement)
              : null;
          return [
            <RoomTick
              key="tick"
              on={isBase || Boolean(row)}
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
