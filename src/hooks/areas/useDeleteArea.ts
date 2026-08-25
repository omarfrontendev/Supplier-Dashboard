import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { deleteArea } from '@/api/modules/areas';

type Params = {
  id?: string;
};

export const useDeleteArea = ({ id }: Params = {}) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation<void, any, string>({
    mutationFn: async (areaId) => await deleteArea(areaId),

    onSuccess: () => {
      toast.success(t("areas.areaSuccessDeleted"));

      queryClient.invalidateQueries({ queryKey: ['areas'] });

      if (id) {
        queryClient.invalidateQueries({ queryKey: ['area', id] });
      }
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || t('common.deleteFailed', { entity: t('entities.area') })
      );
    },
  });
};
