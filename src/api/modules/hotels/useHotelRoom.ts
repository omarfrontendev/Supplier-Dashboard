import { useQuery } from "@tanstack/react-query";
import { endpoints } from "@/api/endpoints";
import { api } from "@/api/client";
import type { ApiResponse } from "../profile-permissions/userProfiles";
import type { PropertyImage } from "./types";

export interface HotelRoomDetail {
  id: number;
  hotelId: number;
  nameEn: string;
  nameAr: string;
  maxOccupancy: number | null;
  adults: number | null;
  children: number | null;
  maxChildAge: number | null;
  bedTypeId: number | null;
  roomSizeId: number | null;
  areaSqm: number | null;
  view: string | null;
  status: string;
  images: PropertyImage[];
}

const fetchHotelRoom = async (hotelId: number, roomId: number) => {
  const response = await api.get<ApiResponse<{ room: HotelRoomDetail }>>(
    endpoints.hotels.getHotelRoomById(hotelId, roomId),
  );
  return response.data.data.room;
};

export const useHotelRoom = (hotelId: number | undefined, roomId: number | null) =>
  useQuery({
    queryKey: ["linking-options", hotelId, "rooms", roomId],
    queryFn: () => fetchHotelRoom(hotelId!, roomId!),
    enabled: hotelId !== undefined && roomId !== null,
  });
