import { useQuery } from "@tanstack/react-query";

import { api } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import type { RatesEnvelope, RestrictionsContextData, SellControlScope } from "./types";

export const useRestrictionsContext = (
  contractId: number | undefined,
  scope: SellControlScope | null,
) => {
  return useQuery({
    queryKey: ["rates-availability", "restrictions", contractId, "context", scope],
    queryFn: async () => {
      const response = await api.post<RatesEnvelope<RestrictionsContextData>>(
        endpoints.ratesAndAvailability.restrictionsContext(contractId!),
        scope,
      );
      return response.data.data;
    },
    enabled: contractId !== undefined && scope !== null,
  });
};
