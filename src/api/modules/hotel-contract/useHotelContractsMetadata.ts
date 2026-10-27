import { useQuery } from "@tanstack/react-query";

import type { HotelContractsMetadataResponse } from "./types";
import { endpoints } from "@/api/endpoints";
import { api } from "@/api/client";

export const fetchHotelContractsMetadata = async () => {
  const response = await api.get<HotelContractsMetadataResponse>(
    endpoints.supplierHotelContracts.metadata,
  );
  return response.data.data;
};

export const useHotelContractsMetadata = () =>
  useQuery({
    queryKey: ["hotel-contracts", "metadata"],
    queryFn: fetchHotelContractsMetadata,
    refetchOnWindowFocus: false,
  });
