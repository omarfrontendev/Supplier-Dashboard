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
  from,
  to,
  includeExpired,
}: FetchHotelContractsParams & {
  search?: string;
  from?: string;
  to?: string;
  includeExpired?: boolean;
}): Promise<RatesAvailabilityContractsData> => {
  const response = await api.get<ApiResponse<RatesAvailabilityContractsData>>(
    endpoints.ratesAvailability.contracts(String(hotelId)),
    {
      params: {
        page,
        limit,
        search: search || undefined,
        from: from || undefined,
        to: to || undefined,
        includeExpired,
      },
    },
  );

  return response.data.data;
};

interface UseRatesAvailabilityContractsParams {
  hotelId?: number | string | null;
  page: number;
  limit: number;
  search?: string;
  /** Contract period filter; both are left out unless a full range is picked. */
  from?: string | undefined;
  to?: string | undefined;
  includeExpired?: boolean | undefined;
}

export const useRatesAvailabilityContracts = ({
  hotelId,
  page,
  limit,
  search = "",
  from = "",
  to = "",
  includeExpired = false,
}: UseRatesAvailabilityContractsParams) => {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [
      "rates-availability",
      "contracts",
      hotelId,
      page,
      limit,
      search,
      from,
      to,
      includeExpired,
    ],
    queryFn: () =>
      fetchRatesAvailabilityContracts({
        hotelId: hotelId!,
        page,
        limit,
        search,
        from,
        to,
        includeExpired,
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