import { useMutation } from '@tanstack/react-query';
import { api } from '@/core/api/client';
import { endpoints } from '@/api/endpoints';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/utils/helper';

export type ChangePasswordPayload = {
  resetToken: string;
  newPassword: string;
  confirmNewPassword: string;
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (body: ChangePasswordPayload) => {
      const { data } = await api.post(
        endpoints.auth.changePassword,
        body
      );

      return data;
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
};