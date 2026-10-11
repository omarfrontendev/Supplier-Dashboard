import { useQuery } from "@tanstack/react-query";
import { endpoints } from "@/api/endpoints";
import { api } from "@/api/client";
import { ApiResponse } from "../profile-permissions/userProfiles";

export interface AmenityOption {
  id: number;
  nameEn: string;
  nameAr: string;
}

export const fetchAmenityOptions = async (): Promise<AmenityOption[]> => {
  const response = await api.get<ApiResponse<AmenityOption[]>>(
    endpoints.amenities.options,
  );

  return response.data.data;
};

export const useAmenityOptions = () => {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["amenities", "options"],
    queryFn: fetchAmenityOptions,
  });

  return {
    amenities: data?.amenities ?? [],
    isLoading,
    isError: error,
    refetch,
  };
};