// src/hooks/useUpsertShift.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/core/api/client';
import { toast } from 'sonner';
import { endpoints } from '@/api/endpoints';
import type { CreateShiftResponse } from '@/types/shifts';
import type { User } from '@/types/users';
import { useTranslation } from 'react-i18next';

type Params = {
  id?: string;
};

export const useUpsertPermission = ({ id }: Params = {}) => {
  const queryClient = useQueryClient();
  const isEdit = Boolean(id);
  const { t } = useTranslation();

  return useMutation<CreateShiftResponse, any, User | any>({
    mutationFn: async (body) => {
      const url = isEdit
        ? endpoints.permissions.updatePermission(id!)
        : endpoints.permissions.createPermission;

      const method = isEdit ? 'patch' : 'post';

      const { data } = await api[method]<CreateShiftResponse>(url, body);
      return data;
    },

    onSuccess: () => {
      toast.success(
        isEdit ? t('roles.successUpdated') : t('roles.successCreate')
      );

      queryClient.invalidateQueries({ queryKey: ['roles'] });

      if (id) {
        queryClient.invalidateQueries({ queryKey: ['role', id] });
      }
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || t('common.saveFailed', { entity: t('entities.role') })
      );
    },
  });
};
