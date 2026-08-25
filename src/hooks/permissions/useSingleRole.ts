import useSWR from 'swr';
import { api } from '@/core/api/client';
import { endpoints } from '@/api/endpoints';

const fetcher = async (url: string) => {
  const { data } = await api.get(url);
  return data?.data;
};

export const useSingleRole = (id?: string) => {
  const { data, error, isLoading, mutate } = useSWR<any>(
    id ? endpoints.permissions.getPermissionById(id) : null,
    fetcher
  );

  return {
    role: data,
    isLoading,
    isError: error,
    mutate,
  };
};
