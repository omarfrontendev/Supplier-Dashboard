import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import type { ApiResponse } from "../profile-permissions/userProfiles";

export interface SupplierNotification {
  id: number;
  // Add the remaining fields according to the API response.
}

export interface NotificationsParams {
  page?: number;
  limit?: number;
  isRead?: boolean;
}

export const fetchNotifications = async (
  params: NotificationsParams,
): Promise<SupplierNotification[]> => {
  const response = await api.get<ApiResponse<SupplierNotification[]>>(
    endpoints.notifications.getNotification,
    {
      params,
    },
  );

  return response.data.data;
};

export const useNotifications = (params: NotificationsParams) => {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["suppliers", "notifications", params],
    queryFn: () => fetchNotifications(params),
  });

  return {
    notifications: data?.notifications ?? [],
    isLoading,
    isError: error,
    refetch,
  };
};