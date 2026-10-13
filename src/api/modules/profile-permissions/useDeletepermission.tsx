import { api } from "@/api/client";
import { endpoints } from "@/api/endpoints";
import { getApiErrorMessage } from "@/lib/api-error";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type DeletePermissionProfileParams = {
  id: string;
};

export function useDeletePermissionProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: DeletePermissionProfileParams) => {
      const response = await api.delete(endpoints.profiles.deleteProfile(id));

      return response.data;
    },

    onSuccess: (data) => {
      toast.success(data?.message || "Permission profile deleted successfully");

      queryClient.invalidateQueries({
        queryKey: ["permission-profiles"],
      });
    },

    onError: (error) => {
      toast.error(getApiErrorMessage(error));
      //   console.error("Failed to delete permission profile:", error);
      //   toast.error("Failed to delete permission profile");
    },
  });
}
