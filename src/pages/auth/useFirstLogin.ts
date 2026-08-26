import { useMutation } from '@tanstack/react-query';
import { api } from '@/core/api/client';
import { endpoints } from '@/api/endpoints';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/utils/helper';

export type FirstLoginPayload = {
    token: string;
    password: string;
    confirmPassword: string;
};

export const useFirstLogin = () => {
    return useMutation({
        mutationFn: async (body: FirstLoginPayload) => {
            const { data } = await api.post(
                endpoints.auth.activate,
                body
            );

            return data;
        },
        onError: (error) => {
            toast.error(getApiErrorMessage(error));
        },
    });
};