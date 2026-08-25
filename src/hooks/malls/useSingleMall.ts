import useSWR from 'swr';
import { api } from '@/core/api/client';
import { endpoints } from '@/api/endpoints';
import type { MallBody } from '@/types/malls';

const fetcher = async (url: string) => {
  const { data } = await api.get(url);
  return data?.data;
};

export const useSinglesMall = (id?: string) => {
  const { data, error, isLoading, mutate } = useSWR<MallBody>(
    id ? endpoints.malls.getMallById(id) : null,
    fetcher
  );

  return {
    mall: data,
    isLoading,
    isError: error,
    mutate,
  };
};
