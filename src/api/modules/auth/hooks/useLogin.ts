import { useMutation } from "@tanstack/react-query";
import { login } from "@/api/modules/auth/auth";
import { setToken } from "@/core/auth/token";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {

    const navigate = useNavigate();

    return useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            setToken(data?.data?.accessToken);
            toast.success(data?.message || "Login successful!");
            navigate("/");
        },
    });
};