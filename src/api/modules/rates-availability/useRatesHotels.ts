import { useQuery } from "@tanstack/react-query";

import { api } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import { fetchAllPages } from "./fetchAllPages";
import type { RatesHotelsData, RatesHotelsResponse, RatesPageParams } from "./types";

export const fetchRatesHotels = async (
  params: RatesPageParams = {},
): Promise<RatesHotelsData> => {
  const response = await api.get<RatesHotelsResponse>(endpoints.ratesAndAvailability.hotels, {
    params: { page: params.page, limit: params.limit },
  });
  return response.data.data;
};

export const fetchAllRatesHotels = () =>
  fetchAllPages(async (page) => {
    const data = await fetchRatesHotels({ page, limit: 100 });
    return { items: data.hotels, meta: data.meta };
  });

export const useRatesHotels = ({ enabled = true }: { enabled?: boolean } = {}) => {
  return useQuery({
    queryKey: ["rates-availability", "hotels"],
    queryFn: fetchAllRatesHotels,
    enabled,
  });
};
