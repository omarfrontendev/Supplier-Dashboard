import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import { toast } from "sonner";

interface ReadNotificationResponse {
  status: string;
  message: string;
  data: unknown;
}

export const readNotification = async (
  id: number | string,
): Promise<ReadNotificationResponse> => {
  const response = await api.patch<ReadNotificationResponse>(
    endpoints.notifications.readNotification(id),
  );

  return response.data;
};

export const useReadNotification = () => {
  const queryClient = useQueryClient();

  const {
    mutate,
    mutateAsync,
    isPending,
    error,
    isSuccess,
    reset,
  } = useMutation({
    mutationFn: readNotification,

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["suppliers", "notifications"],
      });

      toast.success(data.message || "Notification marked as read successfully!");
    },
  });

  return {
    readNotification: mutate,
    readNotificationAsync: mutateAsync,
    isPending,
    error,
    isSuccess,
    reset,
  };
};