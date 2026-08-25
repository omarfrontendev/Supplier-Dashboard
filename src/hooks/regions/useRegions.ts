// src/hooks/useUsers.ts
import { api } from '@/core/api/client';
import { endpoints } from '@/api/endpoints';
import type { FetchRegionsResponse, FetchVendorRegionsResponse, RegionBody } from '@/types/regions';
import useSWR from 'swr';

const fetcher = async (url: string): Promise<RegionBody[]> => {
    const response = await api.get<FetchRegionsResponse>(url);
    return response.data?.data?.Region;
};

const vendorRegionsfetcher = async (url: string): Promise<RegionBody[]> => {
    const response = await api.get<FetchVendorRegionsResponse>(url);
    return response.data?.data?.VendorRegion;
};

export const useAllRegions = () => {
    const { data, error, isLoading, mutate } = useSWR<RegionBody[]>(`${endpoints.regions.getRegions}?page=1&limit=100`, fetcher);

    return {
        regions: data || [],
        isLoading,
        isError: error,
        mutate,
    };
};

export const useRegions = (areaId?: number) => {
    const { data, error, isLoading, mutate } = useSWR<RegionBody[]>(areaId ? `${endpoints.regions.getRegions}?page=1&limit=100&areaId=${areaId}` : null, fetcher, {
        revalidateOnFocus: false,
        revalidateIfStale: true,
        dedupingInterval: 0,
    });

    return {
        regions: data || [],
        isLoading,
        isError: error,
        mutate,
    };
};

export const useVendorRegions = (areaId?: number) => {
    const { data, error, isLoading, mutate } = useSWR<RegionBody[]>(areaId ? `${endpoints.childVendors.getRegions}?page=1&limit=100&areaId=${areaId}` : null, vendorRegionsfetcher, {
        revalidateOnFocus: false,
        revalidateIfStale: true,
        dedupingInterval: 0,
    });

    return {
        regions: data || [],
        isLoading,
        isError: error,
        mutate,
    };
};
