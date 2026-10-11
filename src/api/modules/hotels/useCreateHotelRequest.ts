import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { endpoints } from "@/api/endpoints";
import { api } from "@/api/client";
import { getApiErrorMessage } from "@/lib/api-error";

import type { CreatePropertyPayload } from "./types";

interface CreatePropertyResponse {
  message: string;
  data?: {
    id: number;
  };
}

export const useCreateProperty = () => {
  return useMutation<CreatePropertyResponse, Error, CreatePropertyPayload>({
    mutationFn: async (body) => {
      const { data } = await api.post<CreatePropertyResponse>(
        endpoints.requests.createHotelRequest,
        body,
      );

      return data;
    },

    onSuccess: (data) => {
      toast.success(data?.message || "Property created successfully!");
    },

    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
};