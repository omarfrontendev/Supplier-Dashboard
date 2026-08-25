import { api } from '@/core/api/client';
import { endpoints } from '@/api/endpoints';
import type { User } from '@/types/users';

import { useQuery, useQueryClient } from '@tanstack/react-query';

const fetchUser = async (id: string): Promise<User> => {
  const { data } = await api.get(endpoints.users.getgetUserById(id));
  return data?.data;
};

export const useSingleUser = (id?: string) => {
  const queryClient = useQueryClient();

  const {
    data,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['user', id],
    queryFn: () => fetchUser(id as string),
    enabled: !!id, // only run if id exists
  });

  return {
    user: data,
    isLoading,
    isError: error,
    mutate: () => {
      if (id) {
        queryClient.invalidateQueries({ queryKey: ['user', id] });
      }
    },
    refetch,
  };
};
