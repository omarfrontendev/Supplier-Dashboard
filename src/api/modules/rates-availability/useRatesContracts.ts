import { useQuery } from "@tanstack/react-query";

import { api } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import { fetchAllPages } from "./fetchAllPages";
import type { RatesContractsData, RatesContractsResponse, RatesPageParams } from "./types";

export const fetchRatesHotelContracts = async (
  hotelId: number,
  params: RatesPageParams = {},
): Promise<RatesContractsData> => {
  const response = await api.get<RatesContractsResponse>(
    endpoints.ratesAndAvailability.hotelContracts(hotelId),
    { params: { page: params.page, limit: params.limit } },
  );
  return response.data.data;
};

export const fetchAllRatesHotelContracts = (hotelId: number) =>
  fetchAllPages(async (page) => {
    const data = await fetchRatesHotelContracts(hotelId, { page, limit: 100 });
    return { items: data.contracts, meta: data.meta };
  });

export const useRatesHotelContracts = (hotelId: number | null | undefined) => {
  return useQuery({
    queryKey: ["rates-availability", "contracts", hotelId],
    queryFn: () => fetchAllRatesHotelContracts(hotelId!),
    enabled: hotelId !== null && hotelId !== undefined,
  });
};
