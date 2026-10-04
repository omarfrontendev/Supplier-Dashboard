import { useMutation } from '@tanstack/react-query';
import { endpoints } from '@/api/endpoints';
import { toast } from 'sonner';
import { api } from '@/api/client';
import { getApiErrorMessage } from '@/lib/api-error';
import { useNavigate } from '@tanstack/react-router';

export type ActiveAccountPayload = {
    token: string;
    password: string;
    confirmPassword: string;
};

export const useActiveAccount = () => {

    const navigate = useNavigate();

    return useMutation({
        mutationFn: async (body: ActiveAccountPayload) => {
            const { data } = await api.post(
                endpoints.auth.activate,
                body
            );

            return data;
        },
        onSuccess: (data) => {
            toast.success(data?.message || "Account activated successfully!");
            navigate({ to: "/login" });
        },
        onError: (error) => {
            toast.error(getApiErrorMessage(error));
        },
    });
};