import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/core/api/client';
import { toast } from 'sonner';
import { endpoints } from '@/api/endpoints';
import { useTranslation } from 'react-i18next';

type Params = {
  id?: string;
};

export const useDeleteMall = ({ id }: Params = {}) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<void, any, string>({
    mutationFn: async (mallId) => {
      const url = endpoints.malls.deleteMall(mallId);
      await api.delete(url);
    },

    onSuccess: () => {
      toast.success(t("malls.mallsSuccessDeleted"));

      queryClient.invalidateQueries({ queryKey: ['malls'] });

      if (id) {
        queryClient.invalidateQueries({ queryKey: ['mall', id] });
      }
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || t('common.deleteFailed', { entity: t('entities.mall') })
      );
    },
  });
};
