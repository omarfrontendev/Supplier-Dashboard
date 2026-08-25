import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/core/api/client';
import { toast } from 'sonner';
import { endpoints } from '@/api/endpoints';
import { useTranslation } from 'react-i18next';

type ToggleUserStatusParams = {
  id: string;
  isActive: boolean;
};

export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async ({ id, isActive }: ToggleUserStatusParams) => {
      const url = isActive
        ? endpoints.users.deactivateUser(id)
        : endpoints.users.activateUser(id);

      const { data } = await api.patch(url);

      return data;
    },

    onSuccess: (_, variables) => {
      toast.success(
        variables.isActive
          ? t('users.successDeactivated')
          : t('users.successActivated')
      );

      queryClient.invalidateQueries({
        queryKey: ['users'],
      });

      queryClient.invalidateQueries({
        queryKey: ['users', variables.id],
      });
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          t('common.updateFailed', {
            entity: t('entities.user'),
          })
      );
    },
  });
};