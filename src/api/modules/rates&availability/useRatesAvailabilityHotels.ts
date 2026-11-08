import { useQuery } from "@tanstack/react-query";

import { endpoints } from "@/api/endpoints";
import { api } from "@/api/client";

import type { ApiResponse } from "../profile-permissions/userProfiles";
import type {
  RatesAvailabilityHotelsData,
  FetchRatesAvailabilityParams,
} from "./types";

type RatesAvailabilityHotelsParams = FetchRatesAvailabilityParams & {
  search?: string;
};

export const fetchRatesAvailabilityHotels = async ({
  page,
  limit,
  search,
}: RatesAvailabilityHotelsParams): Promise<RatesAvailabilityHotelsData> => {
  const response = await api.get<ApiResponse<RatesAvailabilityHotelsData>>(
    endpoints.ratesAvailability.hotels,
    {
      params: { page, limit, search: search || undefined },
    },
  );

  return response.data.data;
};

export const useRatesAvailabilityHotels = ({
  page,
  limit,
  search = "",
}: RatesAvailabilityHotelsParams) => {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["rates-availability", "hotels", page, limit, search],
    queryFn: () => fetchRatesAvailabilityHotels({ page, limit, search }),
  });

  return {
    hotels: data?.hotels ?? [],
    meta: data?.meta,
    emptyState: data?.emptyState,
    isLoading,
    isError: error,
    refetch,
  };
};