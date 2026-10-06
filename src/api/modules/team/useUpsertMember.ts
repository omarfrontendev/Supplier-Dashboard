import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { endpoints } from "@/api/endpoints";
import { TeamMemberPayload } from "@/store/features/team/types";
import { cleanAndTrim } from "@/lib/clean-data";
import { api } from "@/api/client";
import { getApiErrorMessage } from "@/lib/api-error";

type Params = {
  id?: string;
};

export const useUpsertMember = ({ id }: Params = {}) => {
  const queryClient = useQueryClient();
  const isEdit = Boolean(id);

  return useMutation<TeamMemberPayload>({
    mutationFn: async (body) => {
        const url = isEdit ? endpoints.team.updateMember(id!) : endpoints.team.createMember;

        const method = isEdit ? "patch" : "post";
        // const permissionProfileIds = [body?.permissionProfileIds];

        // delete body.profileId;
        const cleanedBody = cleanAndTrim(body);

        const { data } = await api[method]<any>(url, cleanedBody);

        return data;
    },

    onSuccess: (data) => {
      toast.success(
        data?.message || isEdit ? "User updated successfully!" : "User created successfully!",
      );

      queryClient.invalidateQueries({ queryKey: ["users"] });

      if (id) {
        queryClient.invalidateQueries({ queryKey: ["users", id] });
      }
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
};
