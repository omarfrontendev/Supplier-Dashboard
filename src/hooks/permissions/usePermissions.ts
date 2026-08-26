// src/hooks/useUsers.ts
import { api } from '@/core/api/client';
import { endpoints } from '@/api/endpoints';
import useSWR from 'swr';

const fetcher = async (url: string): Promise<any[]> => {
    const response = await api.get<any>(url);
    return response.data?.data;
};

export const useAllPermissions = () => {
    const { data, error, isLoading, mutate } = useSWR<{ profiles: any[] }|any>(`${endpoints.permissions.getPermissions}?page=1&limit=100`, fetcher);

    return {
        permissionsProfiles: (data as any)?.profiles || [],
        isLoading,
        isError: error,
        mutate,
    };
};


export const useAvailablePermissions = () => {
  const { data, error, isLoading, mutate } = useSWR<any[]>(
    endpoints.permissions.availablePermissions,
    fetcher
  );

  const availablePermissions = Object.values(
    (data ?? [])
      .filter(({ key }) => key?.startsWith("suppliers."))
      .map(({ key, nameEn, nameAr, moduleNameEn }) => {
        const parts = key.split(".");
        const method = parts.pop();
        const module = moduleNameEn;

        return {
          module,
          method,
          nameEn,
          nameAr,
          key,
        };
      })
      .reduce((acc: any, item) => {
        if (!acc[item.module]) {
          acc[item.module] = {
            module: item.module,
            methods: [],
          };
        }

        acc[item.module].methods.push({
          method: item.method,
          nameEn: item.nameEn,
          nameAr: item.nameAr,
          key: item.key,
        });

        return acc;
      }, {})
  );

  return {
    availablePermissions,
    isLoading,
    isError: error,
    mutate,
  };
};
