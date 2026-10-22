import { useQuery } from "@tanstack/react-query";

import type {
  GetHotelContractsParams,
  SupplierHotelContractsResponse,
  SupplierHotelContractsData,
} from "./types.ts";
import { endpoints } from "../../endpoints.ts";
import { api } from "@/api/client.ts";
import { cleanAndTrim } from "@/lib/clean-data.ts";

const fetchHotelContracts = async (
  params: GetHotelContractsParams,
): Promise<SupplierHotelContractsData> => {
  const response = await api.get<SupplierHotelContractsResponse>(
    endpoints.supplierHotelContracts.list,
    {
      params: {
        page: params.page,
        limit: params.limit,
        search: params.search?.trim() || undefined,
        hotelId: params.hotelId,
        pricingModel: params.pricingModel,
        status: params.status,
      },
    },
  );

  return response.data.data;
};

export const useHotelContracts = (params: GetHotelContractsParams = {}) => {
  return useQuery({
    queryKey: ["hotel-contracts", params],

    queryFn: () => fetchHotelContracts(cleanAndTrim(params)),
    // queryFn:x
  });
};
