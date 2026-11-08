import { isAxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

import type { SupplierHotelContractResponse } from "./types";
import { endpoints } from "@/api/endpoints";
import { api } from "@/api/client";

export const hotelContractKey = (id: number | null) => ["hotel-contracts", "detail", id];

const fetchHotelContract = async (id: number) => {
  const response = await api.get<SupplierHotelContractResponse>(
    endpoints.supplierHotelContracts.byId(id),
  );
  return response.data.data;
};

export const useHotelContract = (id: number | null) =>
  useQuery({
    queryKey: hotelContractKey(id),
    queryFn: () => fetchHotelContract(id!),
    enabled: id !== null,
    refetchOnWindowFocus: false,
    retry: (failures, error) =>
      !(isAxiosError(error) && error.response?.status === 404) && failures < 3,
  });
