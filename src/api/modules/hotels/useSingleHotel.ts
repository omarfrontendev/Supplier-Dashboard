import { useQuery } from "@tanstack/react-query";
import { endpoints } from "@/api/endpoints";
import { api } from "@/api/client";
import { ApiResponse } from "../profile-permissions/userProfiles";
import { LinkedHotelResponse } from "@/store/features/hotels/types";

export const fetchSingleHotel = async (
  id: string,
): Promise<LinkedHotelResponse> => {
  const response = await api.get<ApiResponse<LinkedHotelResponse>>(
    endpoints.hotels.getHotelById(id),
  );

  return response.data.data;
};

export const useSingleHotel = (id?: string) => {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["hotels", id],
    queryFn: () => fetchSingleHotel(id!),
    enabled: !!id,
  });

  return {
    hotel: data,
    isLoading,
    isError: error,
    refetch,
  };
};