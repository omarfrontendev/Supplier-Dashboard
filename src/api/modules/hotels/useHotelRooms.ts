import { useQuery } from "@tanstack/react-query";
import { endpoints } from "@/api/endpoints";
import { api } from "@/api/client";
import { ApiResponse } from "../profile-permissions/userProfiles";

export interface LinkedHotelRoom {
  id: number;
  nameEn: string;
  nameAr: string;
  status: string;
}

export interface HotelRoomsMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface HotelRoomsData {
  rooms: LinkedHotelRoom[];
  meta: HotelRoomsMeta;
}

interface FetchHotelRoomsParams {
  id: number | string;
  page: number;
  limit: number;
}

export const fetchHotelRooms = async ({
  id,
  page,
  limit,
}: FetchHotelRoomsParams): Promise<HotelRoomsData> => {
  const response = await api.get<ApiResponse<HotelRoomsData>>(
    endpoints.hotels.getHotelRooms(String(id)),
    {
      params: {
        page,
        limit,
      },
    },
  );

  return response.data.data;
};

interface UseHotelRoomsParams {
  id?: number | string;
  page: number;
  limit: number;
}

export const useHotelRooms = ({
  id,
  page,
  limit,
}: UseHotelRoomsParams) => {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["linked-hotels", id, "rooms", page, limit],
    queryFn: () =>
      fetchHotelRooms({
        id: id!,
        page,
        limit,
      }),
    enabled: id !== undefined && id !== null,
  });

  return {
    rooms: data?.rooms ?? [],
    meta: data?.meta,
    isLoading,
    isError: error,
    refetch,
  };
};