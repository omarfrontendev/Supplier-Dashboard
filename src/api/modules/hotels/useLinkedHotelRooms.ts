import { useQuery } from "@tanstack/react-query";
import { endpoints } from "@/api/endpoints";
import { api } from "@/api/client";
import type { ApiResponse } from "../profile-permissions/userProfiles";
import type { RoomView } from "@/store/features/contracts/types";

export interface LinkedHotelRoom {
  id: number;
  hotelId: number;
  nameEn: string;
  nameAr: string;
  maxOccupancy: number;
  adults: number;
  children: number;
  maxChildAge: number | null;
  view: RoomView | null;
  status: "draft" | "pending" | "active" | "inactive" | "rejected";
}

interface LinkedHotelRoomsData {
  rooms: LinkedHotelRoom[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

const fetchLinkedHotelRooms = async (hotelId: number) => {
  const response = await api.get<ApiResponse<LinkedHotelRoomsData>>(
    endpoints.hotels.getLinkedHotelRooms(hotelId),
    { params: { page: 1, limit: 100 } },
  );
  return response.data.data;
};

export const useLinkedHotelRooms = (hotelId: number | null) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["linked-hotels", hotelId, "rooms"],
    queryFn: () => fetchLinkedHotelRooms(hotelId!),
    enabled: hotelId !== null,
  });

  return {
    rooms: (data?.rooms ?? []).filter((room) => room.status === "active"),
    isLoading,
    isError,
    refetch,
  };
};
