import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/core/api/client';
import { toast } from 'sonner';
import { endpoints } from '@/api/endpoints';
import { useTranslation } from 'react-i18next';

type Params = {
  id?: string;
};

export const useDeletePermission = ({ id }: Params = {}) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<void, any, string>({
    mutationFn: async (permissionId) => {
      const url = endpoints.permissions.deletePermission(permissionId);
      await api.delete(url);
    },

    onSuccess: () => {
      toast.success(t("roles.successDeleted"));

      queryClient.invalidateQueries({ queryKey: ['roles'] });

      if (id) {
        queryClient.invalidateQueries({ queryKey: ['role', id] });
      }
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || t('common.deleteFailed', { entity: t('entities.role') })
      );
    },
  });
};
