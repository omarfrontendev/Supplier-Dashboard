import useSWR from 'swr';
import { api } from '@/core/api/client';
import { endpoints } from '@/api/endpoints';
import type { RegionBody } from '@/types/regions';

const fetcher = async (url: string) => {
  const { data } = await api.get(url);
  return data?.data;
};

export const useSingleRegion = (id?: string) => {
  const { data, error, isLoading, mutate } = useSWR<RegionBody>(
    id ? endpoints.regions.getRegionById(id) : null,
    fetcher
  );

  return {
    region: data,
    isLoading,
    isError: error,
    mutate,
  };
};
