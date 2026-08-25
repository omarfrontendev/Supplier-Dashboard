// src/hooks/useUpsertShift.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/core/api/client';
import { toast } from 'sonner';
import { endpoints } from '@/api/endpoints';
import type { CreateShiftResponse, ShiftBody } from '@/types/shifts';
import { useTranslation } from 'react-i18next';

type Params = {
  id?: string;
};

export const useUpsertShift = ({ id }: Params = {}) => {
  const queryClient = useQueryClient();
  const isEdit = Boolean(id);
  const { t } = useTranslation();

  return useMutation<CreateShiftResponse, any, ShiftBody>({
    mutationFn: async (body) => {
      const url = isEdit
        ? endpoints.shifts.updateShift(id!)
        : endpoints.shifts.createShift;

      const method = isEdit ? 'patch' : 'post';

      const { data } = await api[method]<CreateShiftResponse>(url, body);
      return data;
    },

    onSuccess: (res: any) => {
      toast.success(res?.message ? res?.message : isEdit ? t("shifts.successUpdated") : t("shifts.successCreate"));


      queryClient.invalidateQueries({ queryKey: ['shifts'] });

      if (id) {
        queryClient.invalidateQueries({ queryKey: ['shift', id] });
      }
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || t('common.saveFailed', { entity: t('entities.shift') })
      );
    },
  });
};
