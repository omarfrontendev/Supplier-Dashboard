import { useMutation, useQueryClient } from "@tanstack/react-query";

import type {
  CreateHotelContractBody,
  SupplierHotelContractResponse,
  UpdateHotelContractBody,
} from "./types";
import { hotelContractKey } from "./useHotelContract";
import { endpoints } from "@/api/endpoints";
import { api } from "@/api/client";

type SaveContractInput =
  | { id: null; body: CreateHotelContractBody }
  | { id: number; body: UpdateHotelContractBody };

export const useSaveHotelContract = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, body }: SaveContractInput) => {
      const response =
        id === null
          ? await api.post<SupplierHotelContractResponse>(
              endpoints.supplierHotelContracts.create,
              body,
            )
          : await api.patch<SupplierHotelContractResponse>(
              endpoints.supplierHotelContracts.byId(id),
              body,
            );
      return response.data.data;
    },
    onSuccess: (contract) => {
      queryClient.setQueryData(hotelContractKey(contract.id), contract);
      queryClient.invalidateQueries({ queryKey: ["hotel-contracts"], exact: false });
    },
  });
};
