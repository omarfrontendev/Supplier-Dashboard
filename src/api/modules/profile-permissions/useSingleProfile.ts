import { useQuery } from "@tanstack/react-query";
import { endpoints } from "@/api/endpoints";
import { PermissionProfile } from "./types";
import { api } from "@/api/client";
import { ApiResponse } from "./userProfiles";

const fetchSingleRole = async (
  id: string,
): Promise<PermissionProfile> => {
  const response = await api.get<ApiResponse<PermissionProfile>>(
    endpoints.profiles.getProfileById(id),
  );

  return response.data.data;
};

export const useSingleRole = (id?: string) => {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["permission-profile", id],
    queryFn: () => fetchSingleRole(id!),
    enabled: !!id,
  });

  return {
    role: data,
    isLoading,
    isError: error,
    refetch,
  };
};