// src/hooks/useUsers.ts
import { api } from '@/core/api/client';
import { endpoints } from '@/api/endpoints';
import type { FetchMallsResponse, FetchVendorMallsResponse, MallBody } from '@/types/malls';
import useSWR from 'swr';

const fetcher = async (url: string): Promise<MallBody[]> => {
    const response = await api.get<FetchMallsResponse>(url);
    return response.data?.data?.Mall;
};

const vendorMallsFetcher = async (url: string): Promise<MallBody[]> => {
    const response = await api.get<FetchVendorMallsResponse>(url);
    return response.data?.data?.VendorMall;
};


export const useAllMalls = () => {
    const { data, error, isLoading, mutate } = useSWR<MallBody[]>(`${endpoints.malls.getMalls}?page=1&limit=100`, fetcher);

    return {
        malls: data || [],
        isLoading,
        isError: error,
        mutate,
    };
};

export const useMalls = (subRegionId?: number) => {
    const { data, error, isLoading, mutate } = useSWR<MallBody[]>(subRegionId ? `${endpoints.malls.getMalls}?page=1&limit=100&subRegionId=${subRegionId}` : null, fetcher);

    return {
        malls: data || [],
        isLoading,
        isError: error,
        mutate,
    };
};

export const useVendorMalls = (subRegionId?: number) => {
    const { data, error, isLoading, mutate } = useSWR<MallBody[]>(subRegionId ? `${endpoints.childVendors.getMalls}?page=1&limit=100&subRegionId=${subRegionId}` : null, vendorMallsFetcher);

    return {
        malls: data || [],
        isLoading,
        isError: error,
        mutate,
    };
};
