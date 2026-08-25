import { api } from "@/core/api/client";
import { endpoints } from "@/api/endpoints";
import useSWR from "swr";

const fetcher = async (url: string): Promise<any[]> => {
    const response = await api.get<any>(url);
    return response.data?.data?.VendorDetails;
};


export const useVendors = () => {
    const { data, error, isLoading, mutate } = useSWR<any[]>(`${endpoints.vendors.getVendors}?page=1&limit=100`, fetcher);

    return {
        vendors: data || [],
        isLoading,
        isError: error,
        mutate,
    };
};