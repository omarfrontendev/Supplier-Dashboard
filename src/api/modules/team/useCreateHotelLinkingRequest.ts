import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { endpoints } from "@/api/endpoints";
import { api } from "@/api/client";
import { getApiErrorMessage } from "@/lib/api-error";

type CreateHotelLinkingRequestParams = {
  hotelIds: number[];
  bookingConfirmationType: "instant" | "on_request";
};

export const useCreateHotelLinkingRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      hotelIds,
      bookingConfirmationType,
    }: CreateHotelLinkingRequestParams) => {
      const { data } = await api.post(
        endpoints.team.createHotelLinkingRequest,
        {
          hotelIds,
          bookingConfirmationType,
        },
      );

      return data;
    },

    onSuccess: (data) => {
      toast.success(data.message);

      queryClient.invalidateQueries({
        queryKey: ["hotels"],
      });

      queryClient.invalidateQueries({
        queryKey: ["hotelOptions"],
      });
    },

    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
};