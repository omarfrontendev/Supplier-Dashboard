// src/hooks/useUpsertShift.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/core/api/client';
import { toast } from 'sonner';
import { endpoints } from '@/api/endpoints';
import type { User } from '@/types/users';
import { useTranslation } from 'react-i18next';

export const useUpsertVendor = ({ id }) => {
  const queryClient = useQueryClient();
  const isEdit = Boolean(id);
  const { t } = useTranslation();

  return useMutation<any, any, User | any>({
    mutationFn: async (body) => {
      const url = isEdit
        ? endpoints.vendors.updateVendor(id!)
        : endpoints.vendors.createVendor;

      const method = isEdit ? 'patch' : 'post';

      const { data: { data } } = await api[method]<any>(url, body);
      return data;
    },

    onSuccess: () => {
      toast.success(
        isEdit ? t('vendors.successUpdated') : t('vendors.successCreate')
      );

      queryClient.invalidateQueries({ queryKey: ['vendors'] });

      if (id) {
        queryClient.invalidateQueries({ queryKey: ['vendor', id] });
      }
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || t('common.saveFailed', { entity: t('entities.vendor') })
      );
    },
  });
};
