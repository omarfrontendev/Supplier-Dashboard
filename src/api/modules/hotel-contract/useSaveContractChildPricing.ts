import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { ReplaceChildPricingBody, SupplierHotelContractResponse } from "./types";
import { hotelContractKey } from "./useHotelContract";
import { endpoints } from "@/api/endpoints";
import { api } from "@/api/client";

export const useSaveContractChildPricing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, body }: { id: number; body: ReplaceChildPricingBody }) => {
      const response = await api.put<SupplierHotelContractResponse>(
        endpoints.supplierHotelContracts.childPricing(id),
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
