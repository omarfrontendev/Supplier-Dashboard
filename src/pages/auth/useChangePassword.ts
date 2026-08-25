import { useMutation } from '@tanstack/react-query';
import { api } from '@/core/api/client';
import { endpoints } from '@/api/endpoints';

export type ChangePasswordPayload = {
  email: string;
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
  });
};