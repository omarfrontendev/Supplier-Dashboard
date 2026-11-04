import type { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import type {
  FinalizationApiErrorResponse,
  FinalizeHotelContractRequest,
  FinalizeHotelContractResponse,
  FinalizeHotelContractResult,
} from "./finalization-types";
import { hotelContractKey } from "./useHotelContract";

export interface FinalizeHotelContractInput {
  id: number;
  body: FinalizeHotelContractRequest;
  idempotencyKey: string;
}

export const finalizeHotelContract = async ({
  id,
  body,
  idempotencyKey,
}: FinalizeHotelContractInput): Promise<FinalizeHotelContractResult> => {
  const response = await api.post<FinalizeHotelContractResponse>(
    endpoints.supplierHotelContracts.finalize(id),
    body,
    { headers: { "Idempotency-Key": idempotencyKey } },
  );
  return response.data.data;
};

export const useFinalizeHotelContract = () => {
  const queryClient = useQueryClient();

  return useMutation<
    FinalizeHotelContractResult,
    AxiosError<FinalizationApiErrorResponse>,
    FinalizeHotelContractInput
  >({
    mutationFn: finalizeHotelContract,
    retry: false,
    onSuccess: (_result, { id }) => {
      void queryClient.invalidateQueries({
        queryKey: hotelContractKey(id),
        exact: true,
      });
      void queryClient.invalidateQueries({
        queryKey: ["hotel-contracts"],
        exact: false,
      });
    },
  });
};
