// src/hooks/useUpsertShift.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/core/api/client';
import { toast } from 'sonner';
import { endpoints } from '@/api/endpoints';
import type { CreateShiftResponse } from '@/types/shifts';
import type { User } from '@/types/users';
import { useTranslation } from 'react-i18next';
import { cleanAndTrim } from '@/utils/clean-data';

type Params = {
  id?: string;
};

export const useUpsertUser = ({ id }: Params = {}) => {
  const queryClient = useQueryClient();
  const isEdit = Boolean(id);
  const { t } = useTranslation();

  return useMutation<CreateShiftResponse, any, User | any>({
    mutationFn: async (body) => {
      const url = isEdit
        ? endpoints.users.updateUser(id!)
        : endpoints.users.createUsers;

      const method = isEdit ? 'patch' : 'post';
      const permissionProfileIds = [body?.permissionProfileIds];

      // delete body.profileId;
      const cleanedBody = cleanAndTrim({...body, permissionProfileIds } );

      const { data } = await api[method]<any>(url, cleanedBody);

      return data;
    },

    onSuccess: () => {
      toast.success(
        isEdit ? t('users.successUpdated') : t('users.successCreate')
      );

      queryClient.invalidateQueries({ queryKey: ['users'] });

      if (id) {
        queryClient.invalidateQueries({ queryKey: ['users', id] });
      }
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || t('common.saveFailed', { entity: t('entities.user') })
      );
    },
  });
};
