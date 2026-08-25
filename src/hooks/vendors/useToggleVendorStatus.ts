// src/hooks/useUpsertShift.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/core/api/client';
import { toast } from 'sonner';
import { endpoints } from '@/api/endpoints';
import { useTranslation } from 'react-i18next';

type Params = {
    id?: string;
};

export const useToggleVendorStatus = ({ id }: Params) => {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    return useMutation({
        mutationFn: async (body: any) => {
            const url = endpoints.vendors.toggleStatus(id)

            const method = 'patch';

            const { data: { data } } = await api[method]<any>(url, body);
            return data;
        },

        onSuccess: () => {
            toast.success(t("vendors.successToggled"));

            queryClient.invalidateQueries({ queryKey: ['vendors'] });

            if (id) {
                queryClient.invalidateQueries({ queryKey: ['vendors', id] });
            }
        },

        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message || t('common.saveFailed', { entity: t('entities.vendor') })
            );
        },
    });
};
