import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { endpoints } from "@/api/endpoints";
import { api } from "@/api/client";
import { getApiErrorMessage } from "@/lib/api-error";

import type { CreateRoomPayload, CreateRoomResponse } from "./types";

export const useCreateRoom = () => {
  return useMutation<CreateRoomResponse, Error, CreateRoomPayload>({
    mutationFn: async (payload) => {
      const { data } = await api.post<CreateRoomResponse>(
        endpoints.requests.createRoomRequest,
        payload,
      );

      return data;
    },

    onSuccess: (data) => {
      toast.success(data?.message || "Room created successfully!");
    },

    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
};