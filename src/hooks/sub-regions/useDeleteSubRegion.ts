import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/core/api/client';
import { toast } from 'sonner';
import { endpoints } from '@/api/endpoints';
import { useTranslation } from 'react-i18next';

type Params = {
  id?: string;
};

export const useDeleteSubRegion = ({ id }: Params = {}) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  return useMutation<void, any, string>({
    mutationFn: async (subRegionId) => {
      const url = endpoints.subRegions.deleteSubRegion(subRegionId);
      await api.delete(url);
    },

    onSuccess: () => {
      toast.success(t("subregions.subregionSuccessDeleted"));

      queryClient.invalidateQueries({ queryKey: ['sub-regions'] });

      if (id) {
        queryClient.invalidateQueries({ queryKey: ['sub-region', id] });
      }
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || t('common.deleteFailed', { entity: t('entities.subregion') })
      );
    },
  });
};
