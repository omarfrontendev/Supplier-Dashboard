import { useQuery } from "@tanstack/react-query";
import { endpoints } from "@/api/endpoints";
import { api } from "@/api/client";
import { ApiResponse } from "../profile-permissions/userProfiles";

// Replace this with your actual room response type.
export interface LinkedHotelRoom {
  id: number;
  nameEn: string;
  nameAr: string;
  status: string;
}

export const fetchHotelRooms = async (
  hotelId: string,
): Promise<LinkedHotelRoom[]> => {
  const response = await api.get<ApiResponse<LinkedHotelRoom[]>>(
    endpoints.hotels.getHotelRooms(hotelId),
  );

  return response.data.data;
};

export const useHotelRooms = (hotelId?: string) => {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["linked-hotels", hotelId, "rooms"],
    queryFn: () => fetchHotelRooms(hotelId!),
    enabled: !!hotelId,
  });

  return {
    rooms: data?.rooms ?? [],
    isLoading,
    isError: error,
    refetch,
  };
};