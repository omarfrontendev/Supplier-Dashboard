import { useMutation } from "@tanstack/react-query";
import { login } from "@/api/modules/auth/auth";
import { toast } from "sonner";
import { setToken } from "@/api/auth/token";
import { getApiErrorMessage } from "@/lib/api-error";
import { useNavigate } from "@tanstack/react-router";

export const useLogin = () => {

    const navigate = useNavigate();

    return useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            setToken(data?.data?.accessToken);
            toast.success(data?.message || "Login successful!");
            navigate({ to: "/getting-started" });
        },
        onError: (error) => {
            toast.error(getApiErrorMessage(error));
        },
    });
};