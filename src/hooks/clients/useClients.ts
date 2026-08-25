// src/hooks/useUsers.ts
import { api } from '@/core/api/client';
import { endpoints } from '@/api/endpoints';
import type { ApiResponse } from '@/types/api';
import type { CreateClientDto } from '@/types/clients';
import useSWR from 'swr';

const fetcher = async <T>(url: string): Promise<T> => {
  const response = await api.get<ApiResponse<T>>(url);
    const data = response.data?.data?.data as T;
    return data;
};

export const useClients = () => {
    const { data, error, isLoading, mutate } = useSWR<CreateClientDto[]>(`${endpoints.clients.getClients}?page=1&limit=100`, fetcher);

    return {
        clients: data || [],
        isLoading,
        isError: error,
        mutate,
    };
};
