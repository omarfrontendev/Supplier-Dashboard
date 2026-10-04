import { useMutation } from '@tanstack/react-query';
import { endpoints } from '@/api/endpoints';
import { toast } from 'sonner';
import { api } from '@/api/client';
import { getApiErrorMessage } from '@/lib/api-error';

export type VerifyOTPPayload = {
    email: string;
    code: string;
};

export const useVerifyOTP = () => {

    return useMutation({
        mutationFn: async (body: VerifyOTPPayload) => {
            const { data } = await api.post(
                endpoints.auth.verifyOTP,
                body
            );

            return data;
        },
        onSuccess: (data) => {
            toast.success(data?.message || "OTP verified successfully.");
        },
        onError: (error) => {
            toast.error(getApiErrorMessage(error));
        },
    });
};