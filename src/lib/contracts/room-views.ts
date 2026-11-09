import type { HotelContractsMetadataData } from "@/api/modules/hotel-contract/types";
import { ROOM_VIEWS } from "@/store/features/contracts/types";

type RoomWithView = { roomSizeId: number | null; view: string | null };

/** Distinct views of the rooms with the given size; `null` size means every room. */
export function viewsForRoomSize(rooms: readonly RoomWithView[], roomSizeId: number | null) {
  return [
    ...new Set(
      rooms
        .filter((room) => roomSizeId === null || room.roomSizeId === roomSizeId)
        .flatMap((room) => (room.view ? [room.view] : [])),
    ),
  ];
}

/**
 * Select options for the known room views (metadata order, deduplicated),
 * limited to the views the hotel has for that room size. `null` size keeps every view.
 */
export function roomViewOptions(
  rooms: readonly RoomWithView[],
  roomSizeId: number | null,
  roomViews: HotelContractsMetadataData["roomViews"] | undefined,
  lang: string,
) {
  const associatedViewIds =
    roomSizeId === null ? null : new Set(viewsForRoomSize(rooms, roomSizeId));
  const seenViewIds = new Set<string>();
  return (roomViews ?? [])
    .filter((option) => {
      if (!ROOM_VIEWS.some((item) => item === option.value)) return false;
      if (associatedViewIds && !associatedViewIds.has(option.value)) return false;
      if (seenViewIds.has(option.value)) return false;
      seenViewIds.add(option.value);
      return true;
    })
    .map((option) => ({
      value: option.value,
      label: lang === "ar" ? option.labelAr : option.labelEn,
    }));
}
