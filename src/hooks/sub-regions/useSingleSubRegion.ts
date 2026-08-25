import useSWR from 'swr';
import { api } from '@/core/api/client';
import { endpoints } from '@/api/endpoints';
import type { SubRegionBody } from '@/types/sub-regions';

const fetcher = async (url: string) => {
  const { data } = await api.get(url);
  return data?.data;
};

export const useSinglesSubRegion = (id?: string) => {
  const { data, error, isLoading, mutate } = useSWR<SubRegionBody>(
    id ? endpoints.subRegions.getSubRegionById(id) : null,
    fetcher
  );

  return {
    subRegion: data,
    isLoading,
    isError: error,
    mutate,
  };
};
