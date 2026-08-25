// src/api/modules/areas.ts
import type { AreaBody, FetchAreasResponse, FetchVendorAreasResponse, GetAreasParams, GetVendorAreasParams } from "@/types/area";
import { api } from "@/core/api/client";
import { endpoints } from "../endpoints";

// ✅ API functions
export const getAreas = async (): Promise<AreaBody[]> => {
  const params: GetAreasParams = {
    page: 1,
    limit: 100,
  }

  const response = await api.get<FetchAreasResponse>(`${endpoints.areas.list}`, { params });
  return response.data?.data?.Area ?? [];
};

export const getVendorAreas = async (vendorId: number): Promise<AreaBody[]> => {
  const params: GetVendorAreasParams = {
    page: 1,
    limit: 100,
    vendorId
  }

  const response = await api.get<FetchVendorAreasResponse>(`${endpoints.childVendors.getAreas}`, { params });
  return response.data?.data?.VendorArea ?? [];
};

export const deleteArea = async (areaId: string): Promise<void> => {
  await api.delete(`${endpoints.areas.delete}/${areaId}`);
};