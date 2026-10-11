import { useQuery } from "@tanstack/react-query";
import { endpoints } from "@/api/endpoints";
import { api } from "@/api/client";
import { ApiResponse } from "../profile-permissions/userProfiles";

export interface SupplierProfile {
  id: number;
  // Add the remaining fields according to the API response.
}

export const fetchSupplierProfile = async (): Promise<SupplierProfile> => {
  const response = await api.get<ApiResponse<SupplierProfile>>(
    endpoints.suppliers.getProfile,
  );

  return response.data.data;
};

export const useSupplierProfile = () => {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["suppliers", "profile"],
    queryFn: fetchSupplierProfile,
  });

  return {
    profile: data,
    isLoading,
    isError: error,
    refetch,
  };
};