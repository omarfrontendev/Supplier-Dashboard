import { api } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import type {
  ContractHotelsData,
  ContractHotelsResponse,
} from "./types";
import { useQuery } from "@tanstack/react-query";

export interface GetContractHotelsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const fetchContractHotels = async (
  params: GetContractHotelsParams = {},
): Promise<ContractHotelsData> => {
  const response = await api.get<ContractHotelsResponse>(
    endpoints.supplierHotelContracts.hotels,
    {
      params: {
        page: params.page,
        limit: params.limit,
        search: params.search?.trim() || undefined,
      },
    },
  );

  return response.data.data;
};

export const useContractHotels = (
  params: GetContractHotelsParams = {},
) => {
  return useQuery({
    queryKey: ["contract-hotels", params],
    queryFn: () => fetchContractHotels(params),
  });
};