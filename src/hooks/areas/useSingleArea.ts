import useSWR from 'swr';
import { api } from '@/core/api/client';
import type { AreaBody } from '@/types/area';
import { endpoints } from '@/api/endpoints';

const fetcher = async (url: string) => {
  const { data } = await api.get(url);
  return data?.data;
};

export const useSingleArea = (id?: string) => {
  const { data, error, isLoading, mutate } = useSWR<AreaBody>(
    id ? endpoints.areas.getById(id) : null,
    fetcher
  );

  return {
    area: data,
    isLoading,
    isError: error,
    mutate,
  };
};
