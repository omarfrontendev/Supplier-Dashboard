// src/hooks/useUpsertArea.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/core/api/client';
import { toast } from 'sonner';
import { endpoints } from '@/api/endpoints';
import type { CreateBoothDto } from '@/types/booths';
import { useTranslation } from 'react-i18next';

type Params = {
  id?: string;
};

export const useUpsertBooth = ({ id }: Params = {}) => {
  const queryClient = useQueryClient();
  const isEdit = Boolean(id);
  const { t } = useTranslation();

  return useMutation<CreateBoothDto, any, CreateBoothDto>({
    mutationFn: async (body) => {
      const url = isEdit
        ? endpoints.booths.updateBooth(id!)
        : endpoints.booths.createBooth;
      const method = isEdit ? 'patch' : 'post';

      const { data } = await api[method]<CreateBoothDto>(url, {
        ...body,
        //  cameraConfig: {
        //   rtspUrl: "rtsp://10.0.0.10:554/Streaming/Channels/101",
        //   username: "admin",
        //   password: "password123"
        // },
      });
      return data;
    },

    onSuccess: () => {
      toast.success(
        isEdit ? t('booths.successUpdated') : t('booths.successCreate')
      );

      queryClient.invalidateQueries({ queryKey: ['booths'] });

      if (id) {
        queryClient.invalidateQueries({ queryKey: ['booth', id] });
      }
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || t('common.saveFailed', { entity: t('entities.booth') })
      );
    },
  });
};
