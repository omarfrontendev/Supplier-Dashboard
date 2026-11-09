import { useQuery } from "@tanstack/react-query";

import { api } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import { fetchAllPages } from "./fetchAllPages";
import type { RatesContractsData, RatesContractsResponse, RatesPageParams } from "./types";

/** Contract period filter; `from`/`to` are left out unless a full range is picked. */
export interface RatesContractsFilters {
  from?: string | undefined;
  to?: string | undefined;
  includeExpired?: boolean | undefined;
}

export const fetchRatesHotelContracts = async (
  hotelId: number,
  params: RatesPageParams & RatesContractsFilters = {},
): Promise<RatesContractsData> => {
  const response = await api.get<RatesContractsResponse>(
    endpoints.ratesAndAvailability.hotelContracts(hotelId),
    {
      params: {
        page: params.page,
        limit: params.limit,
        from: params.from || undefined,
        to: params.to || undefined,
        includeExpired: params.includeExpired,
      },
    },
  );
  return response.data.data;
};

export const fetchAllRatesHotelContracts = (hotelId: number, filters: RatesContractsFilters = {}) =>
  fetchAllPages(async (page) => {
    const data = await fetchRatesHotelContracts(hotelId, { ...filters, page, limit: 100 });
    return { items: data.contracts, meta: data.meta };
  });

export const useRatesHotelContracts = (
  hotelId: number | null | undefined,
  { from = "", to = "", includeExpired = false }: RatesContractsFilters = {},
) => {
  return useQuery({
    queryKey: ["rates-availability", "contracts", hotelId, from, to, includeExpired],
    queryFn: () => fetchAllRatesHotelContracts(hotelId!, { from, to, includeExpired }),
    enabled: hotelId !== null && hotelId !== undefined,
  });
};
