import { useQuery } from "@tanstack/react-query";

import { endpoints } from "@/api/endpoints";
import { api } from "@/api/client";

import type { ApiResponse } from "../profile-permissions/userProfiles";
import type {
  RatesAvailabilityContractsData,
  FetchHotelContractsParams,
} from "./types";

export const fetchRatesAvailabilityContracts = async ({
  hotelId,
  page,
  limit,
  search,
}: FetchHotelContractsParams & { search?: string }): Promise<RatesAvailabilityContractsData> => {
  const response = await api.get<ApiResponse<RatesAvailabilityContractsData>>(
    endpoints.ratesAvailability.contracts(String(hotelId)),
    {
      params: { page, limit, search: search || undefined },
    },
  );

  return response.data.data;
};

interface UseRatesAvailabilityContractsParams {
  hotelId?: number | string | null;
  page: number;
  limit: number;
  search?: string;
}

export const useRatesAvailabilityContracts = ({
  hotelId,
  page,
  limit,
  search = "",
}: UseRatesAvailabilityContractsParams) => {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["rates-availability", "contracts", hotelId, page, limit, search],
    queryFn: () =>
      fetchRatesAvailabilityContracts({
        hotelId: hotelId!,
        page,
        limit,
        search,
      }),
    enabled: hotelId !== undefined && hotelId !== null,
  });

  return {
    contracts: data?.contracts ?? [],
    meta: data?.meta,
    emptyState: data?.emptyState,
    isLoading,
    isError: error,
    refetch,
  };
};