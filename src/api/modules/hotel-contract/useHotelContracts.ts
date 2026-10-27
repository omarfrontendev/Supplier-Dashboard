import { isAxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

import type {
  GetHotelContractsParams,
  SupplierHotelContractsResponse,
} from "./types.ts";
import { endpoints } from "../../endpoints.ts";
import { api } from "@/api/client.ts";
import type { ApiResponse } from "../profile-permissions/userProfiles.ts";

export const fetchHotelContracts = async (
  params: GetHotelContractsParams,
): Promise<SupplierHotelContractsResponse> => {
  const query = new URLSearchParams();

  // Pagination
  if (params.page !== undefined) {
    query.set("page", String(params.page));
  }

  if (params.limit !== undefined) {
    query.set("limit", String(params.limit));
  }

  // Search
  if (params.search?.trim()) {
    query.set("search", params.search.trim());
  }

  // Hotel filter
  if (params.hotelId !== undefined) {
    query.set("hotelId", String(params.hotelId));
  }

  // Pricing model filter
  if (params.pricingModel) {
    query.set("pricingModel", params.pricingModel);
  }

  // Coverage period filters
  const periods = params.periods ?? [];

  // "everything" means no period filter.
  if (!periods.includes("everything")) {
    periods.forEach((period) => {
      query.append("periods", period);
    });
  }

  // Custom date range
  if (periods.includes("custom")) {
    if (!params.dateFrom || !params.dateTo) {
      throw new Error(
        "Both dateFrom and dateTo are required for a custom date range.",
      );
    }

    if (params.dateFrom > params.dateTo) {
      throw new Error(
        "dateFrom must be before or equal to dateTo.",
      );
    }

    query.set("dateFrom", params.dateFrom);
    query.set("dateTo", params.dateTo);
  }

  // Sorting is optional.
  // When undefined, the backend applies its default ordering.
  if (params.sortBy) {
    query.set("sortBy", params.sortBy);
  }

  const queryString = query.toString();
  const url = queryString
    ? `${endpoints.supplierHotelContracts.list}?${queryString}`
    : endpoints.supplierHotelContracts.list;

  const { data } = await api.get<
    ApiResponse<SupplierHotelContractsResponse>
  >(url);

  return data.data;
};

export const useHotelContracts = (
  params: GetHotelContractsParams,
) => {
  const normalizedParams = {
    ...params,
    search: params.search?.trim() ?? "",
    periods: params.periods?.includes("everything")
      ? ["everything" as const]
      : [...(params.periods ?? [])].sort(),
    dateFrom: params.periods?.includes("custom")
      ? params.dateFrom ?? ""
      : "",
    dateTo: params.periods?.includes("custom")
      ? params.dateTo ?? ""
      : "",
    sortBy: params.sortBy || undefined,
  };

  return useQuery({
    queryKey: ["hotel-contracts", normalizedParams],
    queryFn: () => fetchHotelContracts(params),
    retry: (failures, error) =>
      !(isAxiosError(error) && error.response?.status === 403) && failures < 3,
  });
};