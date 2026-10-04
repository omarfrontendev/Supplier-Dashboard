import { useMutation } from '@tanstack/react-query';
import { endpoints } from '@/api/endpoints';
import { toast } from 'sonner';
import { api } from '@/api/client';
import { getApiErrorMessage } from '@/lib/api-error';
import { useNavigate } from '@tanstack/react-router';

export type ResetPasswordPayload = {
    resetToken: string;
    newPassword: string;
    confirmNewPassword: string;
};

export const useResetPassword = () => {

    const navigate = useNavigate();

    return useMutation({
        mutationFn: async (body: ResetPasswordPayload) => {
            const { data } = await api.post(
                endpoints.auth.resetPassword,
                body
            );

            return data;
        },
        onSuccess: (data) => {
            toast.success(data?.message || "Password reset successfully.");
            navigate({ to: "/login" });
        },
        onError: (error) => {
            toast.error(getApiErrorMessage(error));
        },
    });
};