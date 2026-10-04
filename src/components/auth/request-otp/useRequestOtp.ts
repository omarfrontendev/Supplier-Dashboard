import { useMutation } from '@tanstack/react-query';
import { endpoints } from '@/api/endpoints';
import { toast } from 'sonner';
import { api } from '@/api/client';
import { getApiErrorMessage } from '@/lib/api-error';

export type RequestOTPPayload = {
    email: string;
};

export const useRequestOTP = () => {

    return useMutation({
        mutationFn: async (body: RequestOTPPayload) => {
            const { data } = await api.post(
                endpoints.auth.requestOTP,
                body
            );

            return data;
        },
        onSuccess: (data) => {
            toast.success(data?.message || "OTP sent successfully. Please check your registered contact details.");
        },
        onError: (error) => {
            toast.error(getApiErrorMessage(error));
        },
    });
};