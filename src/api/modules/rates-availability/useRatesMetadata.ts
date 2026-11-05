import { useQuery } from "@tanstack/react-query";

import { api } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import type { RatesEnvelope, RatesMetadataData } from "./types";

export const useRatesMetadata = (enabled = true) => {
  return useQuery({
    queryKey: ["rates-availability", "metadata"],
    queryFn: async () => {
      const response = await api.get<RatesEnvelope<RatesMetadataData>>(
        endpoints.ratesAndAvailability.metadata,
      );
      return response.data.data;
    },
    enabled,
    staleTime: 10 * 60 * 1000,
  });
};
