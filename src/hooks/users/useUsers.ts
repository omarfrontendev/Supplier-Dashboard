// src/hooks/useUsers.ts
import { api } from '@/core/api/client';
import { endpoints } from '@/api/endpoints';
import type { ApiResponse } from '@/types/api';
import type { User } from '@/types/users';
import useSWR from 'swr';

const fetcher = async <T>(url: string): Promise<T> => {
  const response = await api.get<ApiResponse<T>>(url);
    return response.data?.data?.data as T;
};

export const useUsers = () => {
    const { data, error, isLoading, mutate } = useSWR<User[]>(endpoints.users.getAllUsers, fetcher);

    return {
        users: data || [],
        isLoading,
        isError: error,
        mutate,
    };
};
