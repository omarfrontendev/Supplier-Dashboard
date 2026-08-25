// src/hooks/useUpsertArea.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/core/api/client';
import { toast } from 'sonner';
import { endpoints } from '@/api/endpoints';
import type { CreateRegionResponse, RegionBody } from '@/types/regions';
import { useTranslation } from 'react-i18next';

type Params = {
  id?: string;
};

export const useUpsertRegion = ({ id }: Params = {}) => {
  const queryClient = useQueryClient();
  const isEdit = Boolean(id);
  const { t } = useTranslation();

  return useMutation<CreateRegionResponse, any, RegionBody>({
    mutationFn: async (body) => {
      const url = isEdit
        ? endpoints.regions.updateRegion(id!)
        : endpoints.regions.createRegion;
      const method = isEdit ? 'patch' : 'post';

      const { data } = await api[method]<CreateRegionResponse>(url, body);
      return data;
    },

    onSuccess: (res: any) => {
      toast.success(res?.message ? res?.message : isEdit ? t("regions.successUpdated") : t("regions.successCreate"));

      queryClient.invalidateQueries({ queryKey: ['regions'] });

      if (id) {
        queryClient.invalidateQueries({ queryKey: ['region', id] });
      }
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || t('common.saveFailed', { entity: t('entities.region') })
      );
    },
  });
};
