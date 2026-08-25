// src/hooks/useUpsertArea.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AreaBody, CreateAreaResponse } from '@/types/area';
import { api } from '@/core/api/client';
import { toast } from 'sonner';
import { endpoints } from '@/api/endpoints';
import { useTranslation } from 'react-i18next';
import { cleanAndTrim } from '@/utils/clean-data';

type Params = {
  id?: string;
};

export const useUpsertArea = ({ id }: Params = {}) => {
  const queryClient = useQueryClient();
  const isEdit = Boolean(id);
  const { t } = useTranslation();

  return useMutation<CreateAreaResponse, any, AreaBody>({
    mutationFn: async (body) => {
      const cleanedPayload = cleanAndTrim(body);
      const url = isEdit
        ? endpoints.areas.update(id!)
        : endpoints.areas.create;

      const method = isEdit ? 'patch' : 'post';

      const { data } = await api[method]<CreateAreaResponse>(url, cleanedPayload);
      return data;
    },

    onSuccess: (res: any) => {
      toast.success(res?.message ? res?.message : isEdit ? t("areas.successUpdated") : t("areas.successCreate"));

      queryClient.invalidateQueries({ queryKey: ['areas'] });

      if (id) {
        queryClient.invalidateQueries({ queryKey: ['area', id] });
      }
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || t('common.saveFailed', { entity: t('entities.area') })
      );
    },
  });
};
