import { useQuery } from "@tanstack/react-query";

import { api } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import type {
  GetSupplierHotelContractRoomsParams,
  SupplierHotelContractRoomsData,
  SupplierHotelContractRoomsResponse,
} from "./types";

const optionalNumber = (value: number | null | undefined) =>
  value !== null && value !== undefined && Number.isFinite(value) ? value : undefined;

const optionalString = (value: string | null | undefined) => value?.trim() || undefined;

const normalizeParams = (
  params: GetSupplierHotelContractRoomsParams,
): GetSupplierHotelContractRoomsParams => {
  const page = optionalNumber(params.page);
  const limit = optionalNumber(params.limit);
  const search = optionalString(params.search);
  const sortOrder = optionalString(params.sortOrder);
  const sortBy = optionalString(params.sortBy);
  const view = optionalString(params.view);
  const bedTypeId = optionalNumber(params.bedTypeId);
  const roomSizeId = optionalNumber(params.roomSizeId);
  const minCapacity = optionalNumber(params.minCapacity);
  const maxCapacity = optionalNumber(params.maxCapacity);

  return {
    ...(page !== undefined ? { page } : {}),
    ...(limit !== undefined ? { limit } : {}),
    ...(search !== undefined ? { search } : {}),
    ...(sortOrder !== undefined ? { sortOrder } : {}),
    ...(sortBy !== undefined ? { sortBy } : {}),
    ...(view !== undefined ? { view } : {}),
    ...(bedTypeId !== undefined ? { bedTypeId } : {}),
    ...(roomSizeId !== undefined ? { roomSizeId } : {}),
    ...(minCapacity !== undefined ? { minCapacity } : {}),
    ...(maxCapacity !== undefined ? { maxCapacity } : {}),
  };
};

export const fetchContractHotelRooms = async (
  hotelId: number,
  params: GetSupplierHotelContractRoomsParams = {},
): Promise<SupplierHotelContractRoomsData> => {
  const queryParams = normalizeParams(params);
  const response = await api.get<SupplierHotelContractRoomsResponse>(
    endpoints.supplierHotelContracts.rooms(hotelId),
    { params: queryParams },
  );
  return response.data.data;
};

export const useContractHotelRooms = (
  hotelId: number | null | undefined,
  params: GetSupplierHotelContractRoomsParams = {},
) => {
  const queryParams = normalizeParams(params);

  return useQuery({
    queryKey: ["hotel-contracts", hotelId, "rooms", queryParams],
    queryFn: () => fetchContractHotelRooms(hotelId!, queryParams),
    enabled: hotelId !== null && hotelId !== undefined,
  });
};
