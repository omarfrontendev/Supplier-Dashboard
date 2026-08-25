import useSWR from 'swr';
import { api } from '@/core/api/client';
import { endpoints } from '@/api/endpoints';
import type { VendorBody } from '@/types/vendors';

const fetcher = async (url: string) => {
  const { data } = await api.get(url);
  return data?.data;
};

export const useSingleVendor = (id?: string) => {
  const { data, error, isLoading, mutate } = useSWR<VendorBody>(
    id ? endpoints.vendors.getVendorById(id) : null,
    fetcher
  );

  return {
    vendor: data,
    isLoading,
    isError: error,
    mutate,
  };
};
