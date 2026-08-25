// src/hooks/useUpsertArea.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/core/api/client';
import { toast } from 'sonner';
import { endpoints } from '@/api/endpoints';
import type { CreateMallResponse, MallBody } from '@/types/malls';
import { useTranslation } from 'react-i18next';

type Params = {
  id?: string;
};

export const useUpsertMall = ({ id }: Params = {}) => {
  const queryClient = useQueryClient();
  const isEdit = Boolean(id);
  const { t } = useTranslation();

  return useMutation<CreateMallResponse, any, MallBody>({
    mutationFn: async (body) => {
      const url = isEdit
        ? endpoints.malls.updateMall(id!)
        : endpoints.malls.createMall;
      const method = isEdit ? 'patch' : 'post';

      const { data } = await api[method]<CreateMallResponse>(url, body);
      return data;
    },

    onSuccess: (res: any) => {
      toast.success(res?.message ? res?.message : isEdit ? t("malls.successUpdated") : t("malls.successCreate"));

      queryClient.invalidateQueries({ queryKey: ['malls'] });

      if (id) {
        queryClient.invalidateQueries({ queryKey: ['mall', id] });
      }
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || t('common.saveFailed', { entity: t('entities.mall') })
      );
    },
  });
};
