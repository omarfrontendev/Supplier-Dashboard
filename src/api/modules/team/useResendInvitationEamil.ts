import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { endpoints } from "@/api/endpoints";
import { api } from "@/api/client";
import { getApiErrorMessage } from "@/lib/api-error";

type ToggleUserStatusParams = {
  id: string;
};

export const useResendInvitationEamil = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: ToggleUserStatusParams) => {
      const url = endpoints.team.resendInvitationEmail(id);

      const { data } = await api.post(url);

      return data;
    },

    onSuccess: (e, variables) => {
      toast.success(e.message);

      queryClient.invalidateQueries({
        queryKey: ["users"],
      });

      queryClient.invalidateQueries({
        queryKey: ["users", variables.id],
      });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
};
