import { useQuery } from "@tanstack/react-query";

import { api } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import type {
  HotelContractFinalizationReview,
  HotelContractFinalizationReviewResponse,
} from "./finalization-types";

export const hotelContractFinalizationReviewKey = (id: number | null | undefined) =>
  ["hotel-contracts", "finalization-review", id] as const;

const isValidContractId = (id: number | null | undefined): id is number =>
  id !== null && id !== undefined && Number.isSafeInteger(id) && id > 0;

export const fetchHotelContractFinalizationReview = async (
  id: number,
): Promise<HotelContractFinalizationReview> => {
  const response = await api.get<HotelContractFinalizationReviewResponse>(
    endpoints.supplierHotelContracts.finalizationReview(id),
  );
  return response.data.data;
};

export const useHotelContractFinalizationReview = (id: number | null | undefined) =>
  useQuery<HotelContractFinalizationReview, Error>({
    queryKey: hotelContractFinalizationReviewKey(id),
    queryFn: () => {
      if (!isValidContractId(id)) {
        throw new Error("A valid contract ID is required to fetch its finalization review.");
      }
      return fetchHotelContractFinalizationReview(id);
    },
    enabled: isValidContractId(id),
    refetchOnWindowFocus: false,
  });
