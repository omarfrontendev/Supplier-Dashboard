// src/hooks/useUsers.ts
import { api } from '@/core/api/client';
import { endpoints } from '@/api/endpoints';
import type { FetchSubRegionsResponse, FetchVendorSubRegionsResponse, SubRegionBody } from '@/types/sub-regions';
import useSWR from 'swr';

const fetcher = async (url: string): Promise<SubRegionBody[]> => {
    const response = await api.get<FetchSubRegionsResponse>(url);
    return response.data?.data?.SubRegion;
};

const vendorSubRegionsfetcher = async (url: string): Promise<SubRegionBody[]> => {
    const response = await api.get<FetchVendorSubRegionsResponse>(url);
    return response.data?.data?.VendorSubRegion;
};

export const useAllSubRegions = () => {
    const { data, error, isLoading, mutate } = useSWR<SubRegionBody[]>(`${endpoints.subRegions.getSubRegions}?page=1&limit=100`, fetcher);

    return {
        subRegions: data || [],
        isLoading,
        isError: error,
        mutate,
    };
};

export const useSubRegions = (regionId?: number) => {
    const { data, error, isLoading, mutate } = useSWR<SubRegionBody[]>(regionId ? `${endpoints.subRegions.getSubRegions}?page=1&limit=100&regionId=${regionId}` : null, fetcher);

    return {
        subRegions: data || [],
        isLoading,
        isError: error,
        mutate,
    };
};

export const useVendorSubRegions = (regionId?: number) => {
    const { data, error, isLoading, mutate } = useSWR<SubRegionBody[]>(regionId ? `${endpoints.childVendors.getSubRegions}?page=1&limit=100&regionId=${regionId}` : null, vendorSubRegionsfetcher);

    return {
        subRegions: data || [],
        isLoading,
        isError: error,
        mutate,
    };
};
