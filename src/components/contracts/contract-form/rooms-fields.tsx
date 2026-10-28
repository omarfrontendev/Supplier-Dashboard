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
  removeSupplementRoom,
  setFixedPrice,
  setRoomSupplement,
} from "@/store/features/contracts/contract-draft.slice";
import { AddRoomDialog, mealOptionsFrom } from "./add-room-dialog";
import {
  AmountInput,
  formatAmount,
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
  if (pricingModel === "base_supplements" && baseSupplements.baseRoomId === null) {
    return null;
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
    const mealLabel = new Map(
      mealOptionsFrom(metadata, lang).map((option) => [option.value, option.label]),
    );
    const t = f.mealsTable;
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
                <ul key="meals" className="space-y-0.5">
                  {row.meals.map((meal) => (
                    <li key={meal.plan} className="text-sm text-text-primary">
                      {mealLabel.get(meal.plan) ?? meal.plan}
                      {meal.plan !== "room_only" && (
                        <span className="text-text-muted">
                          {` · +${money(toAmount(meal.price))} ${
                            meal.basis === "per_person" ? t.perPerson : t.perRoom
                          }`}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>,
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
            pricingModel="fixed_price"
            onClose={() => setAdding(false)}
          />
        )}
      </>
    );
  }

  const roomById = new Map(rooms.map((room) => [room.id, room]));
  const roomForId = (roomId: number) =>
    roomById.get(roomId) ??
    ({
      id: roomId,
      hotelId: basics.hotelId!,
      nameEn: `#${roomId}`,
      nameAr: `#${roomId}`,
      view: null,
      maxOccupancy: null,
      adults: null,
      bedTypeId: null,
      roomSizeId: null,
      areaSqm: null,
      status: "active",
    } satisfies SupplierHotelContractRoom);
  const baseRoom =
    baseSupplements.baseRoomId === null ? undefined : roomForId(baseSupplements.baseRoomId);
  const displayRows = [
    ...(baseRoom ? [{ room: baseRoom, row: undefined, index: -1, isBase: true }] : []),
    ...baseSupplements.rooms.map((row, index) => ({
      room: roomForId(row.roomId),
      row,
      index,
      isBase: false,
    })),
  ];
  const labelForRoom = (room: SupplierHotelContractRoom) =>
    (lang === "ar" ? room.nameAr || room.nameEn : room.nameEn || room.nameAr) || `#${room.id}`;

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setAdding(true)}>
        <Plus className="h-4 w-4" aria-hidden="true" />
        {c.builder.addRoom}
      </Button>
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
        className="text-xs font-medium text-text-link hover:underline block mt-2"
      >
        {f.missingRoom}
      </Link>
      <Table
        head={[
          f.colRoom,
          f.colView,
          f.colSupplement,
          ...(split ? [f.colWeekdayPrice, f.colWeekendPrice] : [f.colPrice]),
          "",
        ]}
        muted={baseRoom ? [0] : []}
        rows={displayRows.map(({ room, row, index, isBase }) => {
          const label = labelForRoom(room);
          const view = isBase ? undefined : row?.view;
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
            isBase ? `${label} · ${f.baseTag}` : label,
            view ? f.views[view] : "-",
            isBase ? (
              f.baseTag
            ) : row ? (
              <AmountInput
                key="supplement"
                aria-label={f.colSupplement}
                {...currencySuffix}
                className="max-w-[160px]"
                value={row.supplement}
                onValue={(value) => dispatch(setRoomSupplement({ index, value }))}
              />
            ) : (
              "-"
            ),
            money(weekday),
            ...(split ? [money(weekend)] : []),
            isBase ? (
              ""
            ) : (
              <Button
                key="remove"
                variant="ghost"
                size="icon-sm"
                aria-label={fill(f.remove, { room: label })}
                onClick={() => dispatch(removeSupplementRoom(index))}
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </Button>
            ),
          ];
        })}
      />
      {adding && (
        <AddRoomDialog
          hotelId={basics.hotelId}
          metadata={metadata}
          metadataLoading={metadataLoading}
          metadataError={metadataError}
          onRetryMetadata={onRetryMetadata}
          pricingModel="base_supplements"
          onClose={() => setAdding(false)}
        />
      )}
    </>
  );
}
