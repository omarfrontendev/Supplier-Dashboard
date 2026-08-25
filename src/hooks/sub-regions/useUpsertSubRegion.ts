// src/hooks/useUpsertArea.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/core/api/client';
import { toast } from 'sonner';
import { endpoints } from '@/api/endpoints';
import type { CreateSubRegionResponse, SubRegionBody } from '@/types/sub-regions';
import { useTranslation } from 'react-i18next';

type Params = {
  id?: string;
};

export const useUpsertSubRegion = ({ id }: Params = {}) => {
  const queryClient = useQueryClient();
  const isEdit = Boolean(id);
  const { t } = useTranslation();

  return useMutation<CreateSubRegionResponse, any, SubRegionBody>({
    mutationFn: async (body) => {
      const url = isEdit
        ? endpoints.subRegions.updateSubRegion(id!)
        : endpoints.subRegions.createSubRegion;
      const method = isEdit ? 'patch' : 'post';

      const { data } = await api[method]<CreateSubRegionResponse>(url, body);
      return data;
    },

    onSuccess: (res: any) => {
      toast.success(res?.message ? res?.message : isEdit ? t("subregions.successUpdated") : t("subregions.successCreate"));

      queryClient.invalidateQueries({ queryKey: ['sub-regions'] });

      if (id) {
        queryClient.invalidateQueries({ queryKey: ['sub-region', id] });
      }
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || t('common.saveFailed', { entity: t('entities.subregion') })
      );
    },
  });
};
