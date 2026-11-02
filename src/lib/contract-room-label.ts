import { ROOM_SIZES } from "@/lib/room-sizes";

export function contractRoomLabel(room: { id: number; roomSizeId?: number | null }, lang: string) {
  const roomSize = ROOM_SIZES.find((size) => size.id === room.roomSizeId);
  return roomSize ? (lang === "ar" ? roomSize.name_ar : roomSize.name_en) : `#${room.id}`;
}
