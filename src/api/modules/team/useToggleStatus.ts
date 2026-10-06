import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { endpoints } from "@/api/endpoints";
import { api } from "@/api/client";
import { getApiErrorMessage } from "@/lib/api-error";

type ToggleUserStatusParams = {
  id: string | null;
  isActive: boolean;
};

export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isActive }: ToggleUserStatusParams) => {
      const url = isActive
        ? endpoints.team.deactivateMember(id)
        : endpoints.team.activateMember(id);

      const { data } = await api.patch(url);

      return data;
    },

    onSuccess: (data, variables) => {
      toast.success(data?.message);

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
