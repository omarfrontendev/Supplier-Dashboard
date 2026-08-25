import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/core/api/client';
import { toast } from 'sonner';
import { endpoints } from '@/api/endpoints';
import { useTranslation } from 'react-i18next';

type Params = {
  id?: string;
};

export const useDeleteUser = ({ id }: Params = {}) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<void, any, string>({
    mutationFn: async (userId) => {
      const url = endpoints.users.deleteUser(userId);
      await api.delete(url);
    },

    onSuccess: () => {
      toast.success(t('users.SuccessDeleted'));

      queryClient.invalidateQueries({ queryKey: ['users'] });

      if (id) {
        queryClient.invalidateQueries({ queryKey: ['users', id] });
      }
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || t('common.deleteFailed', { entity: t('entities.user') })
      );
    },
  });
};
