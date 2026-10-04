import { useMutation } from "@tanstack/react-query";
import { logouthandler } from "@/api/modules/auth/auth";
// import { logout } from "@/core/auth/auth-handler";
// import { useNavigate } from "react-router-dom";

export const useLogout = () => {

    // const navigate = useNavigate();

    return useMutation({
        mutationFn: logouthandler,
        onSuccess: () => {
            // logout()
            // navigate("/");
        },
    });
};