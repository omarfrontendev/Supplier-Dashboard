import { useQuery } from "@tanstack/react-query";

import { api } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import type { ApiResponse } from "../profile-permissions/userProfiles";

export interface UnreadNotificationsCount {
  count: number;
}

export const fetchUnreadNotificationsCount = async (): Promise<UnreadNotificationsCount> => {
  const response = await api.get<ApiResponse<UnreadNotificationsCount>>(
    endpoints.notifications.unreadCount,
  );

  return response.data.data;
};

export const useUnreadNotificationsCount = () => {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["suppliers", "notifications", "unread-count"],
    queryFn: fetchUnreadNotificationsCount,
  });

  return {
    unreadCount: data?.count ?? 0,
    isLoading,
    isError: error,
    refetch,
  };
};
