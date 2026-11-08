import { useQuery } from "@tanstack/react-query";

import { endpoints } from "@/api/endpoints";
import { api } from "@/api/client";

import type { ApiResponse } from "../profile-permissions/userProfiles";
import type { RatesAvailabilityMetadataData } from "./types";

export const fetchRatesAvailabilityMetadata =
  async (): Promise<RatesAvailabilityMetadataData> => {
    const response = await api.get<
      ApiResponse<RatesAvailabilityMetadataData>
    >(endpoints.ratesAvailability.metadata);

    return response.data.data;
  };

export const useRatesAvailabilityMetadata = () => {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["rates-availability", "metadata"],
    queryFn: fetchRatesAvailabilityMetadata,
    staleTime: Infinity,
  });

  return {
    countries: data?.countries ?? [],
    isLoading,
    isError: error,
    refetch,
  };
};