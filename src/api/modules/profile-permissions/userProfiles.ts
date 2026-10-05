// src/hooks/useUsers.ts

import { useQuery } from "@tanstack/react-query";
import { endpoints } from "@/api/endpoints";
import { api } from "@/api/client";
import {
  PermissionCatalogItem,
  PermissionProfilesData,
  PermissionsCatalogResponse,
} from "./types";
import { useLanguage } from "@/lib/i18n";

export type ApiResponse<T> = {
  status: string;
  message: string;
  data: T;
};

const fetchProfiles = async (): Promise<PermissionProfilesData> => {
  const response = await api.get<ApiResponse<PermissionProfilesData>>(
    endpoints.profiles.getProfiles,
  );

  return response.data.data;
};

export const useProfiles = () => {
  const { data, error, isFetching  , refetch } = useQuery<PermissionProfilesData, Error>({
    queryKey: ["profiles"],
    queryFn: fetchProfiles,
  });

  const profiles = data?.profiles.map(profile => {
    return {
        ...profile,
        kind: "custom",
    }
  })

  return {
    profiles: profiles ?? [],
    meta: data?.meta,
    isLoading: isFetching  ,
    isError: error,
    refetch,
  };
};

const fetchAvailableProfiles = async (): Promise<PermissionsCatalogResponse> => {
  const response = await api.get(endpoints.profiles.availableProfiles);

  return (response.data?.data ?? []) as PermissionsCatalogResponse;
};

export const useAvailableProfiles = () => {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["availableProfiles"],
    queryFn: fetchAvailableProfiles,
  });

  const { lang } = useLanguage();

  const catalog = Array.isArray(data) ? data : [];
  const availableProfiles = Object.values(
    (catalog as PermissionCatalogItem[])
      .filter(({ key }: any) => key?.startsWith("suppliers."))
      .map(({ key, nameEn, nameAr, moduleNameEn, moduleNameAr }) => {
        const parts = key.split(".");
        const method = parts.pop();
        const module = lang === "en" ? moduleNameEn : moduleNameAr;
        const name = lang === "en" ? nameEn : nameAr;

        return {
          module,
          method,
          name,
          key,
        };
      })
      .reduce((acc: any, item: any) => {
        if (!acc[item.module]) {
          acc[item.module] = {
            module: item.module,
            methods: [],
          };
        }

        acc[item.module].methods.push({
          method: item.method,
          name: item.name,
          key: item.key,
        });

        return acc;
      }, {}),
  );

  return {
    profiles: availableProfiles || [],
    isLoading,
    isError: error,
    refetch,
  };
};
