import { useEffect, useMemo, useState } from "react";

import { useContractHotelRooms } from "@/api/modules/hotel-contract/useContractHotelRooms";
import type {
  HotelContractsMetadataData,
  SupplierHotelContractRoom,
} from "@/api/modules/hotel-contract/types";
import { Table } from "@/components/contracts/contract-parts";
import { Button } from "@/components/ui/button";
import { contractRoomLabel } from "@/lib/contract-room-label";
import { useLanguage } from "@/lib/i18n";
import { Select } from "@/components/ui/select";
import { ROOM_SIZES } from "@/lib/room-sizes";
import { effectivePrice, toAmount } from "@/store/features/contracts/contract-payload";
import {
  addSupplementRoom,
  removeSupplementRoomVariation,
  setRoomSupplement,
} from "@/store/features/contracts/contract-draft.slice";
import { ROOM_VIEWS, type RoomView } from "@/store/features/contracts/types";
import {
  AmountInput,
  formatAmount,
  RoomTick,
  useAppDispatch,
  useContractDraft,
} from "./contract-form/shared";

const selectionView = (view: string | null): RoomView =>
  view && ROOM_VIEWS.some((item) => item === view) ? (view as RoomView) : "no_view";

const roomSelectionKey = (roomId: number, view: RoomView) => JSON.stringify(["room", roomId, view]);

const roomRowKey = (room: { roomSizeId: number | null; view: string | null }) =>
  JSON.stringify(["room-variation", room.roomSizeId, selectionView(room.view)]);

export function AvailableHotelRooms({
  hotelId,
  metadata,
  onSelectedRoomDetails,
}: {
  hotelId: number | null;
  metadata: HotelContractsMetadataData | undefined;
  onSelectedRoomDetails: (
    details: Record<number, { roomSizeId: number | null; view: string | null }>,
    loading: boolean,
  ) => void;
}) {
  const { c, lang } = useLanguage();
  const dispatch = useAppDispatch();
  const f = c.builder.form;
  const { basics, pricingModel, weekPricing, baseSupplements } = useContractDraft();
  const [selectedRoomSizeId, setSelectedRoomSizeId] = useState<number | null>(null);
  const [selectedView, setSelectedView] = useState("");
  const availableRoomsQuery = useContractHotelRooms(hotelId, { page: 1, limit: 100 });

  const showPricing = pricingModel === "base_supplements";
  const splitPricing = weekPricing === "weekday_weekend";
  const currencySuffix = basics.currency ? { suffix: basics.currency } : {};
  const money = (amount: number | null) =>
    amount === null ? "-" : formatAmount(amount, lang, basics.currency);
  const baseRoomId = baseSupplements.baseRoomId;

  const availableRooms = availableRoomsQuery.data?.rooms ?? [];
  const rooms = availableRooms.filter(
    (room) =>
      (selectedRoomSizeId === null || room.roomSizeId === selectedRoomSizeId) &&
      (!selectedView || room.view === selectedView),
  );
  const selectedRoomDetails = useMemo(() => {
    const roomById = new Map<number, SupplierHotelContractRoom>();
    for (const room of availableRoomsQuery.data?.rooms ?? []) {
      if (!roomById.has(room.id)) roomById.set(room.id, room);
    }
    const selectedRoomIds = [
      ...(baseSupplements.baseRoomId === null ? [] : [baseSupplements.baseRoomId]),
      ...baseSupplements.rooms.map((room) => room.roomId),
    ];
    return Object.fromEntries(
      [...new Set(selectedRoomIds)].flatMap((roomId) => {
        const room = roomById.get(roomId);
        return room ? [[roomId, { roomSizeId: room.roomSizeId, view: room.view }]] : [];
      }),
    );
  }, [availableRoomsQuery.data?.rooms, baseSupplements.baseRoomId, baseSupplements.rooms]);
  useEffect(() => {
    onSelectedRoomDetails(selectedRoomDetails, availableRoomsQuery.isLoading);
  }, [availableRoomsQuery.isLoading, onSelectedRoomDetails, selectedRoomDetails]);
  const baseRoom =
    baseRoomId === null ? undefined : availableRooms.find((room) => room.id === baseRoomId);
  const baseRowKey = JSON.stringify(["base-room", baseRoomId]);
  const displayedRooms = rooms.filter((room, index) => {
    return rooms.findIndex((candidate) => roomRowKey(candidate) === roomRowKey(room)) === index;
  });

  const orderedRooms = [...displayedRooms].sort((a, b) => {
    if (a.id === baseRoomId) return -1;
    if (b.id === baseRoomId) return 1;
    return 0;
  });
  const selectableRoomKeys = [
    ...new Set(orderedRooms.map((room) => roomSelectionKey(room.id, selectionView(room.view)))),
  ];
  const selectedDisplayedCount = selectableRoomKeys.filter((key) =>
    baseSupplements.rooms.some(
      (room) => roomSelectionKey(room.roomId, selectionView(room.view)) === key,
    ),
  ).length;
  const selectAllChecked =
    selectableRoomKeys.length > 0 && selectedDisplayedCount === selectableRoomKeys.length;
  const selectAllIndeterminate = selectedDisplayedCount > 0 && !selectAllChecked;
  const setDisplayedRoomsSelected = (checked: boolean) => {
    for (const room of orderedRooms) {
      const view = selectionView(room.view);
      const key = roomSelectionKey(room.id, view);
      const isSelected = baseSupplements.rooms.some(
        (selectedRoom) =>
          roomSelectionKey(selectedRoom.roomId, selectionView(selectedRoom.view)) === key,
      );
      if (checked && !isSelected) dispatch(addSupplementRoom({ roomId: room.id, view }));
      if (!checked && isSelected) {
        dispatch(removeSupplementRoomVariation({ roomId: room.id, view }));
      }
    }
  };
  const roomSizeOptions = [
    ...new Set(
      availableRooms.flatMap((room) => (room.roomSizeId === null ? [] : [room.roomSizeId])),
    ),
  ].map((roomSizeId) => {
    const roomSize = ROOM_SIZES.find((size) => size.id === roomSizeId);
    return {
      value: String(roomSizeId),
      label: roomSize ? (lang === "ar" ? roomSize.name_ar : roomSize.name_en) : String(roomSizeId),
    };
  });
  const availableViews = [
    ...new Set(
      availableRooms
        .filter((room) => selectedRoomSizeId === null || room.roomSizeId === selectedRoomSizeId)
        .flatMap((room) => (room.view ? [room.view] : [])),
    ),
  ];
  const viewOptions = availableViews.map((viewValue) => {
    const viewOption = metadata?.roomViews.find((item) => item.value === viewValue);
    return {
      value: viewValue,
      label: viewOption
        ? lang === "ar"
          ? viewOption.labelAr || viewOption.labelEn
          : viewOption.labelEn || viewOption.labelAr
        : viewValue,
    };
  });
  const hasRows = baseRoomId !== null || orderedRooms.length > 0;
  const roomsError = availableRoomsQuery.isError;
  if (!hotelId) {
    return <p className="text-sm text-text-muted">{f.pickHotelFirst}</p>;
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label={c.roomDetails.roomSize}
          placeholder={c.select.placeholder}
          value={selectedRoomSizeId === null ? "" : String(selectedRoomSizeId)}
          onChange={(value) => {
            setSelectedRoomSizeId(value ? Number(value) : null);
            setSelectedView("");
          }}
          options={roomSizeOptions}
          loading={availableRoomsQuery.isLoading}
          clearable
        />
        <Select
          label={f.view}
          placeholder={f.viewPh}
          value={selectedView}
          onChange={setSelectedView}
          options={viewOptions}
          loading={availableRoomsQuery.isLoading}
          clearable
        />
      </div>
      {hotelId && availableRoomsQuery.isLoading && (
        <p className="text-sm text-text-muted">{f.roomsLoading}</p>
      )}
      {roomsError && (
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm text-status-danger">{f.roomsError}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              void availableRoomsQuery.refetch();
            }}
          >
            {f.retry}
          </Button>
        </div>
      )}
      {hasRows ? (
        <Table
          head={[
            <label key="select-all" className="inline-flex items-center gap-2">
              <RoomTick
                on={selectAllChecked}
                indeterminate={selectAllIndeterminate}
                locked={selectableRoomKeys.length === 0}
                label={c.contractFlow.selectAll}
                onToggle={() => setDisplayedRoomsSelected(!selectAllChecked)}
              />
              {/* <span>{c.contractFlow.selectAll}</span> */}
            </label>,
            f.colRoom,
            f.colView,
            ...(showPricing
              ? [
                  f.colSupplement,
                  ...(splitPricing ? [f.colWeekdayPrice, f.colWeekendPrice] : [f.colPrice]),
                ]
              : []),
          ]}
          muted={baseRoomId === null ? [] : [0]}
          rows={[
            ...(baseRoomId === null
              ? []
              : [
                  {
                    id: baseRoomId,
                    room: baseRoom,
                    rowKey: baseRowKey,
                    isBase: true,
                  },
                ]),
            ...orderedRooms.map((room) => ({
              id: room.id,
              room,
              rowKey: roomRowKey(room),
              isBase: false,
            })),
          ].map(({ id, room, rowKey, isBase }) => {
            const name = contractRoomLabel(room ?? { id }, lang);
            const view = room?.view
              ? metadata?.roomViews.find((item) => item.value === room.view)
              : undefined;
            const viewLabel = room?.view
              ? view
                ? lang === "ar"
                  ? view.labelAr || view.labelEn
                  : view.labelEn || view.labelAr
                : room.view
              : "-";
            const variationView = selectionView(room?.view ?? null);
            const selectionKey = isBase ? null : roomSelectionKey(id, variationView);
            const selected =
              isBase ||
              (selectionKey !== null &&
                baseSupplements.rooms.some(
                  (selectedRoom) =>
                    roomSelectionKey(selectedRoom.roomId, selectionView(selectedRoom.view)) ===
                    selectionKey,
                ));
            const hasBaseRoom = baseSupplements.baseRoomId !== null;
            const supplement =
              baseSupplements.rooms.find(
                (selectedRoom) =>
                  roomSelectionKey(selectedRoom.roomId, selectionView(selectedRoom.view)) ===
                  selectionKey,
              )?.supplement ?? "";
            const priceFor = (baseCost: string) =>
              hasBaseRoom ? effectivePrice(baseCost, supplement) : null;

            return [
              <RoomTick
                key={rowKey}
                on={selected}
                locked={isBase}
                // label={isBase ? `${name} · ${f.baseTag}` : `${name} · ${viewLabel}`}
                label=""
                onToggle={() => {
                  if (selectionKey === null) return;
                  const isSelected = baseSupplements.rooms.some(
                    (selectedRoom) =>
                      roomSelectionKey(selectedRoom.roomId, selectionView(selectedRoom.view)) ===
                      selectionKey,
                  );
                  if (!isSelected) {
                    dispatch(addSupplementRoom({ roomId: id, view: variationView }));
                  } else {
                    dispatch(removeSupplementRoomVariation({ roomId: id, view: variationView }));
                  }
                }}
              />,
              <span key={`room-${rowKey}`}>
                {name}
                {isBase && <span className="ms-2 text-xs text-brand-mid">{f.baseTag}</span>}
                <span className="ms-2 text-xs text-text-muted">#{id}</span>
              </span>,
              isBase ? "-" : viewLabel,
              ...(showPricing
                ? [
                    isBase ? (
                      splitPricing ? (
                        `${money(toAmount(baseSupplements.weekdayBaseCost))} / ${money(
                          toAmount(baseSupplements.weekendBaseCost),
                        )}`
                      ) : (
                        money(toAmount(baseSupplements.weekdayBaseCost))
                      )
                    ) : !selected ? (
                      "-"
                    ) : (
                      <AmountInput
                        key={`supplement-${rowKey}`}
                        type="number"
                        min="0"
                        step="0.01"
                        aria-label={`${f.colSupplement} · ${name}`}
                        {...currencySuffix}
                        className="max-w-[160px]"
                        value={supplement}
                        onValue={(value) =>
                          dispatch(setRoomSupplement({ roomId: id, view: variationView, value }))
                        }
                      />
                    ),
                    ...(splitPricing
                      ? [
                          isBase
                            ? money(toAmount(baseSupplements.weekdayBaseCost))
                            : selected
                              ? money(priceFor(baseSupplements.weekdayBaseCost))
                              : "-",
                          isBase
                            ? money(toAmount(baseSupplements.weekendBaseCost))
                            : selected
                              ? money(priceFor(baseSupplements.weekendBaseCost))
                              : "-",
                        ]
                      : [
                          isBase
                            ? money(toAmount(baseSupplements.weekdayBaseCost))
                            : selected
                              ? money(priceFor(baseSupplements.weekdayBaseCost))
                              : "-",
                        ]),
                  ]
                : []),
            ];
          })}
        />
      ) : !availableRoomsQuery.isLoading && !roomsError ? (
        <p className="text-sm text-text-muted">{f.roomsEmpty}</p>
      ) : null}
    </>
  );
}
