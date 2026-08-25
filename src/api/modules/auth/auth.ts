import { api } from "@/core/api/client";
import { endpoints } from "../../endpoints";
import type { LoginPayload, LoginResponse } from "./types";

export const login = async (data: LoginPayload): Promise<LoginResponse> => {
    const response = await api.post(endpoints.auth.login, data);
    return response.data;
};

export const logouthandler = async (): Promise<void> => {
    await api.post(endpoints.auth.logout);
};