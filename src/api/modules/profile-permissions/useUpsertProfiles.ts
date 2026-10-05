// src/hooks/useUpsertShift.ts
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { endpoints } from "@/api/endpoints";
import { api } from "@/api/client";
import { profilePermissionPayload } from "./types";
import { getApiErrorMessage } from "@/lib/api-error";

type Params = {
  id?: string;
};

export const useUpsertProfile = ({ id }: Params = {}) => {
  const isEdit = Boolean(id);

  return useMutation<profilePermissionPayload>({
    mutationFn: async (body) => {
      const url = isEdit ? endpoints.profiles.updateProfile(id!) : endpoints.profiles.createProfile;

      const method = isEdit ? "patch" : "post";

      const { data } = await api[method]<profilePermissionPayload>(url, body);
      return data;
    },

    onSuccess: (data) => {
      console.log(data)
      toast.success(
        data?.message
        //  || isEdit
        //   ? "profile permission updated successfully!"
        //   : "profile permission created successfully!",
      );
    },

    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
};
