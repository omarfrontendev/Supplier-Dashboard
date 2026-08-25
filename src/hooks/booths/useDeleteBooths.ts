import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/core/api/client';
import { toast } from 'sonner';
import { endpoints } from '@/api/endpoints';
import { useTranslation } from 'react-i18next';

type Params = {
  id?: string;
};

export const useDeleteBooth = ({ id }: Params = {}) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<void, any, string>({
    mutationFn: async (boothId) => {
      const url = endpoints.booths.deleteBooth(boothId);
      await api.delete(url);
    },

    onSuccess: () => {
      toast.success(t('booths.SuccessDeleted'));

      queryClient.invalidateQueries({ queryKey: ['booths'] });

      if (id) {
        queryClient.invalidateQueries({ queryKey: ['mall', id] });
      }
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || t('common.deleteFailed', { entity: t('entities.booth') })
      );
    },
  });
};
